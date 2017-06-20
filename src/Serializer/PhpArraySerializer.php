<?php

namespace Gdbots\Pbj\Serializer;

use Gdbots\Common\Util\ArrayUtils;
use Gdbots\Pbj\Assertion;
use Gdbots\Pbj\Codec;
use Gdbots\Pbj\Enum\FieldRule;
use Gdbots\Pbj\Exception\GdbotsPbjException;
use Gdbots\Pbj\Exception\InvalidResolvedSchema;
use Gdbots\Pbj\Field;
use Gdbots\Pbj\Message;
use Gdbots\Pbj\MessageRef;
use Gdbots\Pbj\MessageResolver;
use Gdbots\Pbj\Schema;
use Gdbots\Pbj\SchemaId;
use Gdbots\Pbj\WellKnown\DynamicField;
use Gdbots\Pbj\WellKnown\GeoPoint;

class PhpArraySerializer implements Serializer, Codec
{
    /**
     * {@inheritdoc}
     * @return Message
     */
    public function deserialize($data, array $options = [])
    {
        $this->options = $options;

        Assertion::keyIsset(
            $data,
            Schema::PBJ_FIELD_NAME,
            sprintf(
                '[%s::%s] Array provided must contain the [%s] key.',
                get_called_class(),
                __FUNCTION__,
                Schema::PBJ_FIELD_NAME
            )
        );

        return $this->doDeserialize($data);
    }

    /**
     * @param array $data
     * @return Message
     *
     * @throws \Exception
     * @throws GdbotsPbjException
     */
    private function doDeserialize(array $data)
    {
        $schemaId = SchemaId::fromString((string) $data[Schema::PBJ_FIELD_NAME]);
        $className = MessageResolver::resolveId($schemaId);

        /** @var Message $message */
        $message = new $className();
        Assertion::isInstanceOf($message, 'Gdbots\Pbj\Message');

        if ($message::schema()->getCurieMajor() !== $schemaId->getCurieMajor()) {
            throw new InvalidResolvedSchema($message::schema(), $schemaId, $className);
        }

        $schema = $message::schema();

        foreach ($data as $fieldName => $value) {
            if (!$schema->hasField($fieldName)) {
                continue;
            }

            if (null === $value) {
                $message->clear($fieldName);
                continue;
            }

            $field = $schema->getField($fieldName);
            $type = $field->getType();

            switch ($field->getRule()->getValue()) {
                case FieldRule::A_SINGLE_VALUE:
                    $message->set($fieldName, $type->decode($value, $field, $this));
                    break;

                case FieldRule::A_SET:
                case FieldRule::A_LIST:
                    Assertion::isArray($value, sprintf('Field [%s] must be an array.', $fieldName), $fieldName);
                    $values = [];
                    foreach ($value as $v) {
                        $values[] = $type->decode($v, $field, $this);
                    }

                    if ($field->isASet()) {
                        $message->addToSet($fieldName, $values);
                    } else {
                        $message->addToList($fieldName, $values);
                    }
                    break;

                case FieldRule::A_MAP:
                    Assertion::true(
                        ArrayUtils::isAssoc($value),
                        sprintf('Field [%s] must be an associative array.', $fieldName),
                        $fieldName
                    );
                    foreach ($value as $k => $v) {
                        $message->addToMap($fieldName, $k, $type->decode($v, $field, $this));
                    }
                    break;

                default:
                    break;
            }
        }

        return $message->set(Schema::PBJ_FIELD_NAME, $schema->getId()->toString())->populateDefaults();
    }
}
