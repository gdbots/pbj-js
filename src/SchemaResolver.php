<?php

namespace Gdbots\Pbj;

use Gdbots\Pbj\Exception\MoreThanOneMessageForMixin;
use Gdbots\Pbj\Exception\NoMessageForCurie;
use Gdbots\Pbj\Exception\NoMessageForMixin;
use Gdbots\Pbj\Exception\NoMessageForQName;
use Gdbots\Pbj\Exception\NoMessageForSchemaId;

final class SchemaResolver
{

    /**
     * Returns the fully qualified php class name to be used for the provided curie.
     *
     * @param SchemaCurie $curie
     * @return string
     * @throws NoMessageForCurie
     */
    public static function resolveCurie(SchemaCurie $curie)
    {
        $key = $curie->toString();
        if (isset(self::$resolved[$key])) {
            return self::$resolved[$key];
        }

        if (isset(self::$messages[$key])) {
            $className = self::$messages[$key];
            self::$resolved[$key] = $className;
            return $className;
        }

        throw new NoMessageForCurie($curie);
    }

    /**
     * Returns the SchemaCurie for the given SchemaQName.
     *
     * @param SchemaQName $qname
     * @return SchemaCurie
     *
     * @throws NoMessageForQName
     */
    public static function resolveQName(SchemaQName $qname)
    {
        $key = $qname->toString();

        if (isset(self::$resolvedQnames[$key])) {
            return self::$resolvedQnames[$key];
        }

        $qvendor = $qname->getVendor();
        $qmessage = $qname->getMessage();

        foreach (self::$messages as $id => $class) {
            list($vendor, $package, $category, $message) = explode(':', $id);
            if ($qvendor === $vendor && $qmessage === $message) {
                return self::$resolvedQnames[$key] = SchemaCurie::fromString($vendor.':'.$package.':'.$category.':'.$message);
            }
        }

        throw new NoMessageForQName($qname);
    }

    /**
     * Adds a single schema to the resolver.  This is used in tests or dynamic
     * message schema creation (not a typical use case).
     *
     * @param Schema $schema
     */
    public static function registerSchema(Schema $schema)
    {
        self::$messages[$schema->getId()->getCurieMajor()] = $schema->getClassName();
    }

    /**
     * Adds a single schema id and class name.
     * @see SchemaId::getCurieMajor
     *
     * @param SchemaId|string $id
     * @param string $className
     */
    public static function register($id, $className)
    {
        if ($id instanceof SchemaId) {
            $id = $id->getCurieMajor();
        }
        self::$messages[(string) $id] = $className;
    }

    /**
     * Registers an array of id => className values to the resolver.
     *
     * @param array $map
     */
    public static function registerMap(array $map)
    {
        if (empty(self::$messages)) {
            self::$messages = $map;
            return;
        }
        self::$messages = array_merge(self::$messages, $map);
    }

    /**
     * Return the one schema expected to be using the provided mixin.
     *
     * @param Mixin $mixin
     * @param string $inPackage
     * @param string $inCategory
     * @return Schema
     *
     * @throws MoreThanOneMessageForMixin
     * @throws NoMessageForMixin
     */
    public static function findOneUsingMixin(Mixin $mixin, $inPackage = null, $inCategory = null)
    {
        $schemas = self::findAllUsingMixin($mixin, $inPackage, $inCategory);
        if (1 !== count($schemas)) {
            throw new MoreThanOneMessageForMixin($mixin, $schemas);
        }

        return current($schemas);
    }

    /**
     * Returns an array of Schemas expected to be using the provided mixin.
     *
     * @param Mixin $mixin
     * @param string $inPackage
     * @param string $inCategory
     * @return Schema[]
     *
     * @throws NoMessageForMixin
     */
    public static function findAllUsingMixin(Mixin $mixin, $inPackage = null, $inCategory = null)
    {
        $mixinId = $mixin->getId()->getCurieMajor();
        $key = sprintf('%s%s%s', $mixinId, $inPackage, $inCategory);

        if (!isset(self::$resolvedMixins[$key])) {
            $filtered = !empty($inPackage) || !empty($inCategory);
            /** @var Message $class */
            $schemas = [];
            foreach (self::$messages as $id => $class) {
                if ($filtered) {
                    list($vendor, $package, $category, $message) = explode(':', $id);
                    if (!empty($inPackage) && $package != $inPackage) {
                        continue;
                    }
                    if (!empty($inCategory) && $category != $inCategory) {
                        continue;
                    }
                }

                $schema = $class::schema();
                if ($schema->hasMixin($mixinId)) {
                    $schemas[] = $schema;
                }
            }
            self::$resolvedMixins[$key] = $schemas;
        } else {
            $schemas = self::$resolvedMixins[$key];
        }

        if (empty($schemas)) {
            throw new NoMessageForMixin($mixin);
        }

        return $schemas;
    }
}
