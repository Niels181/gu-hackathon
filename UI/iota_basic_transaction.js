// Import the IOTA library.
// Install with this command: 'npm install iota.lib.js'
let IOTA = require('iota.lib.js');
let CryptoJS = require("crypto-js");
let MAM = require('../libraries/mam.client.js/lib/mam.node.js');

async function fetchStartCount(){
    let trytes = iota.utils.toTrytes('START');
    let message = MAM.create(mamState, trytes);
    console.log('The first root:');
    console.log(message.root);
    console.log();
    // Fetch all the messages upward from the first root.
    return await MAM.fetch(message.root, 'public', null, null);
}

async function publish(packet){
    // Create the message.
    let trytes = iota.utils.toTrytes(JSON.stringify(packet))
    let message = MAM.create(mamState, trytes);
    // Set the mam state so we can keep adding messages.
    mamState = message.state;
    console.log('Sending message: ', packet);
    console.log('Root: ', message.root);
    console.log('Address: ', message.address);
    console.log();
    // Attach the message.
    return await MAM.attach(message.payload, message.address);
}


// List of possible nodes
var nodes = ['http://node02.iotatoken.nl:14265', 'http://node04.iotatoken.nl:14265', 'http://node06.iotatoken.nl:14265'];

// Random index for node selection
var random = Math.floor(Math.random() * nodes.length);

// Create IOTA instance directly with Node (provider)
// This is node is your entry point to the Tangle
let iota = new IOTA({
    'provider': nodes[1]
});


// A seed is used as your 'private key' so never share it!
const seed = 'XLPQORJUMCYE9PAYXTNNMATSVAAUTFMNJPSBYWU9MAQWAYICBTVADUESPOOTY9OBSNLZWXUOFVRMYYBGN'; // KEEP IT SECURE!!

let mamState = null;
// Initiate the mam state with the given seed at index 0.
mamState = MAM.init(iota, seed, 2, 0);

let messageText = "MAM message posted at " + new Date();

publish(messageText);

fetchStartCount().then(v => {
    // Log the messages.
    let startCount = v.messages.length;
    console.log('Messages already in the stream:');
    for (let i = 0; i < v.messages.length; i++){
        let msg = v.messages[i];
        console.log("----------------------");
        console.log("   Message: " + JSON.parse(iota.utils.fromTrytes(msg)));
        console.log("   Root: " + msg.root)
        console.log("   Address: " + msg.address)
        console.log("----------------------");
    }
    console.log();

    // To add messages at the end we need to set the startCount for the mam state to the current amount of messages.
    mamState = MAM.init(iota, seed, 2, startCount);
    
	let newMessage = messageText;

    // Now the mam state is set, we can add the message.
    publish(newMessage);
    }).catch(ex => {
        console.log(ex);
        });




/*
// Create a message to attach to your transaction
// and convert it to Trytes (data format used by IOTA)
let message = 'My second transaction with IOTA';
let messageEncrypted = CryptoJS.AES.encrypt(message, "geheim");
console.log(messageEncrypted.toString());
let messageTrytes = iota.utils.toTrytes(messageEncrypted);

var bytes  = CryptoJS.AES.decrypt(messageEncrypted.toString(), "geheim");
var plaintext = bytes.toString(CryptoJS.enc.Utf8);
console.log(plaintext);

// The receiving address (Harm's wallet!)
let address = 'IOTAHACKATHONIOTAHACKATHONIOTAHACKATHONIOTAHACKATHONIOTAHACKATHONIOTAHACKATHONIOTXBGOLUNQD';

// Construct the transfer bundle with address, 
// value (amount of IOTA), a tag and a message
var transfer = [{
    'address': address,
    'value': 1,
	'tag': 'IOTAHACKATHONGRONINGEN',
	'message': messageTrytes,
}];

// Send transfer to the Tangle. Depending on the Node config of the connected Node
// you also do the PoW at this point. The magic numbers can stay there for the Mainnet
iota.api.sendTransfer(seed, 9, 14, transfer, function(e, bundle) {
    if (e) throw e;
    console.log("Successfully sent your transfer: ", bundle);
});



*/