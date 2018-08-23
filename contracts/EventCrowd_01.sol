pragma solidity ^0.4.24;

import 'openzeppelin-solidity/contracts/crowdsale/emission/MintedCrowdsale.sol';
import 'openzeppelin-solidity/contracts/crowdsale/distribution/RefundableCrowdsale.sol';
import './BurnableCrowdsale.sol';
import './TicketToken_01.sol';

   /**
   * @dev This EventCrowd_01 contract contins a collection of OpenZeppelin contracts. And they are:
   * - Crowdsale:             this is the basic (bare minimum) for a crowdsale functionality. the add-ons are below..
   * - Minted Crowdsale:      this add-on feature let the contract mint Tokens only when an ether payment is made by an a user.
   * - Timed Crowdsale:       this add-on feature provide the ability to have a start and end date for a crowdsale.
   * - Finalizable Crowdsale: this add-on let the contract to collect the funds and only send it to the Owner when the deadline is achieved and "Finalize" function is triggered by the Onwer.
   * - Refundable Crowdsale:  this add-on provides refunding option when the funding goal is not reached post the deadline.
   * - Burnable Crowdsale:    this add-on burns a user tokens when he/she requests for refunding.
   *
   * @dev the "_wallet" address should be the authorized Geth account in case you are using Geth
   * or the HD wallet from truffle with mnemonic from Metamask (or other) for Infura deployment.
   */

contract EventCrowd_01 is BurnableCrowdsale, MintedCrowdsale {
    address public owner_;
    address _wallet = msg.sender;
    uint256 _openingTime = now + 3 minutes + 1 seconds;
    uint256 _closingTime = _openingTime + 5 minutes + 1 seconds;
    uint256 _rate = 100;
    uint goal = 1 ether;

    /**
    * @dev We are getting just one external variable (TicketToken_01) for the constructor.
    * all the rest of variables are hard coded in "EventCrowd_01" contract.
    * the main reason for this, is that i've faced issues wiht Java Script's Asyncronous code when i'm requesting
    * the block number to set the time for "openingTime" and "closingTime".
    * So as a workaround, I've included them in solidity with "now" and "seconds".
    */
    constructor
        (
            TicketToken_01 _token
        )
        public
        Crowdsale(_rate, _wallet, _token)
        TimedCrowdsale(_openingTime, _closingTime)
        RefundableCrowdsale(goal)
        BurnableCrowdsale(_token)
        {
         owner_ = msg.sender;
        }


            /**
            * @dev this function is to get the time to start the funding. it will be accessed by web3 instance
            */
            function timeToStartContract() public view returns (uint){
              uint opTime;
              if (openingTime > now){
                opTime = openingTime - now;
              } else {
                opTime = 0;
              }
              return opTime;
            }

            /**
            * @dev this function is to get the time to close the funding. it will be accessed by web3 instance
            */
            function timeToCloseContract() public view returns (uint){
              uint clsTime;
              if (closingTime > now){
                clsTime = closingTime - now;
              } else {
                clsTime = 0;
              }
              return clsTime;
            }

            /**
            * @dev this function is used to get Excrow address, then that
            * address will be used to get it's balance. it will be accessed by web3 instance
            */
            function getEscrowAddress() public view returns (address){
              return escrow;
            }

            /**
            * @dev this function is used to show 'true' when the EventCrowd contract gets started.
            * it will be accessed by web3 instance
            */
            function getStartStatus() public view returns (bool){
              bool x;
              if (timeToStartContract() == 0){
                x = true;
              } else {
                x = false;
              }
              return x;
            }

            /**
            * @dev this function is used to show 'true' when the EventCrowd gets closed (passed the deadline).
            * it will be accessed by web3 instance
            */
            function getCloseStatus() public view returns (bool){
              bool x;
              if (timeToCloseContract() == 0){
                x = true;
              } else {
                x = false;
              }
              return x;
            }

            /**
            * @dev emergencyStop is a circuit breaker to terminate the contract and activate the refunding feature.
            *
            * It can only be executed by the owner of the EventCrowd.
            * It won't work if the owner have already took the money out of the contract, because it will be meaningless at that time.
            *
            * It does three main things:
            *  1. It force the contract to expire, so nobody can send funds to it anymore.
            *  2. It force the contract to finalize. This is a requirement for refunding.
            *  3. It force the excrow account status to be 'Refunding'. This is also a requirement for refunding.
            */
            function circuitBreaker() public onlyOwner {
              openingTime = now;
              closingTime = now;
              isFinalized = true;
              weiRaised = 0;
              escrow.enableRefunds();
            }



//////////////////////////////////   For Testing  ///////////////////////////////////

            /**
            * @dev this function is used for TESTING PURPOSES ONLY. It must be removed for real deployment.
            *
            * It gives you the ability to modify the time (startTime & closingTime) in order to speed up the testing process
            *
            * It is also needed for truffle testing. since the timelines in truffle test is different.
            * (unless you know a way to keep truffle wait for a set number of seconds)
            */
            function setTime(uint startTime_, uint closingTime_) public {
              openingTime = now + startTime_;
              closingTime = now + closingTime_;
            }

}
