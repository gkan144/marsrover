/**
 * Enum for the available orientations.
 * @type {Object<string>}
 */
const ORIENTATIONS = {
  NORTH:'N',
  EAST:'E',
  SOUTH:'S',
  WEST:'W',
};

/**
 * Enum for the available commands.
 * @type {Object<string>}
 */
const COMMANDS = {
  ROTATE_LEFT: 'L',
  MOVE_FORWARD: 'F',
  ROTATE_RIGHT: 'R'
};

/**
 * Enum for the available robot statuses.
 * @type {Object<string>}
 */
const ROBOT_STATUSES = {
  OK: 'OK',
  LOST: 'LOST'
};

module.exports = {
  ORIENTATIONS,
  COMMANDS,
  ROBOT_STATUSES
};
