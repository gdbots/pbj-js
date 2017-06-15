<?php

namespace Gdbots\Pbj;

use Gdbots\Common\FromArray;
use Gdbots\Common\ToArray;
use Gdbots\Pbj\Exception\FrozenMessageIsImmutable;
use Gdbots\Pbj\Exception\LogicException;
use Gdbots\Pbj\Exception\SchemaNotDefined;
use Gdbots\Pbj\Serializer\PhpArraySerializer;
use Gdbots\Pbj\Serializer\YamlSerializer;
use Gdbots\Pbj\Exception\RequiredFieldNotSet;

abstract class AbstractMessage implements Message, FromArray, ToArray, \JsonSerializable
{

    /**
     * {@inheritdoc}
     */
    final public function isInList($fieldName, $value)
    {
        if (empty($this->data[$fieldName]) || !is_array($this->data[$fieldName])) {
            return false;
        }

        return in_array($value, $this->data[$fieldName]);
    }

    /**
     * {@inheritdoc}
     */
    final public function getFromListAt($fieldName, $index, $default = null)
    {
        $index = (int) $index;
        if (empty($this->data[$fieldName])
            || !is_array($this->data[$fieldName])
            || !isset($this->data[$fieldName][$index])
        ) {
            return $default;
        }
        return $this->data[$fieldName][$index];
    }

    /**
     * {@inheritdoc}
     * @return static
     */
    final public function addToList($fieldName, array $values)
    {
        $this->guardFrozenMessage();
        $field = static::schema()->getField($fieldName);
        Assertion::true($field->isAList(), sprintf('Field [%s] must be a list.', $fieldName), $fieldName);

        foreach ($values as $value) {
            $field->guardValue($value);
            $this->data[$fieldName][] = $value;
        }

        unset($this->clearedFields[$fieldName]);
        return $this;
    }

    /**
     * {@inheritdoc}
     * @return static
     */
    final public function removeFromListAt($fieldName, $index)
    {
        $this->guardFrozenMessage();
        $field = static::schema()->getField($fieldName);
        Assertion::true($field->isAList(), sprintf('Field [%s] must be a list.', $fieldName), $fieldName);
        $index = (int) $index;

        if (empty($this->data[$fieldName])) {
            return $this;
        }

        array_splice($this->data[$fieldName], $index, 1);
        if (empty($this->data[$fieldName])) {
            $this->clearedFields[$fieldName] = true;
            return $this;
        }

        // reset the numerical indexes
        // todo: review, does this need to be optimized?
        $this->data[$fieldName] = array_values($this->data[$fieldName]);
        return $this;
    }

    /**
     * {@inheritdoc}
     */
    final public function isInMap($fieldName, $key)
    {
        if (empty($this->data[$fieldName]) || !is_array($this->data[$fieldName]) || !is_string($key)) {
            return false;
        }
        return isset($this->data[$fieldName][$key]);
    }

    /**
     * {@inheritdoc}
     */
    final public function getFromMap($fieldName, $key, $default = null)
    {
        if (!$this->isInMap($fieldName, $key)) {
            return $default;
        }
        return $this->data[$fieldName][$key];
    }

    /**
     * {@inheritdoc}
     * @return static
     */
    final public function addToMap($fieldName, $key, $value)
    {
        $this->guardFrozenMessage();
        $field = static::schema()->getField($fieldName);
        Assertion::true($field->isAMap(), sprintf('Field [%s] must be a map.', $fieldName), $fieldName);

        if (null === $value) {
            return $this->removeFromMap($fieldName, $key);
        }

        $field->guardValue($value);
        $this->data[$fieldName][$key] = $value;
        unset($this->clearedFields[$fieldName]);

        return $this;
    }

    /**
     * {@inheritdoc}
     * @return static
     */
    final public function removeFromMap($fieldName, $key)
    {
        $this->guardFrozenMessage();
        $field = static::schema()->getField($fieldName);
        Assertion::true($field->isAMap(), sprintf('Field [%s] must be a map.', $fieldName), $fieldName);

        unset($this->data[$fieldName][$key]);

        if (empty($this->data[$fieldName])) {
            $this->clearedFields[$fieldName] = true;
        }

        return $this;
    }
}
