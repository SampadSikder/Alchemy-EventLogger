require("dotenv").config();
const { ethers } = require("ethers");
const web3 = require("web3");
const { Alchemy, Utils } = require("alchemy-sdk");
const settings = {
    apiKey: process.env.TESTNET_ALCHEMY_API,
    network: "eth-sepolia"
};
const alchemy = new Alchemy(settings);

async function main() {
    //console.log(wallet);

    // new ethers.Contract(address, abi, signerOrProvider);
    //with wallet signer should be given
    // const simpleContract = new ethers.Contract('0x5f955bcE356b970Ab021b7EE8709f62C4fE23143',
    //     contractABI,
    //     wallet
    // );

    // //const tx = await simpleContract.store(256);

    // //console.log(tx);

    // const storeValue = await simpleContract.retrieve();
    // console.log(storeValue.toString());
    // const filter = {
    //     address: '0x5f955bcE356b970Ab021b7EE8709f62C4fE23143',
    //     fromBlock: 0,
    //     toBlock: 'latest',
    //     topics: [eventName]
    // }
    // const events = await simpleContract.queryFilter(filter);

    // // simpleContract.on("storedNumber", (from, to, value, event) => {
    // //     let transferEvent = {
    // //         from: from,
    // //         to: to,
    // //         value: value,
    // //         eventData: event,
    // //     }
    // //     console.log(JSON.stringify(transferEvent, null, 4))
    // // })

    // events.forEach((event) => {
    //     console.log(`Event ${eventName} at block ${event.blockNumber}:`, event.args.number.toString());
    // });
    let logs = await alchemy.core.getLogs({
        fromBlock: "0x0",
        toBlock: "latest",
        address: process.env.CONTRACT_ADDRESS,
    });



    logs.forEach((log) => {

        console.log(parseInt(log.data.toString()));
    })
}


main();