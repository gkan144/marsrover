const chai = require('chai');
const chaiAsPromised = require("chai-as-promised");
const sinon  = require('sinon');
const sinonChai = require("sinon-chai");

const {Robot} = require('../../src/robot');
const {ORIENTATIONS, ROBOT_STATUSES, COMMANDS} = require('../../src/values');

chai.use(chaiAsPromised);
chai.use(sinonChai);
const should = chai.should();

describe('Robot', function() {
  it('should exist', function() {
    should.exist(Robot);
  });
  it('should create a Robot with the correct state', function() {
    const robot = new Robot(1, 0, 0, ORIENTATIONS.NORTH);
    robot.should.deep.include({id: 1, state: {x: 0, y:0 , orientation: ORIENTATIONS.NORTH, status: ROBOT_STATUSES.OK}});
  });
  it('should contain an orientation map with keys for all orientations.', function() {
    const robot = new Robot();
    Object.keys(ORIENTATIONS).forEach(orientation => {
      const isOrientationAvailable = robot.orientationMap.has(ORIENTATIONS[orientation]);
      isOrientationAvailable.should.be.true;
    });
  });
  describe('Default commands', function () {
    it('should include a commands object with keys for every default command', function() {
      const robot = new Robot();
      Object.keys(COMMANDS).forEach(command => {
        const isCommandAvailable = robot.commands.hasOwnProperty(COMMANDS[command]);
        isCommandAvailable.should.be.true;
      });
    });
    it('should a include a left rotation handler that rotates left', function() {
      const robot = new Robot(999, 0, 0, ORIENTATIONS.NORTH);
      robot.orientationMap = new Map([
        [ORIENTATIONS.NORTH, new Map([
          [COMMANDS.ROTATE_LEFT, ORIENTATIONS.SOUTH]
        ])]
      ]);
      const {state} = robot.commands[COMMANDS.ROTATE_LEFT](robot.state, {}, robot);
      state.orientation.should.be.equal(ORIENTATIONS.SOUTH);
    });
    it('should a include a right rotation handler that rotates right', function() {
      const robot = new Robot(999, 0, 0, ORIENTATIONS.NORTH);
      robot.orientationMap = new Map([
        [ORIENTATIONS.NORTH, new Map([
          [COMMANDS.ROTATE_RIGHT, ORIENTATIONS.WEST]
        ])]
      ]);
      const {state} = robot.commands[COMMANDS.ROTATE_RIGHT](robot.state, {}, robot);
      state.orientation.should.be.equal(ORIENTATIONS.WEST);
    });
    describe('Move_forward default handler', function () {
      it('should have a move forward helper that moves forward correctly based on orientation', function() {
        const orientationsTest = {
          [ORIENTATIONS.NORTH]: {x: 0, y: 1},
          [ORIENTATIONS.EAST]: {x: 1, y: 0},
          [ORIENTATIONS.SOUTH]: {x: 0, y: -1},
          [ORIENTATIONS.WEST]: {x: -1, y: 0}
        };
        const robot = new Robot();
        Object.keys(ORIENTATIONS).forEach(orientation => {
          const result = robot.moveForward(0, 0, ORIENTATIONS[orientation]);
          result.should.be.deep.equal(orientationsTest[ORIENTATIONS[orientation]]);
        });
      });
      it('should move forward if no scent exists and there is room in the world', function() {
        const robot = new Robot(999, 0, 0, ORIENTATIONS.NORTH);
        const input = {scents: new Map(), maxWidth: 10, maxHeight: 10};
        const {state} = robot.commands[COMMANDS.MOVE_FORWARD](robot.state, input, robot);
        state.should.deep.include({x: 0, y: 1});
      });
      it('should move forward if a scent exists but its orientation does NOT match the robot\'s', function () {
        const robot = new Robot(999, 0, 0, ORIENTATIONS.NORTH);
        const input = {
          scents: new Map([
            [`00${ORIENTATIONS.SOUTH}`, true]
          ]), maxWidth: 10, maxHeight: 10
        };
        const {state} = robot.commands[COMMANDS.MOVE_FORWARD](robot.state, input, robot);
        state.should.deep.include({x: 0, y: 1});
      });
      it('should NOT move if a scent exists and its orientation matches the robot\'s', function() {
        const robot = new Robot(999, 0, 0, ORIENTATIONS.NORTH);
        const input = {
          scents: new Map([
            [`00${ORIENTATIONS.NORTH}`, true]
          ]), maxWidth: 10, maxHeight: 10
        };
        const {state} = robot.commands[COMMANDS.MOVE_FORWARD](robot.state, input, robot);
        state.should.deep.include({x: 0, y: 0});
      });
      it(`should revert the move if it falls off leaving a scent and reporting the damage`, function() {
        const robot = new Robot(999, 1, 1, ORIENTATIONS.NORTH);
        const input = {
          scents: new Map(), maxWidth: 1, maxHeight: 1
        };

        const {state, result} = robot.commands[COMMANDS.MOVE_FORWARD](robot.state, input, robot);
        const hasLeftScent = result.scents.has(`11${ORIENTATIONS.NORTH}`);

        state.should.deep.include({x: 1, y: 1, status: ROBOT_STATUSES.LOST});
        hasLeftScent.should.be.true;
      })
    });
  });
  describe('ExecuteCommand', function() {
    it('should exist', function() {
      const robot = new Robot();
      should.exist(robot.executeCommand);
    });
    it('should call the correct command with the correct input', function() {
      const robot = new Robot();
      const mockCommandKey = "Test-Command";
      const mockCommandHandler = sinon.stub().returns({state:{}, result: {}});
      const mockState = {test: 'state'};
      const mockInput = {input: 'test'};
      robot.commands = {
        [mockCommandKey]: mockCommandHandler
      };
      robot.state = mockState;

      robot.executeCommand(mockCommandKey, mockInput);
      mockCommandHandler.should.have.been.calledWith(mockState, mockInput, robot);
    });
    it('should update the robot\'s state and return the command\'s result with the command handler\'s return data', function() {
      const robot = new Robot();
      const mockCommandKey = "Test-Command";
      const mockState = {test: 'state'};
      const mockResult = {input: 'test'};
      const mockCommandHandler = sinon.stub().returns({state: mockState, result: mockResult});

      robot.commands = {
        [mockCommandKey]: mockCommandHandler
      };

      const result = robot.executeCommand(mockCommandKey, {});
      robot.state.should.be.equal(mockState);
      result.should.be.equal(mockResult);
    })
  });
  describe.skip('ExecuteInstructions', function() {
    //TODO Write tests for executeInstructions
  })
});