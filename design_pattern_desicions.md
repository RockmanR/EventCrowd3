# Design Pattern

Below are some of the design patter that I have used as part of best practices and enhance the security. There are other design patterns mentioned under "avoiding_common_attacks.md" as well.

- **State Machines** are heavily used here, were no funding can be made before the openingTime and after the closingTime. the contract can't be finalized before the closingTime too. the withraw function can't be done before the contract is being finalized and reaching its goal, etc.
- introducing Emergency Stop: it's a **circuit breaker** to terminate the contract and activate the refunding feature. It can only be executed by the owner of the EventCrowd. And it won't work if the owner have already took the money out of the contract, because it will be meaningless at that time. The Emergency Stop does three main things:
          1. It force the contract to expire, so nobody can send funds to it anymore.
          2. It force the contract to finalize. This is a requirement for refunding.
          3. It force the excrow account status to be 'Refunding'. This is also a requirement for refunding.
- other circuite breaker models that weren't used:
  - **Self-destruct** contract: this is a way to distroy the whole contract and won't be usable. this method can be dangerous because it will prevent people from getting their money back if they have already send ether to the contract.
  - **Freezing contract**: this method can be used to halt transactions/prevent any changes to state variables by the Owner until the issue is resolved (by waiting until deadline is reached or by upgrading the contract).
