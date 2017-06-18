<?php

namespace Gdbots\Pbj;

use Gdbots\Pbj\Exception\GdbotsPbjException;
use Gdbots\Pbj\Exception\LogicException;
use Gdbots\Pbj\Exception\SchemaNotDefined;
use Gdbots\Pbj\Exception\RequiredFieldNotSet;

interface Message
{
    /**
     * Returns true if the map contains the provided key.
     *
     * @param string $fieldName
     * @param string $key
     *
     * @return bool
     */
    public function isInMap($fieldName, $key);

    /**
     * Returns the value of a key in a map or null if it doesn't exist.
     *
     * @param string $fieldName
     * @param string $key
     * @param mixed $default
     *
     * @return mixed
     */
    public function getFromMap($fieldName, $key, $default = null);

    /**
     * Adds a key/value pair to a map.
     *
     * @param string $fieldName
     * @param string $key
     * @param mixed $value
     *
     * @return static
     *
     * @throws GdbotsPbjException
     */
    public function addToMap($fieldName, $key, $value);

    /**
     * Removes a key/value pair from a map.
     *
     * @param string $fieldName
     * @param string $key
     *
     * @return static
     *
     * @throws GdbotsPbjException
     */
    public function removeFromMap($fieldName, $key);
}
