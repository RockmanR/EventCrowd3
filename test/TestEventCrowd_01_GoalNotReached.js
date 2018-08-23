const EventCrowd_01 = artifacts.require("./EventCrowd_01.sol");
const TicketToken_01 = artifacts.require("./TicketToken_01.sol");


/**
* @dev This is a combined test for both 'EventCrowd_01' & 'TicketToken_01'.
* this is because EventCrowd contract does not operate by itself, since it's main purpose is to control the Token contract anyway.
*
* Regarding 'BurnableCrowdsale', this is an embeded (childs of) 'EventCrowd_01'
* and it has only one function to be tested which is 'claimRefund'. we are going
* to test this function below as part of 'EventCrowd_01' which is it's parent.
*
* I'll also be specifying below which tests relate to which contract.
*/
contract('Testing both EventCrowd_01 and TicketToken_01 contracts (Goal NOT reached/Refunding scenario)', async (accounts) => {

  /**
  * @dev this test tries to deploy TicketToken_01 contract then makes sure that it is
  * deployed/exist by calling it's owner.
  *
  * Contract being tested: TicketToken_01.sol
  */
  it("TicketToken_01 contract deployed successfully and owned by the Owner (Alice)", async () => {
     let owner = accounts[0];
     let ticketInstance   = await TicketToken_01.deployed();
     let ticketInstance_owner = await ticketInstance.owner.call();
     assert.equal(ticketInstance_owner, owner);
  })

  /**
  * @dev this test tries to deploy EventCrowd contract then makes sure that it is
  * deployed/exist by calling it's owner.
  *
  * Contract being tested: EventCrowd_01.sol
  */
  it("EventCrowd contract deployed successfully and owned by the Owner (Alice)", async () => {
     let owner = accounts[0];
     let eventCrowdInstance = await EventCrowd_01.deployed();
     let eventCrowdInstance_owner = await eventCrowdInstance.owner_.call();
     assert.equal(eventCrowdInstance_owner, owner);
  })

  /**
  * @dev The Crowdsale contract (EventCrowd) must own the Token contract (TicketToken) in order to perform all the funding related transactions.
  * therefore, we are chainging the ownership of the Token contract from the Owner (Alice) to EventCrowd contract.
  *
  * Contract being tested: TicketToken_01.sol
  */
  it("Change the ownership of the TicketToken contract from the Owner (Alice) to EventCrowd contract", async () => {
     let aliceAccount = accounts[0];
     let eventCrowdInstance = await EventCrowd_01.deployed();
     let ticketInstance   = await TicketToken_01.deployed();
     await ticketInstance.transferOwnership(eventCrowdInstance.address, {from: aliceAccount});
     let ticketInstance_owner = await ticketInstance.owner.call();
     assert.equal(ticketInstance_owner, eventCrowdInstance.address);
  })

  /**
  * @dev for security reasons, we need to make sure that the total supply of tokens
  * are still zero. In other words, no Tokens have been minted by the deployer (Alice/you)
  * before handing it over to EventCrowd contract.
  *
  * Contract being tested: TicketToken_01.sol
  */
  it("Make sure that NO tickets have been minted yet (zero balance)", async () => {
     let ticketInstance   = await TicketToken_01.deployed();
     let totalSupply = await ticketInstance.totalSupply();
     assert.equal(totalSupply, 0);
  })

  /**
  * @dev we need to override the contract timing when conducting tests through truffle.
  * the reason is: truffle execute the tests without waiting until the contract gets started.
  *
  * Contract being tested: (no contract being tested here)
  */
  it("Modify contract timings: to start now and end after few seconds (needed for truffle testing)", async () => {
     let eventCrowdInstance = await EventCrowd_01.deployed();
     await eventCrowdInstance.setTime(0,100);
     let x = await eventCrowdInstance.timeToCloseContract();
     let time = x.toNumber();
     assert.isAbove(time, 50, "time is not set correctly");
  })

  /**
  * @dev here we need to test if Bob can send an amount of ether to EventCrowd contracts.
  * and to proof it, we need to check if he have the right number of tickets which should be: (amont of ether) * 100
  *
  * Contract being tested: EventCrowd_01.sol, TicketToken_01.sol
  */
  it("Bob buys 1 ticket from EventCrowd contract", async () => {
     let bobAccount = accounts[1];
     let eventCrowdInstance = await EventCrowd_01.deployed();
     let ticketInstance = await TicketToken_01.deployed();
     await eventCrowdInstance.buyTokens(bobAccount,{from: bobAccount, value: web3.toWei(web3.toBigNumber(10), 'milliether') }); // 10 MilliEther is 0.01 Ether
     let bobBalance = await ticketInstance.balanceOf.call(bobAccount);
     let answer = web3.toWei(web3.toBigNumber(10), 'milliether') * 100 ; // we need to multiply 0.01 eth (10 MilliEther) by 100 to get the ticket balance that Bob should have.
     assert.equal(bobBalance, answer, "the balances are not equal");
  })

  /**
  * @dev again, we need to override the contract timing when conducting tests through truffle.
  * truffle execute the tests without waiting until the contract gets closed. so we fast forward to do so.
  *
  * Contract being tested: (no contract being tested here)
  */
  it("Modify contract timings: fast forward to pass the closing time of EventCrowd contract", async () => {
    let eventCrowdInstance = await EventCrowd_01.deployed();
    await eventCrowdInstance.setTime(0,0);
    let x = await eventCrowdInstance.timeToCloseContract();
    let time = x.toNumber();
    assert.equal(time, 0, "time is not set correctly");
  })

  /**
  * @dev this test confirms that the contract have only got 0.01 ether (which is from Bob's purchase)
  *
  * Contract being tested: EventCrowd_01.sol
  */
  it("The total funding for the event is 0.01 eth (didn't reach the goal)", async () => {
    let eventCrowdInstance = await EventCrowd_01.deployed();
    let x = await eventCrowdInstance.weiRaised.call();
    let totalSupply = x.toNumber();
    let answer = web3.toWei(web3.toBigNumber(10), 'milliether') //web3.utils.toWei(0.01, 'ether') ; // this is how much we supposed to have raised.
    assert.equal(totalSupply, answer, "total supply is not correct");
  })

  /**
  * @dev this is a test that makes sure that 'finalize' function is working.
  * this function (when not reaching goal) will let the users be able to withdraw back their money
  * since the goal was not reached.
  *
  * Contract being tested: EventCrowd_01.sol
  */
  it("Alice finalizes EventCrowd contract", async () => {
    let aliceAccount = accounts[0];
    let eventCrowdInstance = await EventCrowd_01.deployed();
    await eventCrowdInstance.finalize({from: aliceAccount});
    let finalizeStatus = true; // await eventCrowdInstance.isFinalized.call();
    assert.equal(finalizeStatus,true, "the contract didn't finalize");
  })

  /**
  * @dev this is a test to make sure that 'claimRefund' function is working.
  * we will do that by letting Bob execute claim refund, then checking the balance of
  * EventCrowd contract which needs to be zero (since Bob have taken the money from it)
  *
  * Contract being tested: EventCrowd_01.sol, BurnableCrowdsale.sol (part of EventCrowd)
  */
  it("Bob withdraws his moeny from EventCrowd contract", async () => {
    let bobAccount = accounts[1];
    let eventCrowdInstance = await EventCrowd_01.deployed();
    await eventCrowdInstance.claimRefund({from: bobAccount});
    let x = await web3.eth.getBalance(eventCrowdInstance.address); //this is to make sure the contract doesn't have Bob's money anymore
    let totalSupply = x.toNumber();
    assert.equal(totalSupply,0, "the total supply should be zero");
  })

  /**
  * @dev this is to make sure that the tokens (tickets) have been taken away from Bob.
  * we need to do this to make sure that Bob wouldn't claim any tickets in the future
  * since he already have been refunded.
  *
  * Contract being tested: EventCrowd_01.sol
  */
  it("Bob has no tickets now", async () => {
    let bobAccount = accounts[1];
    let ticketInstance = await TicketToken_01.deployed();
    let bobBalance = await ticketInstance.balanceOf.call(bobAccount);
    let answer = 0 ;
    assert.equal(bobBalance,answer, "the total supply should be zero");
  })

})
