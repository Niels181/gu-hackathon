var http = require('http'); 
let IOTA = require('iota.lib.js');
let CryptoJS = require('crypto-js');

const seed = 'OS9IHQOOJDOQMCLSYXIMHEEMPTQRAAJQZUSFWCSPZFCJZ9ZMGN9DUMYUBSOARAQHYLALD9WKODIICXVEC'; // KEEP IT SECURE!!
// The receiving address (Niels's wallet!)
let address = 'USRAEQUHLKULRLKQWXJVQMZNLJ9EIAUFSRSNYLND9WCXVQEBJKYDEDLXSVCYJQZQONNRQLROBGEOOHZTXQKJCIXSRX';

p1_data = class {
    constructor(id, array) {
      this.id = id;
      this.timestamp = new Date( array[0]);
      this.electricityConsumption =  array[1];
      this.electricityProduction =  array[2];
      this.gas =  array[3];
    }
  }

  dateToString = function(d) {
    var date_format_str = d.getFullYear().toString()+"-"+((d.getMonth()+1).toString().length==2?(d.getMonth()+1).toString():"0"+(d.getMonth()+1).toString())+"-"+(d.getDate().toString().length==2?d.getDate().toString():"0"+d.getDate().toString())+"T"+(d.getHours().toString().length==2?d.getHours().toString():"0"+d.getHours().toString())+":"+(d.getMinutes().toString().length==2?d.getMinutes().toString():"0"+d.getMinutes().toString())+":"+(d.getSeconds().toString().length==2?d.getSeconds().toString():"0"+d.getSeconds().toString());
    return date_format_str;
  }
  
  p1ToString = function(p1) {
    id = base64Encode(p1.id);
    let delim = "|";
    p1_str = "id=" + id + delim + dateToString(p1.timestamp) + delim + "ec=" + p1.electricityConsumption + delim + "ep=" + p1.electricityProduction + delim + "g=" + p1.gas;
    return p1_str;
  }

function base64Encode(input) {
    var wordArray = CryptoJS.enc.Utf8.parse(input);
    return CryptoJS.enc.Base64.stringify(wordArray);
}

function aesEncode(input, secret) {
    return CryptoJS.AES.encrypt(input, secret).toString();
}

function createP1Data() {
    let min = 0, max = 10;
    ec += (Math.floor(Math.random() * (max - min) ) + min);
    ep += (Math.floor(Math.random() * (max - min) ) + min);
    g += (Math.floor(Math.random() * (max - min) ) + min);
    return new p1_data(123498275987732, [Date(), ec, ep, g]);
}

let equipmentId = 123498275987732;
let ec = 0, ep = 0, g = 0;
let a,b;

function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
      if ((new Date().getTime() - start) > milliseconds){
        break;
      }
    }
  }
 
function sendIotaMessage(message, encryptMessage){
    // List of possible nodes
    let mainNodes = ['http://node02.iotatoken.nl:14265', 'http://node04.iotatoken.nl:14265', 'http://node06.iotatoken.nl:14265'];
    let testNodes = ['https://nodes.testnet.iota.org:443/'];

    // Random index for node selection
    var random = Math.floor(Math.random() * mainNodes.length);

    // Create IOTA instance directly with Node (provider)
    // This is node is your entry point to the Tangle
    var iota = new IOTA({
        'provider': mainNodes[random]
    });

    // A seed is used as your 'private key' so never share it!
    
    // Create a message to attach to your transaction
    // and convert it to Trytes (data format used by IOTA)
    let msgTag = 'TAG';
    let secret = 'bz56mgprl5zpvst41xuaoptppzpaciay';
    console.log("Message: " + message);

    // Encrypt baseb64
    if (encryptMessage) {
        message = base64Encode(message);
        message = aesEncode(message, secret);
    }

    // Convert message to trytes
    let msgTrytes = iota.utils.toTrytes(message);

    // Construct the transfer bundle with address, 
    // value (amount of IOTA), a tag and a message
    var transfer = [{
        'address': address,
        'value': 0,
        'tag': msgTag,
        'message': msgTrytes,
    }];

    let depth = 9;
    let minWeigthMagnitude = 14; // 9 for testnet, 14 for mainnet

    // Send transfer to the Tangle. Depending on the Node config of the connected Node
    // you also do the PoW at this point. The magic numbers can stay there for the Mainnet
    iota.api.sendTransfer(seed, depth, minWeigthMagnitude, transfer, function(e, bundle) {
        if (e) throw e;
        console.log("Successfully sent your transfer: ", bundle);
    });
}

function generateP1Data(interval, numMessages)
{
 
    for (i=0; i<numMessages; i++)
    {
        sleep(interval);
        let p1_data = createP1Data();
        let p1_message = p1ToString(p1_data);
        sendIotaMessage(p1_message, true);
    }
}


// Create a function to handle every HTTP request
function handler(req, res){
    if(req.method == 'POST')
    {

        //read form data
        req.on('data', function(chunk) {

            //grab form data as string
            var data = chunk.toString();
            console.log(data);

            let cat = data.split("&")[0];         
            console.log(cat);

            if (cat == "p1") {
                var interval = eval(data.split("&")[1]);
                var numTrans = eval(data.split("&")[2]);
                console.log(interval);
                console.log(numTrans);
                generateP1Data(interval*1000, numTrans);
            } else if (cat == "msg") {
                var msg = data.split("&")[1];
                console.log(msg);
                sendIotaMessage(msg, seed, address, false);
            }
            


            //fill in the result and form values
            form = "IOTA!";

            //respond
            res.setHeader('Content-Type', 'text/html');
            res.writeHead(200);
            res.end(form);

        });

    } else {
        res.writeHead(200);
        res.end();
    };

    };

// Create a server that invokes the `handler` function upon receiving a request
http.createServer(handler).listen(8000, function(err){
  if(err){
    console.log('Error starting http server');
  } else {
    console.log("Server running at http://127.0.0.1:8000/ or http://localhost:8000/");
  };
});