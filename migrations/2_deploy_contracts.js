const EventCrowd  = artifacts.require('./EventCrowd_01.sol');
const TicketToken = artifacts.require('./TicketToken_01.sol');

module.exports = function(deployer) {
    return deployer
        .then(() => { return deployer.deploy(TicketToken); })
        .then(() => { return deployer.deploy(EventCrowd,TicketToken.address); });
};
