const {parseInputFile} = require('./src/fileReader');
const {Robot} = require('./src/robot');
const {ROBOT_STATUSES} = require('./src/values');
const {debug} = require('./src/utils');

const inputPath = './input.txt';

async function main() {
  try {
    debug(`Reading input file: ${inputPath}`);
    const worldData = await parseInputFile(inputPath);
    debug(`*********** World data: `, worldData);

    if(worldData.robots.length === worldData.instructions.length) {
      const input = {
        scents: new Map(),
        maxWidth: worldData.worldWidth,
        maxHeight: worldData.worldHeight
      };

      debug(`*********** Preparing to run test.`);
      worldData.robots.forEach((robotInfo, index) => {
        debug(`*********** Creating robot ${index}.`);
        const instructionsForRobot = worldData.instructions[index];
        const robot = new Robot(
          index, robotInfo.startX, robotInfo.startY, robotInfo.orientation
        );
        debug(`*********** Created robot ${index}. State:`);
        debug(robot.state);

        debug(`*********** Robot ${index} will execute instructions ${instructionsForRobot}`);
        const results = robot.executeInstructions(instructionsForRobot, input);
        debug(`*********** Robot ${index} returned the following results: `);
        debug(results);
        debug(`*********** Checking if robot ${index} is ok.`);
        if(robot.state.status !== ROBOT_STATUSES.OK) {
          debug(`***********   It is not. Updating global scents map with the scents reported by the robot.`);
          input.scents = results[results.length - 1].scents;
        } else {
          debug(`***********   It is.`);
        }
        console.log(`${robot.state.x} ${robot.state.y} ${robot.state.orientation}${robot.state.status !== ROBOT_STATUSES.OK ? ` ${robot.state.status}` : ''}`);
        debug();
      });

    } else {
      console.error(new Error('Incompatible number of robots and instruction sets.'));
    }

  } catch(error) {
    console.error(error);
  }
}

main();
