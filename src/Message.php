<?php

namespace Gdbots\Pbj;

use Gdbots\Pbj\Exception\GdbotsPbjException;
use Gdbots\Pbj\Exception\LogicException;
use Gdbots\Pbj\Exception\SchemaNotDefined;
use Gdbots\Pbj\Exception\RequiredFieldNotSet;

interface Message
{

    /**
     * Returns true if the provided value is in the list of values.
     * This is a NOT a strict comparison, it uses "==".
     * @link http://php.net/manual/en/function.in-array.php
     *
     * @param string $fieldName
     * @param mixed $value
     *
     * @return bool
     */
    public function isInList($fieldName, $value);

    /**
     * Returns an item in a list or null if it doesn't exist.
     *
     * @param string $fieldName
     * @param int $index
     * @param mixed $default
     *
     * @return mixed
     */
    public function getFromListAt($fieldName, $index, $default = null);

    /**
     * Adds an array of values to an unsorted list/array (not unique).
     *
     * @param string $fieldName
     * @param array $values
     *
     * @return static
     *
     * @throws GdbotsPbjException
     */
    public function addToList($fieldName, array $values);

    /**
     * Removes the element from the array at the index.
     *
     * @param string $fieldName
     * @param int $index
     *
     * @return static
     *
     * @throws GdbotsPbjException
     */
    public function removeFromListAt($fieldName, $index);

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
