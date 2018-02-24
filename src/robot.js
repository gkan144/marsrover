const {ORIENTATIONS, ROBOT_STATUSES, COMMANDS} = require('./values');
const {debug} = require('./utils');

class Robot {

  constructor(id, startX, startY, startOrientation) {
    this.state = {
      id: id,
      x: startX,
      y: startY,
      orientation: startOrientation,
      status: ROBOT_STATUSES.OK
    };

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

    this.commands = {
      [COMMANDS.ROTATE_LEFT]: (state, input, thisRobot) => {
        const newOrientation = thisRobot.orientationMap.get(state.orientation).get(COMMANDS.ROTATE_LEFT);
        debug(`Robot ${state.id}: Rotating Left from ${state.orientation} to ${newOrientation}`);
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
        debug(`Robot ${state.id}: Rotating Right from ${state.orientation} to ${newOrientation}`);
        return {
          state: {
            ...state,
            orientation: newOrientation
          },
          result: input
        };
      },
      [COMMANDS.MOVE_FORWARD]: (state, input) => {
        const {scents} = input;
        const currentPositionForScentSearch = `${state.x}${state.y}${state.orientation}`;

        debug(`Robot ${state.id}: Checking if my position and orientation have a scent.`);
        if(!scents.has(currentPositionForScentSearch)) {
          debug(`Robot ${state.id}: They do not.`);
          const {maxWidth, maxHeight} = input;
          const result = {scents};
          const newState = {
            ...state,
            ...this.moveForward(state.x, state.y, state.orientation)
          };
          debug(`Robot ${state.id}: Moved from (${state.x},${state.y}) to (${newState.x},${newState.y}).`);

          debug(`Robot ${state.id}: Checking if I have gone out of bounds.`);
          if(
            (newState.x > maxWidth) || (newState.x < 0) ||
            (newState.y > maxHeight) || (newState.y < 0)
          ) {
            debug(`Robot ${state.id}: I have. Moving back and leaving scent.`);
            result.scents = scents.set(currentPositionForScentSearch, true);
            newState.x = state.x;
            newState.y = state.y;
            newState.orientation = state.orientation;
            newState.status = ROBOT_STATUSES.LOST
          } else {
            debug(`Robot ${state.id}: I have not.`);
          }

          return {
            state: newState,
            result
          }
        } else {
          debug(`Robot ${state.id}: They do. Skipping command.`);
          return {
            state,
            result: input
          }
        }
      }
    };
  }

  executeCommand(command, input) {
    const {state: newState, result} = this.commands[command](this.state, input, this);
    this.state = newState;
    return result;
  }

  executeInstructions(instructions, input) {
    let results = [];
    debug(`Robot ${this.state.id}: Preparing to execute instructions: ${instructions}`);
    let currCmdIndex = 0;
    while(this.state.status === ROBOT_STATUSES.OK && currCmdIndex < instructions.length) {
      const command = instructions[currCmdIndex];
      debug(`Robot ${this.state.id}: Executing command: ${command}`);
      results.push(this.executeCommand(command, input));
      currCmdIndex += 1;
    }
    if(this.state.status !== ROBOT_STATUSES.OK) debug(`Robot ${this.state.id}: Stopped executing instructions due to damage.`);
    else debug(`Robot ${this.state.id}: I have finished this instruction set.`);

    return results;
  }

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
    return `Robot ${this.state.id} Position: (${this.state.x},${this.state.y}) looking ${this.state.orientation} Status: ${this.state.status}`
  }
}

module.exports = {
  Robot
};
