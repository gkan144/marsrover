const chai = require('chai');
const chaiAsPromised = require("chai-as-promised");
const sinon  = require('sinon');
const sinonChai = require("sinon-chai");

const fileReader = require('../../src/fileReader');

chai.use(chaiAsPromised);
chai.use(sinonChai);
const should = chai.should();

describe('fileReader', function() {
  it('should exist', function() {
    should.exist(fileReader);
  });
  it('should expose two methods', function() {
    should.exist(fileReader.initializeReadFileHandler);
    should.exist(fileReader.parseInputFile);
  });

  describe('fileReader.parseInputFile', function() {
    describe('Valid input tests', function() {

      const testValidInput = "30 25\n4 5 N\nRLFLLRLFFLR";
      const testOutput = {
        worldWidth: 30,
        worldHeight: 25,
        robots: [{startX: 4, startY: 5, orientation: 'N'}],
        instructions: [
          ['R','L','F','L','L','R','L','F','F','L','R']
        ]
      };
      const mockPromiseReadFile = sinon.stub().resolves(testValidInput);

      before(function () {
        fileReader.initializeReadFileHandler(mockPromiseReadFile);
      });
      afterEach(function() {
        mockPromiseReadFile.resetHistory();
      });
      it('should pass the input path to the readFile handler', async function() {
        const testPath = 'test';
        await fileReader.parseInputFile(testPath);
        mockPromiseReadFile.should.have.been.calledWith(testPath);
      });
      it('should parse the input file and return an object with the correct info', async function() {
        const output = await fileReader.parseInputFile();
        output.should.be.deep.equal(testOutput);
      })
    });
    describe('Invalid input tests', function() {
      it('should throw on invalid world info input', async function() {
        const testInput = '101asd';
        fileReader.initializeReadFileHandler(sinon.stub().resolves(testInput));
        await fileReader.parseInputFile().should.be.rejected;
      });
      it('should throw on invalid robot info input', async function() {
        const testInput = '50 20\n100asdfasf P';
        fileReader.initializeReadFileHandler(sinon.stub().resolves(testInput));
        await fileReader.parseInputFile().should.be.rejected;
      });
      it('should throw on invalid instuction input', async function() {
        const testInput = '50 20\n10 20 N\nLRFP';
        fileReader.initializeReadFileHandler(sinon.stub().resolves(testInput));
        await fileReader.parseInputFile().should.be.rejected;
      });
    })
  });
});