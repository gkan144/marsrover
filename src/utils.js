/**
 * Console.log wrapper that only logs during debug.
 * @param {...} args
 */
function debug(...args) {
  if(process.env.DEBUG === 'true') console.log(...args);
}

module.exports = {
  debug
};
