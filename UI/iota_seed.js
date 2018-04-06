var fetch = require('node-fetch')
var crypto = require('crypto')
var Mam = require('../libraries/mam.client.js/lib/mam.node.js')
var IOTA = require('iota.lib.js')

// Random Key Generator
const keyGen = length => {
    var charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ9'
    var values = crypto.randomBytes(length)
    var result = new Array(length)
    for (var i = 0; i < length; i++) {
    result[i] = charset[values[i] % charset.length]
    }
    return result.join('')
}

const nextRoot = async myroot => {
    return await Mam.fetch(myroot, 'public', null, logData)
}

// Publish to tangle
const normalPublish = async packet => {
    // Create Trytes
    var trytes = iota.utils.toTrytes(JSON.stringify(packet))
    // Get MAM payload
    var message = Mam.create(mamStateNormal, trytes)
    // Save new mamState
    mamStateNormal = message.state

    // Attach the payload.
    await Mam.attach(message.payload, message.address)
    let nxtRt = await nextRoot(message.root);
    console.log("-------------")
    console.log("   Message: " + packet)
    console.log("   Root: " + message.root)
    console.log("   Address: " + message.address)
    console.log("   Next Root: " + nxtRt.nextRoot)

    return message.root
}

// Callback used to pass data out of the fetch
const logData = data => console.log(JSON.parse(iota.utils.fromTrytes(data)))

 // Callback used to pass data + returns next_root
const listen = async myroot => {
    var resp = await Mam.fetch(myroot, 'public', null, logData)
    console.log(JSON.stringify(resp))
}



var iota = new IOTA({ provider: `https://nodes.testnet.iota.org:443/` })

// Generate seed
let seed = keyGen(81);
console.log("Seed: " + seed);

// Initialise MAM State
let mamStateNormal = Mam.init(iota, seed)

let myroot
let nextroot

const execute = async () => {
    myroot = await normalPublish("AAA")
    myroot = await normalPublish("BBB")
    myroot = await normalPublish("CCC")

    await listen(myroot)
}

execute()