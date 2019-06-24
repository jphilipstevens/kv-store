const baseConfig  = require("./jest.config");
module.exports =  {
  ...baseConfig,
  testRegex: "\\.ispec\\.ts$",
  collectCoverage: false
};
