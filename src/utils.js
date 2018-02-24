function debug(...args) {
  if(process.env.DEBUG === 'true') console.log(...args);
}

module.exports = {
  debug
};
