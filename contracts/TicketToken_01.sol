pragma solidity ^0.4.24;

import 'openzeppelin-solidity/contracts/token/ERC20/MintableToken.sol';
import 'openzeppelin-solidity/contracts/token/ERC20/BurnableToken.sol';


/**
* @dev This token contract "TicketToken_01" contins a collection of OpenZeppelin Token contracts. And they are:
* - Basic Token:    this contract contains the very basic token functionality. the add-ons are below..
* - Standard Token: this mainly provides the ability for an authorized address (third partly) to handle certain amount of tokens to be transferred. this is the minimum to have an ERC20 token.
* - Mintable Token: this is an add-on to provide the ability of minting tokens by the Owner. In our case, the owner is the EventCrowd contract itself and it will only mint if a user have sent an ether to it.
* - Burnable Token: this is an add-on to provide the ability of burning tokens. In our case, this will only be applicable whne a user have request for refunding.
*/

contract TicketToken_01 is MintableToken, BurnableToken {
    string public name = "Event Crowd Token";
    string public symbol = "ECT";
    uint8 public decimals = 18;
    address public owner_ = msg.sender;

    /**
   * @dev "burnByCrowdsale" is a function that authorizes EventCrowd contract to burn a specific amount of tokens.
   * @param _value The amount of token to be burned.
   * @param _burner The address of the tokens to be burned. In this case, its the person who is requesting for refunding.
   */
  function burnByCrowdsale(uint256 _value, address _burner) onlyOwner {
    _burn(_burner, _value);
  }

}
