/**
 * Enum for the available orientations.
 * @type {{Orientations}}
 */
const ORIENTATIONS = {
  NORTH:'N',
  EAST:'E',
  SOUTH:'S',
  WEST:'W'
};

/**
 * Enum for the available commands.
 * @type {{Commands}}
 */
const COMMANDS = {
  ROTATE_LEFT: 'L',
  MOVE_FORWARD: 'F',
  ROTATE_RIGHT: 'R'
};

/**
 * Enum for the available robot statuses.
 * @type {{Robot_Statuses}}
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
