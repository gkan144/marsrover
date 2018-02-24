const fs = require('fs');
const {debug} = require('./utils');

let promiseReadFile = (path, options) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path, options, (err, data) => {
      if(err) reject(err);
      else resolve(data);
    });
  });
};

const initializeReadFileHandler = (handler) => {
  promiseReadFile = handler;
};

async function parseInputFile(path) {
  const data = await promiseReadFile(path, {encoding: 'utf8'});
  return data.split('\n').reduce((acc, curr, index) => {
    if(curr.trim().length > 0) {
      if(index === 0) {
        debug('Checking first row.');
        if(/([0-9]|[1-4][0-9])\s([0-9]|[1-4][0-9])/g.test(curr)) {
          debug(`First row is valid: ${curr}`);
          const maxSize = curr.split(' ');
          acc.worldWidth = Number(maxSize[0]);
          acc.worldHeight = Number(maxSize[1]);
          return acc;
        } else {
          throw new Error(`Invalid world limit format: ${curr}`);
        }
      } else {
        if(index % 2 !== 0) {
          debug(`Checking robot row: ${index}`);
          if(/([0-9]|[1-4][0-9])\s([0-9]|[1-4][0-9])\s[NEWS]/g.test(curr)) {
            debug(`Robot row is valid: ${curr}`);
            const robot = curr.split(' ');
            acc.robots.push({
              startX: Number(robot[0]),
              startY: Number(robot[1]),
              orientation: robot[2]
            });
            return acc;
          } else {
            throw new Error(`Invalid robot position format in line ${index}: ${curr}`);
          }
        } else {
          debug(`Checking instruction row: ${index}`);
          if(/^[LRF]{1,100}$/g.test(curr)) {
            debug(`Instruction row is valid: ${curr}`);
            acc.instructions.push(curr.split(''));
            return acc;
          } else {
            throw new Error(`Invalid instruction format in line ${index}: ${curr}`);
          }
        }
      }
    } else {
      return acc;
    }
  }, {worldWidth: 0, worldHeight: 0, robots: [], instructions: []});
}

module.exports = {
  initializeReadFileHandler,
  parseInputFile
};
