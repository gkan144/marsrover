const {ORIENTATIONS, ROBOT_STATUSES, COMMANDS} = require('./values');
const {debug} = require('./utils');

/**
 * Class representing a robot.
 */
class Robot {
  /**
   * Creates a Robot.
   * @param {number} id - The unique identifier of the robot.
   * @param {number} startX - The starting x coordinate of the robot.
   * @param {number} startY - The starting y coordinate of the robot.
   * @param {string} startOrientation - The starting orientation of the robot.
   */
  constructor(id, startX, startY, startOrientation) {
    this.id = id;
    this.state = {
      x: startX,
      y: startY,
      orientation: startOrientation,
      status: ROBOT_STATUSES.OK
    };

    /**
     * Maps each orientation to a new map that contains the rotation commands and the resulting orientations.
     * @type {Map<string, Map<string, string>>}
     */
    this.orientationMap = new Map([
      [ORIENTATIONS.NORTH, new Map([
        [COMMANDS.ROTATE_LEFT, ORIENTATIONS.WEST],
        [COMMANDS.ROTATE_RIGHT, ORIENTATIONS.EAST]
      ])],
      [ORIENTATIONS.EAST, new Map([
        [COMMANDS.ROTATE_LEFT, ORIENTATIONS.NORTH],
        [COMMANDS.ROTATE_RIGHT, ORIENTATIONS.SOUTH]
      ])],
      [ORIENTATIONS.SOUTH, new Map([
        [COMMANDS.ROTATE_LEFT, ORIENTATIONS.EAST],
        [COMMANDS.ROTATE_RIGHT, ORIENTATIONS.WEST]
      ])],
      [ORIENTATIONS.WEST, new Map([
        [COMMANDS.ROTATE_LEFT, ORIENTATIONS.SOUTH],
        [COMMANDS.ROTATE_RIGHT, ORIENTATIONS.NORTH]
      ])]
    ]);

    /**
     * @callback commandCallback
     * @param {{x: number, y: number, orientation: string, status: string}} state - The state of the robot.
     * @param {Object} input - Arbitrary input passed down into the handler.
     * @param {Object} thisRobot - this robot.
     * @returns {{state: Object, result: Object}}
     *
     * Contains all the available commands for the robot and the handlers that update its state.
     * @type {{[string]: commandCallback}}
     */
    this.commands = {
      [COMMANDS.ROTATE_LEFT]: (state, input, thisRobot) => {
        const newOrientation = thisRobot.orientationMap.get(state.orientation).get(COMMANDS.ROTATE_LEFT);
        debug(`Robot ${thisRobot.id}: Rotating Left from ${state.orientation} to ${newOrientation}`);
        return {
          state: {
            ...state,
            orientation: newOrientation
          },
          result: input
        }
      },
      [COMMANDS.ROTATE_RIGHT]: (state, input, thisRobot) => {
        const newOrientation = thisRobot.orientationMap.get(state.orientation).get(COMMANDS.ROTATE_RIGHT);
        debug(`Robot ${thisRobot.id}: Rotating Right from ${state.orientation} to ${newOrientation}`);
        return {
          state: {
            ...state,
            orientation: newOrientation
          },
          result: input
        };
      },
      [COMMANDS.MOVE_FORWARD]: (state, input, thisRobot) => {
        const {scents} = input;
        const currentPositionForScentSearch = `${state.x}${state.y}${state.orientation}`;

        debug(`Robot ${thisRobot.id}: Checking if my position and orientation have a scent.`);
        if(!scents.has(currentPositionForScentSearch)) {
          debug(`Robot ${thisRobot.id}: They do not.`);
          const {maxWidth, maxHeight} = input;
          const result = {scents};
          const newState = {
            ...state,
            ...this.moveForward(state.x, state.y, state.orientation)
          };
          debug(`Robot ${thisRobot.id}: Moved from (${state.x},${state.y}) to (${newState.x},${newState.y}).`);

          debug(`Robot ${thisRobot.id}: Checking if I have gone out of bounds.`);
          if(
            (newState.x > maxWidth) || (newState.x < 0) ||
            (newState.y > maxHeight) || (newState.y < 0)
          ) {
            debug(`Robot ${thisRobot.id}: I have. Moving back and leaving scent.`);
            result.scents = scents.set(currentPositionForScentSearch, true);
            newState.x = state.x;
            newState.y = state.y;
            newState.orientation = state.orientation;
            newState.status = ROBOT_STATUSES.LOST
          } else {
            debug(`Robot ${thisRobot.id}: I have not.`);
          }

          return {
            state: newState,
            result
          }
        } else {
          debug(`Robot ${thisRobot.id}: They do. Skipping command.`);
          return {
            state,
            result: input
          }
        }
      }
    };
  }

  /**
   * Executes a single command and returns the result if any.
   * @param {string} command - The command to execute.
   * @param {Object} input - Arbitrary input passed down into the command execution handler.
   * @returns {Object}
   */
  executeCommand(command, input) {
    const {state: newState, result} = this.commands[command](this.state, input, this);
    this.state = newState;
    return result;
  }

  /**
   * Executes a sequence of commands and returns their results.
   * @param {Array<string>} instructions - The instructions to execute.
   * @param {Object} input - Arbitrary input passed down into the command execution handler.
   * @returns {Array<Object>}
   */
  executeInstructions(instructions, input) {
    let results = [];
    debug(`Robot ${this.id}: Preparing to execute instructions: ${instructions}`);
    let currCmdIndex = 0;
    while(this.state.status === ROBOT_STATUSES.OK && currCmdIndex < instructions.length) {
      const command = instructions[currCmdIndex];
      debug(`Robot ${this.id}: Executing command: ${command}`);
      results.push(this.executeCommand(command, input));
      currCmdIndex += 1;
    }
    if(this.state.status !== ROBOT_STATUSES.OK) debug(`Robot ${this.id}: Stopped executing instructions due to damage.`);
    else debug(`Robot ${this.id}: I have finished this instruction set.`);

    return results;
  }

  /**
   * Helper method that returns a new position (x, y) based on the current position and the orientation provided.
   * @param {number} x - The current x coordinate.
   * @param {number} y - The current y coordinate.
   * @param {string} orientation - The current orientation.
   * @returns {{x: number, y: number}}
   */
  moveForward(x, y, orientation) {
    let newX = x;
    let newY = y;

    switch(orientation) {
      case(ORIENTATIONS.NORTH):
        newY += 1;
        break;
      case(ORIENTATIONS.EAST):
        newX += 1;
        break;
      case(ORIENTATIONS.SOUTH):
        newY -= 1;
        break;
      case(ORIENTATIONS.WEST):
        newX -= 1;
        break;
      default:
        throw new Error('Unknown orientation.');
    }
    return {x: newX, y: newY};
  };

  toString() {
    return `Robot ${this.id} Position: (${this.state.x},${this.state.y}) looking ${this.state.orientation} Status: ${this.state.status}`
  }
}

module.exports = {
  Robot
};
