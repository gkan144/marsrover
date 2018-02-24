# Mars Rover

The solution was developed in Node.js 8.9.4 and used the Yarn package manager.

## Architecture
The solution for the test is contained in the [src](./src) directory. The code is split in four modules:
- [fileReader.js](./src/fileReader.js): This module contains the code responsible for reading an input file and turning
it into an object that can be used by the rest of the application. The format of that object is:
```json
{
  "worldWidth": "<number> - The maximum width of the planet.",
  "worldHeight": "<number> - The maximum height of the planet.",
  "robots": "Array<{startX: <number>,startY: <number>, orientation: <string>}> - An array that contains each robot's starting info.",
  "instructions": "Array<Array<string> - An array that contains arrays of commands for each robot."
}
```
- [robot.js](./src/robot.js): This module contains the main functionality of the program. It exports a [class](./src/robot.js#L7)
that represents a robot and the functionality it must have by default. The robot keeps track of its [state](./src/robot.js#L17),
meaning its position, orientation and status. It also maintains an [object](./src/robot.js#L57) that maps commands to handler
functions. Each handler function follows a specific interface. It takes in as arguments the current state of the robot,
an arbitrary input object and the whole robot object. It returns an updated state and a results object. The results
object contains any side effects that have to be applied to the environment as a result of the command. The robot also
contains methods for executing [single commands](./src/robot.js#L131) or [sequences of commands](./src/robot.js#L143).
- [utils.js](./src/utils.js): Contains a debug help function that logs only when the application is run with the
environment variable `DEBUG=true`.
- [values.js](./src/utils.js): Contains values used globally in the application, such as the available [Orientations](./src/values.js#5),
[Commands](./src/values.js#16) and [Robot Statuses](./src/values.js#26).

New commands can be added to the system by updating the code in [robot.commands](./src/robot.js#L57) and adding the new
commands in the [COMMANDS](./src/values.js#L16) enumeration. Also, commands can be added programmatically by updating
those objects during runtime.

The solution also contains unit tests for the [fileReader](./test/src/fileReader.test.js) and [robot](./test/src/robot.test.js)
code under [test](./test). The tests make use of the following libraries: 
- [mocha](https://mochajs.org/): Test runner
- [chai](http://chaijs.com/): Assertion library
- [sinon.js](http://sinonjs.org/): Spy, Stub and Mocking library

## Instructions
The application itself does not require any dependencies. As such, you do not need to do `yarn install` or `npm install`
before running. In order to execute the solution you can use `yarn start` or `npm start`. If you want to run it in debug
mode, where you can see extra output for each operation taken by the robots, use `yarn run debug` or `npm run debug`.

In order to execute the unit tests you will need to install the dev dependencies by using the commands stated before.
You can run the tests by using `yarn test` or `npm test`.
