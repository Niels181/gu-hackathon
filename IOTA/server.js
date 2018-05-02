// Run 'node server.js' on cmd to start the server for receiving requests from the client

var http = require('http'); 
let IOTA = require('iota.lib.js');
let CryptoJS = require('crypto-js');
let msgTag = 'LESSISMORE9IOTAHACKATHON';

const seed = 'OS9IHQOOJDOQMCLSYXIMHEEMPTQRAAJQZUSFWCSPZFCJZ9ZMGN9DUMYUBSOARAQHYLALD9WKODIICXVEC'; // KEEP IT SECURE!!
// The receiving address (Niels's wallet!)
let address = 'USRAEQUHLKULRLKQWXJVQMZNLJ9EIAUFSRSNYLND9WCXVQEBJKYDEDLXSVCYJQZQONNRQLROBGEOOHZTXQKJCIXSRX';
let secret = 'bz56mgprl5zpvst41xuaoptppzpaciay';

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

  function selectIotaNode(netType) {
    // List of possible nodes
    let mainNodes = ['http://node02.iotatoken.nl:14265', 'http://node04.iotatoken.nl:14265', 'http://node06.iotatoken.nl:14265'];
    let testNodes = ['https://nodes.testnet.iota.org:443/'];
    let node;

    if (netType == "main") {
        var random = Math.floor(Math.random() * mainNodes.length);
        node = mainNodes[random];
    } else if (netType == "test") {
        node = testNodes[0];
    }
    return node;
  }
 
 function createTransfer(transferDataArray) {
    let address = transferDataArray[0];
    let value = transferDataArray[1];
    let msgTag = transferDataArray[2];
    let msgTrytes = transferDataArray[3];
    let transfer = [{
        'address': address,
        'value': 0,
        'tag': msgTag,
        'message': msgTrytes,
    }]; 
    return transfer;
 } 
  

function sendIotaMessage(message, encryptMessage, descr){
   
    var iota = new IOTA({
        'provider': selectIotaNode("main")
    });

    // Encrypt baseb64
    if (encryptMessage) {
        message = base64Encode(message);
        message = aesEncode(message, secret);
    }

    // Convert message to trytes
    let msgTrytes = iota.utils.toTrytes(message);

    // Construct the transfer bundle with address, 
    // value (amount of IOTA), a tag and a message
    var transfer = createTransfer([address, 0, msgTag, msgTrytes]);

    // Send transfer to the Tangle. Depending on the Node config of the connected Node
    // you also do the PoW at this point. The magic numbers can stay there for the Mainnet
    iota.api.sendTransfer(seed, 9, 14, transfer, function(e, bundle) {
        if (e) throw e;
        // console.log("Successfully sent your transfer: ", bundle);
        console.log("=============================================================");
        console.log("Successfully sent your transfer: " + descr + " at " + new Date());
        console.log("Transaction bundle:", bundle);
        console.log("=============================================================", "");
    });
}

var msgCnt = 1;

function generateP1Data(interval, numMessages)
{
    setTimeout(function () {
        let p1_data = createP1Data();
        let p1_message = p1ToString(p1_data);
        sendIotaMessage(p1_message, true, ("Data transaction " + msgCnt));
    
        msgCnt++;
       if (msgCnt <= numMessages) {
        generateP1Data(interval, numMessages);
       }
    }, interval)

}


// Create a function to handle every HTTP request
function handler(req, res){
    if(req.method == 'POST')
    {

        //read form data
        req.on('data', function(chunk) {

            //grab form data as string
            var data = chunk.toString();

            let cat = data.split("&")[0];         

            if (cat == "p1") {
                var interval = eval(data.split("&")[1]);
                var numTrans = eval(data.split("&")[2]);
                                
                generateP1Data(interval*1000, numTrans);                
                
            } else if (cat == "msg") {
                var msg = data.split("&")[1];
                                
                sendIotaMessage(msg, false, "Data filter transaction");

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