## Security considerations

In this section I'll be explaining what steps I've taken to secure the contract from common attacks and contract bugs.

  1. Utilizing community audited and accepted smart contracts. In our case, I'm using smart contracts from OpenZepplin for whatever relates to Crowdfunding and Token features. For example, receving and transfering of ether, creating/burning/transfering of Tokens. This is a very sensitive area and prone to attacks, so better to be done with community audited contracts.
  2. **Restricting access** by implementing 'onlyOwner' in many areas. one example is for burning tokens (which EventCrowd contract is the owner). And the EventCrowd will only burn tokens if the user executed a refund option successfully. the function can be found in TicketToken_01.
  3. Using SafeMath to prevent **Integer overflow/underflow** for trasfering/minting/burning tokens and ether transfer.
  4. Using require: require function is used in many areas instead of an 'if' statement to **fail loudly**. one example can be found in claimRefund. were the contract needs to make sure that it is finalized and the goal didn't reach.
  5. Using **Lifetime** (opening and closing time): the opening time helps in protecting the users by delaying the start time until the contract is being reviewed by the community first. the closing time helps to prevent the contract from being opened for too long or forever for any reason.
  6. Using **pull over push payments**: if the contract is finalized and the goal did not reach. the users will have the ability to pull the payment (withraw option), instead of sending all the payments back to users by the contract itself (push payment). The pull payment is better to prevent draining the gas during execution, and prevent attacks such as **Denial-of-servier** or **re-entrancy**.

  ### current known security limitations

  There are some security limitations that I would like to highlight:

  - Finalize: the problem with Finalize function is that it keeps us dependent on the Owner to trigger it to get the money out of the contract. this will be a risk in case the Owner is not available (or dead!). this can be prevented by introducing an extra layer of deadline (**Auto deprication**)
  - No phased releases: Currently the Owner (Event Organizer) can get all the funding if it reached the goal and closingTime. However, it would be better to release the funds in multiple phases depending on how the Event Organizer is performing. This can be done by having the community to vote for each release of payment. This feature will be implemented in the future.
  - No caps implemented: There is no limit/cap for the funding. this is might be a risk if the amount is way too high. Reason: 1) the event organizer might not be able to deal this such uneeded amount. 2) it increases the risk of getting attackers.
  - I've done two modifications to OpenZepplin contracts. I'm not sure what kind of security holes (hell gates) I'm opening so I'll state the changes and locations here:
  	- Under 'Timedcrowdsale.sol', in 'hasClosed()' function: i've changed the '>' to '>='. Reason: to be compatible with Truffle test, since Truffle test moves very fast before the contract passes the closingTime.
  	- Under 'Refundablecrowdsale.sol', in declaring RefundEscrow object: I've changed the object from being private to public. Reason: I need to access the object through EventCrowd_01 in order to execute the 'enableRefund()' function as part of Emergency Stop/circuit breaker fuction for safety.
