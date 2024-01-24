# Alchemy-EventLogger

An ExpressJS server designed to decode event data of contracts

## Problem Statement
When an event is emitted in blockchain, the indexed parameters are emitted as topics and other parameters are emitted in the data field. Each topic is encoded in keccak256 format. 
The values in the data field are concatened together and encoded as a single bytecode.

The data:
```
number: 1000
quote: emitting value
```

is encoded in hex format as:

```
0x00000000000000000000000000000000000000000000000000000000000003e80000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000000e656d697474696e672076616c7565000000000000000000000000000000000000
```
We need to turn this hexadecimal representation into valid readable format.

## Solution
Using alchemy-sdk we can read the logs of a blockchain. 
The logs then can be decoded using ethersJS's interface.

```
  const iface = new ethers.Interface(contractABI);
        const decodedData = iface.decodeEventLog("storedNumber", log.data);
        const serializedData = convertBigIntsToStrings(decodedData);
        retArr[log.blockHash] = serializedData;
```
Doing this for every logs outputs the decoded events.

The server can be used to listen to any contracts and decoding the event data. 


