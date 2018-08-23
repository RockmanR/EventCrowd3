pragma solidity ^0.4.24;

import './TicketToken_01.sol';
import 'openzeppelin-solidity/contracts/crowdsale/distribution/RefundableCrowdsale.sol';


/**
 * @title Burnable Crowdsale Contract
 *
 * @dev Implementation of a Burnable Crowdsale
 * this contract is meant to be implemented on top of a Refundable Crowdsale
 * in order to burn Tokens when the user send the tokens back to the contract
 *
 * The Tokens will be burned when the user execute "claimRenund" funtion (located in Refundable Crowdsale contract).
 *
 * This contract for some reason is not available in OpenZeppelin library.
 * so I've made one and will be happy to replace it when they have one.
 */
contract BurnableCrowdsale is RefundableCrowdsale {

  /**
   * @dev This contract needs to get the address of the token in order to access/utilize
   * it's functions
   */
    TicketToken_01 token;

    constructor
        (
            TicketToken_01 _token
        )
        public
        {
         token = _token;
        }

    /**
     * @dev This function will execute the claimRefund in
     * it's functions
     */
    function claimRefund() public {
        super.claimRefund();
        token.burnByCrowdsale(token.balanceOf(msg.sender), msg.sender);
    }
}
