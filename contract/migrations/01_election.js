const Election = artifacts.require("Election");

module.exports = function (deployer, network, accounts) {
  deployer.deploy(Election);
};
