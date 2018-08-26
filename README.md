# Event Crowd

Event Crowd is an initiative to create an open-source DApp to facilitate funding of events prepared by communities or event organizers. The best way to put it: It's a Kickstarter for events. An event organizer or a group of friends can post a proposal for an event in a blog, detailing about everything from the theme, place and time, organization process, entrance fees (if there is) and most importantly, the break down of preparation costs with a payment plan. The uses can be as simple as a small group of friends preparing a BBQ dinner, or a profissional event made by an event organizer for thousands of people. Whoever funds an event, will be able to attend it. In another words, the funding process will be like buying an early ticket for the event.

To understand the requirements, we need to identify the main actors/players of the event funding:
- **Event Organizer:** Whoever proposes the event and provides all the related details to it, including the payment plan. An Event Organizer can be one person, group of people, or a profissional organization.
- **Community:** They are the targeted people to attend the event. They need to have clarity and transarency about all the details of the event before funding, specially on how the funds will be spent and by when. The community needs to feel comfortable that the money will be spent wisely. The 'community' can range from few people to thousands. They can be a group of friends, or neighborhood, or just people with a common interest gathering from around the world.

To Achieve the above requirements in a DApp and a smart contract, we need to introduce couple of elements here:
- **Crowdfunding contract:** This contract will have the following main features:
    - Accepting ether from the users and provide ticket (token) for them
    - Transfer the Fund to the Owner if the contract reached it's goal
    - Provide the ability to refund if the contract didn't reach it's goal
    - Control the contract's start and closing time
- **Token contract:** This contract is used to provide ERC20 token standard. it includes the following main features:
    - Minting tokens (when people buy by ether)
    - Burning tokens (when people get refunded)
    - Token transfers and transfer deligation
- **Interactive website:** This is a website to show the details of and interact with the contracts. it includes the following main features:
    - Contract addresses and their owners
    - The status of the contract: Started/finished/finalized, Funding balance, goal status, etc.
    - The number of Tickets (tokens) purchaised by a user
    - Buying and Withrawal options for users
    - Collecting the funds for the Event Organizer

## Event Crowd Contracts

I'll be explaining here the contracts that I've built and the contracts that I'm using from the audited & trusted source ([OpenZepplin](https://openzeppelin.org/)).

- **EventCrowd_01.sol:** I've built this contract to mainly does the following:
    - Preset some of the crowdfunding contract attributes such as: The opening & closing time, rate, and funding goal.
    - Using solidity functions to extract the details and status of the contract: How much time left to start the contract? (return in seconds), have the contract started? (return in boolian), get the address of the escrow account.
    - an emergency stop
    - a special function to change the time of contract (included only for testing purposes. It should be romoved for real deployment).
    - Inheriting 2 parent Crowdsale contracts (Burnable & Minted crowdsales), in which they inherit another 4 child crowdsale contracts. that's a total of 6 crowdsale contracts. all of them are from OpenZepplin exept Burnable crowdsale. More information about what each does is below (under OpenZepplin contracts).
- **TicketToken_01.sol:** A standard Token contract from OpenZepplin that contains:
    - 2 parent Token contracts (Brunable & Mintable tokens), they inherit 2 other child contracts (Standard & Basic tokens). more info about what each does is below (under OpenZepplin contracts).
    - I've also added one function to authorize EventCrowd_01 contract to burn a specific amount of tokens. Becasue users can't interact with Token contracts directly. They need to do it through EventCrowd_01 contract for security reasons.
- **BurnableCrowdsale.sol:** This contract for some reason is not available in OpenZeppelin library, so I've made one. I will be happy to replace it when they have one. This contract just adds one funtion to burn tokens when users return it back to the contract (request for refunding).

## OpenZeppelin Library
I'll be explaining here the [OpenZeppelin](https://openzeppelin.org/) contracts library that I'm using and what each is used for. The EventCrowd_01.sol contract contins a collection of OpenZeppelin contracts.

And they are:
1. *Crowdsale*:             this is the basic (bare minimum) for a crowdsale functionality. the add-ons are below..
2. *Minted Crowdsale*:      this add-on feature let the contract mint Tokens only when an ether payment is made by an a user.
3. *Timed Crowdsale*:       this add-on feature provide the ability to have a start and end date for a crowdsale.
4. *Finalizable Crowdsale*: this add-on let the contract to collect the funds and only send it to the Owner when the deadline is achieved and "Finalize" function is triggered by the Onwer.
5. *Refundable Crowdsale*:  this add-on provides refunding option when the funding goal is not reached post the deadline.
6. *Burnable Crowdsale*:    this add-on burns a user tokens when he/she requests for refunding.

The TicketToken_01.sol contract contins a collection of OpenZeppelin Token contracts.

And they are:
1. *Basic Token*:    this contract contains the very basic token functionality. Such as, transfer fucntion. the add-ons are below..
2. *Standard Token*: this mainly provides the ability for an authorized address (third partly) to handle certain amount of tokens to be transferred (transferFrom). The Standard Token is the minimum to have an ERC20 token.
3. *Mintable Token*: this is an add-on to provide the ability of minting tokens by the Owner. In our case, the owner is the EventCrowd contract itself and it will only mint if a user have sent an ether to it.
4. *Burnable Token*: this is an add-on to provide the ability of burning tokens. In our case, this will only be applicable when a user requests for refunding.

## Background (Consensys Academy)

I've taken this change to move my idea from a concept to development through a project submission for **Consensys Academy Developer Program 2018**. In the below sections you will find areas that can guide you through the project requirements. such as, testing, security, stretch goals, etc.

## Testing

The only contract that can be executed and tested independently is "TicketToken_01.sol", the rest of "EventCrowd_01.sol" and "Burnablecrowdsale.sol" along with "TicketToken_01.sol" need to be tested together. the reason is:
- EventCrowd contract does not operate by itself, since it's main purpose is to control the Token contract anyway.
- BurnableCrowdsale is an embeded (childs of) 'EventCrowd' and it has only one function to be tested which is 'claimRefund'. we are going to test this function as part of 'EventCrowd' which is it's parent.


## Libraries

I'm using OpenZepplin libraries, under node_modules files. but these are not upgradable yet. In the future I'll move to [ZeppelinOS](https://zeppelinos.org/) which makes their library upgradable.

## Stretch goals

I've included two extra components beyond the basic requirements. They are:

  ### Testnet (Rinkeby)

  Truffle.js configuration have been modified to cater for Test network in Rinkeby by connecting with Geth. extra details on environement setup will be provided under 'Environment Setup' below.

  ### Deployment with Infura

  I've also configured Truffle.js to connect with [Infura](https://infura.io/). This is by far more convenient that running and connecting through Geth. again, extra details on environement setup will be provided under 'Environment Setup' below.

## Environment Setup

This area to guide you through installation & configuration (if nessessary).

### Requirements

You should have the same versions of the following software to prevent any possible error during compiling, deploying, node interation/transactions, etc.

- **Truffle**: version 4.1.14 (I had issues when I've upgraded to Truffle 5 beta - it was mainly due to web3 v1)
- **Solidity**: version 0.4.24
- **NPM**: version 6.2.0
- **Geth**: version 1.8.12
- **Ganache**: version 1.2.1
- **Metamask**: version 4.9.3 [link](https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn) the latest version is way more convenient as it provides pop-up notifications when a transaction success or fail. instead of checking etherscan every time.
- **git**: version 2.17.0

other:
- MacOS: 10.13.6
(I'll post another version for Ubuntu)

### Configuration

To make your life easier. I'll try my best to go through steps for installing, configuring, and testing.

**Ganache deployment**

1. download the Metamask plug-in for chrome
2. Configure metamask to add a localhost network (the one mentioned in Ganache - usually it is HTTP://127.0.0.1:8545) (I think the new Metamask version have the localhost pre-configured)
3. Add the first Ganache account to Metamask. this can be done by taking the private keys of the first account in Ganache or using seed words of Ganache.
4. to make sure it is the same account, check their ether balances if they are equal.
5. Please rename this account in Metamask to "Ganache 1" or something similar to prevent confusion. It is very easy to use different account and get errors!

That's it, you are done here. If you are still unclear, please refer to google!

>NOTE: In case you got the following error while doing transactions:
> "Error: the tx doesn't have the correct nonce."  
> go to Metamask 'Setting' > then click 'Reset account'.


**Geth deployment**

We need to do some extra steps with Geth to make sure we are using our own account to deploy contracts and to sign transactions through Metamask. This is needed since we are using the contract with  `OwnlyOwner` functions. below I'll be explaining in very high level steps as FYI. please refer to the internet for extra details.

- Install Geth and Mist into your machine (please refer to the net for details)
- try to run Geth and make sure it is working fine by doing some transactions or deploying contracts to test net.
- Open Mist and create an account (if you don't have any). and keep in mind the password for it.
- Copy the Key Chain stored in Mist and past it in the right place of Geth folder
- test if you can access your mist account in Geth. go to terminal and type `geth --rinkeby --rpc --rpcapi db,eth,net,web3,personal --unlock="0x88daca...Your Mist Account...d25de3ce"` (and change the account with your mist account)
- Then it will ask for a password. type it then press Enter.
- If it worked well, it should show `Imported new chain segment` every couple of seconds (ethereum block confirmations).
- now go to Metamask and import the same Key Chain file. you need to do this to be able to sign the contracts with Owner address.
- make sure to rename the Metamask account to prevent you from confusion. i.e. "Geth Account".


**Infura deployment**

It is waaaaay easier to deploy contracts in testnet with Infura than with Geth. Infura doen't fail when deploying multiple contracts, unlike Geth for unknown reasons to me. With Infura you don't need to download any node or large files, which is another advantage (beside truffle HDwallet).

There are just minor steps to test with infura. which is installing HDwallet for truffle:
- open the terminal and go to the project folder
- then type `npm install truffle-hdwallet-provider`
- that's it!

to learn more about Infura connection with Truffle, you can go to this [link](https://truffleframework.com/tutorials/using-infura-custom-provider).

 However, it would be better to replace the mnemonic seed words since the one i'm providing might be used my other Consensys Academey program members for testing. which might confuse you by seeing the balance keeps changing or the balance might just be zero. below are steps to change the mnemonic:

- Go to Metamask > Settings > click on 'Reveal Seed Words'
- type your password to get your seed Words.
- copy the seed words
- go to the project folder and open truffle.js
- Replace the seed words that you have copied into the mnemonic in the second line.
- you are done!


## Walkthrow

- Go to my GitHub page to download the files. (you can download it through .Zip or installing GitHub Desktop)
- Open your terminal and go to the folder where you have downloaded the files/repository
- In terminal type `truffle test`. 26 tests should be executed and passed successfully. (If not, then it has to be related to an environment/setup differences between my PC and yours. try to review and replicate the software versions, and if still persist try to trouble shoot it if possible)
- now open your Ganache
- In terminal type `truffle compile --all`. This will compile all the files and should all execute with 9 warning signs, but that's fine.
- In terminal type `truffle migrate --network ganache --reset`. this command will migrate and deploy all the contracts into the localhost with ganache. again this should operate fine, if not then try to check the reason and troubleshoot.
- In terminal type `npm run dev`. this should open a browser and display the page to interact with the contract.

> NOTE: Please make sure that:
> 1. Metamask is set to localhost
> 2. Metamask is using Ganache's first account (let's say Ganache 1, where deployements are made)

- Now you should see the contract details under 'Contracts Dashboard'. Including the time to start contract, contract addresses, contract owners, etc.
- Before you start doing anything, first you need to change the ownership of the TicketToken contract. Currently it is owned by you, but it needs to be owned by the EventCrowd contract in order to process the ticket payments and token transfers.

> NOTE: The contract will not work if you didn't change the ownership.

- go to 'Contracts Dashboard' and click on `change ownership` button. If the transfer was successful then you should see that TicketToken owner is the same as EventCrowd address.

>NOTE: In case you got the following error while doing transactions:
> "Error: the tx doesn't have the correct nonce."  
> try to go to Metamask 'Setting' > then click 'Reset account'.

- Now you can go to buy some tickets! try to change the account in Metamask to another Ganache's account (let's say Ganache 2).

**From here onward we will go for scenario 1, which is "Not reaching the funding goal":**

- then go to `User Panel` and try to buy 99 tickets (100 tickets to reach our goal).

> NOTE: Before you buy any ticket!
> make sure that the contract is still open and didn't reach the closing time yet. If not, then you need to do one of the follwoing:
> - redeploy again and do all the previous steps faster before the contract closes.
> - Or, go to "EventCrowd_01.sol" and modify the seconds for closingTime at your preferred time before you redeploy again.
> - Or, the easiest way, utilize the `*Testing*` Panel to force re-setting the time (i.e. start at 0, close at 500). this function will help u a lot in testing.

- If the transaction was successful, you should see the `Ticket balance` under the User Panel is shown as 99 tickets (try to refresh page if it was still shown 0).
- You should also see 99 tickets in `Total Bought Tickets` under Contracts Status Panel. This represent number of tickets bought by all users. not just the current Metamask account.
- You should also see 0.99 ether in `Funding goal`

- Now wait until the contract closing time reached. (or utilize the Testing Panel to set the closing time to 0)
- Change Metamask account back to Ganache 1 (the Owner), then click `Finalize` button under Event Organizer Panel. this will activate the withdraw option since the goal didn't reach.
- Change Metamask to Ganache 2 and click `withdraw` button under User Panel. you should notice that the ether have returned back to the account (minus the gas costs) and all Ticket balance is back to 0. (again, don't forget to refresh page)
- we are done with scenario one.

Now you can go back to the first steps and try to do multiple scenarios as you wish, including reaching the goal.

Just be extra careful to use the Owner account when it's needed, and to consider the contract timelines. Otherwise, you will get error messages for contract security.

**Deploying to Rinkeby testnet using Geth**

- make sure Ganache is Closed
- open your terminal and go to the project folder.
- Copy the following line `geth --rinkeby --rpc --rpcapi db,eth,net,web3,personal --unlock="0x88daca...Your Mist Account...d25de3ce"` and past it in terminal. replace the address with your Mist or Geth address. then press enter.

> NOTE: please refer to my reference above on how to use Mist account with Geth and MetaMask.

- it should ask you for a password. type it then press Enter.
- when it connects it should show `Imported new chain segment` every couple of seconds.
- now keep this terminal open and start another terminal along it (i'll call it terminal-2 to prevent confution).
- in terminal-2 type `truffle compile --all`
- in terminal-2 type `truffle migrate --network geth --reset`

> NOTE: in my case this fails a lot of times (10x or more) until it succeed. I don't really know why. You just need to repeat the migration again and again until you get lucky. before any new migration, you need to terminate Geth and operate it again, since I believe there is an expiry time for the validity of the password of Geth. That's why I love Infura.

- in terminal-2 type `npm run dev`
- A browser should open to show the contract.

> NOTE: make sure that you are connected to localhost and Metamask account is set to the one from Geth/Mist Account.

 Now do the same scenario steps that you have done earlier with Ganache.


 **Deploying to Rinkeby testnet using Infura**

This is much easier than Geth deployment. before you continue, please refer to "Infura Deployment" mentioned above.

- Open the terminal and go to the project's folder
- in terminal type `truffle compile --all`
- then again in terminal type `truffle migrate --network infura --reset`
- now all contracts should be migrated to test network without any issues.

>NOTE: remember to use your own mnemonic seed words instead of mine, in order to prevent interruption with the balance by other users.

Happy execution. I wish you all the best!

## License
Code released under the [MIT License](https://github.com/OpenZeppelin/openzeppelin-solidity/blob/master/LICENSE).
