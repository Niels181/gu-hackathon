// Import the IOTA library.
// Install with this command: 'npm install iota.lib.js'

function sendIota() {
    //var IOTA = require('iota.lib.js');

    //var CryptoJS = require("crypto-js");
    //var AES = require("crypto-js/aes");
    //var SHA256 = require("crypto-js/sha256");



    var thisMessage = "Wat een test";

    var rawStr = thisMessage;
    var wordArray = CryptoJS.enc.Utf8.parse(rawStr);
    var firstEncryption = CryptoJS.enc.Base64.stringify(wordArray);

    var encryptedMessage = CryptoJS.enc.AES.stringify(firstEncryption);

    console.log("\nMessage to be encrypted: \n" + thisMessage + "\n");
    console.log("BASE64 encrypted message: \n" + firstEncryption + "\n");
    console.log("SHA256 encrypted message: \n" + encryptedMessage + "\n");

    // List of possible nodes
    var nodes = ['http://node02.iotatoken.nl:14265', 'http://node04.iotatoken.nl:14265', 'http://node06.iotatoken.nl:14265'];

    // Random index for node selection
    var random = Math.floor(Math.random() * nodes.length);

    // Create IOTA instance directly with Node (provider)
    // This is node is your entry point to the Tangle
    var iota = new IOTA({
        'provider': nodes[random]
    });

    // A seed is used as your 'private key' so never share it!
    const seed = 'ESLYLMVCHTPWO9XUTLWFHGEXJGZJOHWC9VDWRRLNU9CML9XWBBGNDNWDFEGZVWXVOPEJISSXYQEBYZVGQ'; // KEEP IT SECURE!!

    // Create a message to attach to your transaction
    // and convert it to Trytes (data format used by IOTA)
    var messageTrytes = iota.utils.toTrytes("" + encryptedMessage);

    console.log("Message in trytes: \n" + messageTrytes + "\n");

    // The receiving address (Harm's wallet!)
    let address = 'USRAEQUHLKULRLKQWXJVQMZNLJ9EIAUFSRSNYLND9WCXVQEBJKYDEDLXSVCYJQZQONNRQLROBGEOOHZTXQKJCIXSRX';

    // Construct the transfer bundle with address, 
    // value (amount of IOTA), a tag and a message
    var transfer = [{
        'address': address,
        'value': 0,
        'tag': 'IOTAHACKATHONGRONINGEN',
        'message': messageTrytes,
    }];

    // Send transfer to the Tangle. Depending on the Node config of the connected Node
    // you also do the PoW at this point. The magic numbers can stay there for the Mainnet
    iota.api.sendTransfer(seed, 9, 14, transfer, function (e, bundle) {
        if (e) throw e;
        console.log("Successfully sent your transfer: ", bundle);
    });
}



