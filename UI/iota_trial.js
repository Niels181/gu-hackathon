//const iotaApiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Mzc4OTg2MDMsImVtYWlsIjoiZXdvdWRAZXdvdWR2b3MubmwiLCJpYXQiOjE1MjI5MTk1NjksImlzcyI6ImlvdGEifQ.dpgeyEFVn_gKbj75jFajfvrawpO4eihJUqnPreHl3DI';
var IOTA = require('../../iota.lib.js/lib/iota');
const asciiToTrytes = require('../../iota.lib.js/lib/utils/asciiToTrytes.js');

// Create IOTA instance with host and port as provider
var iota = new IOTA({
    'provider': 'https://powbox.testnet.iota.org/api/v1',
    'sandbox' : true
   // 'token' : iotaApiKey
});

// now you can start using all of the functions
var nodeInfo;
iota.api.getNodeInfo(function(error, success) {
    if (error) {
        console.error(error);
    } else {
        nodeInfo = success;
        console.log(success);
    }
});

//console.log(iota.api.getNodeInfo());
console.log(nodeInfo)

// you can also get the version
console.log(iota.version);

// // First co-signer uses index 0 and security level 3
// var digestOne = iota.multisig.getDigest('ABCDFG', 0, 3);
// // Second cosigner also uses index 0 and security level 3 for the private key
// var digestTwo = iota.multisig.getDigest('FDSAG', 0, 3);

// // Multisig address constructor
// var Address = iota.multisig.address;

// // Initiate the multisig address generation
// var address = new Address()

//     // Absorb the first cosigners key digest
//     .absorb(digestOne)

//     // Absorb the second cosigners key digest
//     .absorb(digestTwo)

//     //and finally we finalize the address itself
//     .finalize();


// console.log("MULTISIG ADDRESS: ", address);

// // Simple validation if the multisig was created correctly
// // Can be called by each cosigner independently
// var isValid = iota.multisig.validateAddress(address, [digestOne, digestTwo]);

// console.log("IS VALID MULTISIG ADDRESS:", isValid);

// //  SIGNING EXAMPLE
// //
// //  Even though these functions are called subsequently, the addSignature functions have to be called by each
// //  cosigner independently. With the previous signer sharing the output (bundle with the transaction objects)
// //
// //  When it comes to defining the remainder address, you have to generate that address before making a transfer
// //  Important to know here is the total sum of the security levels used by the cosigners.

// // Transfers object
// var multisigTransfer = [
//     {
//       address: iota.utils.noChecksum('ZGHXPZYDKXPEOSQTAQOIXEEI9K9YKFKCWKYYTYAUWXK9QZAVMJXWAIZABOXHHNNBJIEBEUQRTBWGLYMTX'),
//       value: 999,
//       message: '',
//       tag: '9'.repeat(27)
//     }
//   ];
  
//   // Multisig address object, used as input
//   var input = {
//     address: address,
//     securitySum: 6,
//     balance: 1000
//   }
  
//   // Define remainder address
//   var remainderAddress = iota.utils.noChecksum('NZRALDYNVGJWUVLKDWFKJVNYLWQGCWYCURJIIZRLJIKSAIVZSGEYKTZRDBGJLOA9AWYJQB9IPWRAKUC9FBDRZJZXZG');
  
//   iota.multisig.initiateTransfer(input, remainderAddress, multisigTransfer, function(e, initiatedBundle) {
  
//       if (e) {
//           console.log(e);
//       }
  
//       iota.multisig.addSignature(initiatedBundle, address, iota.multisig.getKey('ABCDFG', 0, 3), function(e,firstSignedBundle) {
  
//           if (e) {
//               console.log(e);
//           }
  
//           iota.multisig.addSignature(firstSignedBundle, address, iota.multisig.getKey('FDSAG', 0, 3), function(e,finalBundle) {
  
//               if (!e) {
//                   console.log("IS VALID SIGNATURE: ", iota.utils.validateSignatures(finalBundle, address));
//               }
//           });
//       });
  
//   })

//   var inputSeed = {
//     address: address,
//     securitySum: 6,
//     balance: 1000
//   };
//   var depth = 6;
//   var minWeightMagnitude = 1;

//   var transfers = [
//     {
//       address: iota.utils.noChecksum('ZGHXPZYDKXPEOSQTAQOIXEEI9K9YKFKCWKYYTYAUWXK9QZAVMJXWAIZABOXHHNNBJIEBEUQRTBWGLYMTX'),
//       value: 999,
//       message: 'Hello world!',
//       tag: '9'.repeat(27)
//     }
//   ];

//   iota.api.sendTransfer(inputSeed, depth, minWeightMagnitude, transfers, function(error, sentTransactions) {
//     if (error) {
//         console.log(error);
//     } else {
//         console.log(sentTransactions);
//     }

//   });
  
// console.log("Success!")




console.log("Connected to IOTA sandbox!")

var testData = "LALALA"
var testDataInTrytes = asciiToTrytes.toTrytes(testData)
var testDataFromTrytes = asciiToTrytes.fromTrytes(testDataInTrytes)

console.log(testData);
console.log(testDataInTrytes);
console.log(testDataFromTrytes);
console.log("")
