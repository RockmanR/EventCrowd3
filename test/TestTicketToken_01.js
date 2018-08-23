/**
* @dev this test is dedicated to test some of the Token features of MyToken_01 contract.
*/

const Token = artifacts.require("./TicketToken_01.sol");

contract('Testing the token contract (TicketToken_01)', async (accounts) => {

  /**
  * @dev this test tries to deploy TicketToken_01 contract then makes sure that it is
  * deployed/exist by calling it's owner.
  */
  it("TicketToken contract deployed successfully and owned by the Owner (Alice)", async () => {
     let owner = accounts[0];
     let tokenInstance   = await Token.deployed();
     let tokenInstance_owner = await tokenInstance.owner.call();
     assert.equal(tokenInstance_owner, owner);
  })

  /**
  * @dev this is a test for minting and assigning the minted Tokens to an account.
  */
  it("Mint 100 tokens and hand it over to Owner (Alice)", async () => {
     let tokenInstance   = await Token.deployed();
     await tokenInstance.mint(accounts[0],100);
     let aliceBalance = await tokenInstance.balanceOf.call(accounts[0]);
     assert.equal(aliceBalance, 100);
  })


  /**
  * @dev this is a test for the "transfer" function buy the Owner
  */
  it("Owner (Alice) to send 10 tokens to Bob", async () => {
     let tokenInstance   = await Token.deployed();
     await tokenInstance.transfer(accounts[1],10);
     let bobBalance = await tokenInstance.balanceOf.call(accounts[1]);
     assert.equal(bobBalance, 10);
  })

  /**
  * @dev this is a test for the "transfer" function by an account beside an Owner.
  * this is to prove that any body can do a transfer as long as they own tokens.
  */
  it("Bob to send 1 token to Ahmed", async () => {
     let tokenInstance   = await Token.deployed();
     await tokenInstance.transfer(accounts[2],1,{from: accounts[1]});
     let ahmedBalance = await tokenInstance.balanceOf.call(accounts[2]);
     assert.equal(ahmedBalance, 1);
  })

  /**
  * @dev this is a test for the "transferFrom" function.
  */
  it("Alice gives bob the right to transfer 1 of her tokens, then Bob transfer one token from Alice account to Ahmed", async () => {
     let tokenInstance   = await Token.deployed();
     await tokenInstance.approve(accounts[1],1)
     await tokenInstance.transferFrom(accounts[0],accounts[2],1,{from: accounts[1]});
     let ahmedBalance = await tokenInstance.balanceOf.call(accounts[2]);
     assert.equal(ahmedBalance, 2);
  })

})
