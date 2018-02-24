const {ORIENTATIONS, ORIENTATION_COMMAND_MAP, COMMANDS} = require('./values');

class Robot {

  constructor(startX, startY, startOrientation) {
    this.state = {
      x: startX,
      y: startY,
      orientation: startOrientation
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
      [COMMANDS.ROTATE_LEFT]: state => ({
        ...state,
        orientation: this.orientationMap.get(state.orientation).get(COMMANDS.ROTATE_LEFT)
      }),
      [COMMANDS.ROTATE_RIGHT]: state => ({
        ...state,
        orientation: this.orientationMap.get(state.orientation).get(COMMANDS.ROTATE_RIGHT)
      }),
      [COMMANDS.MOVE_FORWARD]: state => ({
        ...state,
        ...this.moveForward(state.x, state.y, state.orientation)
      })
    };
  }

  executeCommand(command, input) {
    const {scents} = input;

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
}