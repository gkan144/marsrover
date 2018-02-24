const fs = require('fs');

let promiseReadFile = (path, options) => {
  console.log(path);
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
        if(/([0-9]|[1-4][0-9])\s([0-9]|[1-4][0-9])/g.test(curr)) {
          const maxSize = curr.split(' ');
          acc.worldWidth = Number(maxSize[0]);
          acc.worldHeight = Number(maxSize[1]);
          return acc;
        } else {
          throw new Error(`Invalid world limit format: ${curr}`);
        }
      } else {
        if(index % 2 !== 0) {
          if(/([0-9]|[1-4][0-9])\s([0-9]|[1-4][0-9])\s[NEWS]/g.test(curr)) {
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
          if(/^[LRF]{1,100}$/g.test(curr)) {
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
