require("dotenv").config();
const ethers = require("ethers");
const contractABI = [{ "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "contractAddress", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "number", "type": "uint256" }, { "indexed": false, "internalType": "string", "name": "quote", "type": "string" }], "name": "storedNumber", "type": "event" }, { "inputs": [{ "internalType": "string", "name": "_name", "type": "string" }, { "internalType": "uint256", "name": "_favoriteNumber", "type": "uint256" }], "name": "addPerson", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "string", "name": "", "type": "string" }], "name": "nameToFavoriteNumber", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "name": "people", "outputs": [{ "internalType": "uint256", "name": "favoriteNumber", "type": "uint256" }, { "internalType": "string", "name": "name", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "retrieve", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_favoriteNumber", "type": "uint256" }], "name": "store", "outputs": [], "stateMutability": "nonpayable", "type": "function" }];

const provider = new ethers.JsonRpcProvider(process.env.TESTNET_ALCHEMY_ENDPOINT);
const wallet = new ethers.Wallet(process.env.SEPOLIA_PRIVATE_KEY, provider);
const { Alchemy, Utils } = require("alchemy-sdk");
const settings = {
    apiKey: process.env.TESTNET_ALCHEMY_API,
    network: "eth-sepolia"
};
const alchemy = new Alchemy(settings);

async function listen() {
    //console.log(wallet);

    // new ethers.Contract(address, abi, signerOrProvider);
    //with wallet signer should be given
    const simpleContract = new ethers.Contract(process.env.CONTRACT_ADDRESS,
        contractABI,
        wallet
    );

    // const tx = await simpleContract.store(256);

    // console.log(tx);

    // const storeValue = await simpleContract.retrieve();
    // console.log(storeValue.toString());
    // const filter = {
    //     address: '0x5f955bcE356b970Ab021b7EE8709f62C4fE23143',
    //     fromBlock: 0,
    //     toBlock: 'latest',
    //     topics: [eventName]
    // }
    //const events = await simpleContract.queryFilter(filter);
    simpleContract.on("storedNumber", (number, address, event) => {
        let listenedEvent = {
            number: number,
            address: address,
            eventData: event,
        }
        console.log(JSON.stringify(listenedEvent, null, 4))
    })

    // events.forEach((event) => {
    //     console.log(`Event ${eventName} at block ${event.blockNumber}:`, event.args.number.toString());
    // });

}

function convertBigIntsToStrings(obj) {
    const result = {};

    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            const value = obj[key];
            if (typeof value === 'bigint') {
                result[key] = value.toString();
            } else if (typeof value === 'object' && value !== null) {
                // Recursively convert nested objects
                result[key] = convertBigIntsToStrings(value);
            } else {
                // Keep other types unchanged
                result[key] = value;
            }
        }
    }

    return result;
}

async function readData(req, res) {
    let logs = await alchemy.core.getLogs({
        fromBlock: "0x0",
        toBlock: "latest",
        address: process.env.CONTRACT_ADDRESS,
    });

    console.log(logs);
    const retArr = {};
    logs.forEach((log) => {
        const iface = new ethers.Interface(contractABI);
        const decodedData = iface.decodeEventLog("storedNumber", log.data);
        const serializedData = convertBigIntsToStrings(decodedData);
        retArr[log.blockHash] = serializedData;
    })


    res.json(retArr);
}

module.exports = {
    listen,
    readData
}
