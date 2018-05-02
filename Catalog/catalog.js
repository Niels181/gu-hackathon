let serviceProvider, goal, reward, frequency, period, data;

function retrieveDictValue(dict, key) {
    return dict[key]
}

function updateReward() {
    let rewardDict = {};
    rewardDict["sp1"] = "Free";
    rewardDict["sp2"] = "Receive coins";
    rewardDict["sp3"] = "Pay coins";
    
    reward = retrieveDictValue(rewardDict, serviceProvider);
    document.getElementById("reward").innerText = reward;   
}

function updateGoal() {
    let goalDict = {};
    goalDict["sp1"] = "Based on the actual P1 data the energy saving is determined for the gas and electricity consumption. The actual P1 data is referenced to the historical consumption corrected with actual temperature and the appropriate usage category. Energy saving is rewarded with energy coins. P4 data provided by the network operator is used for validation of the P1 data for determining the final energy saving. The selected service provider will read the data every 10 seconds. The user is in control to start and stop the subscription. The provided P1 data is not used for other purposes.";
    goalDict["sp2"] = "My goal is to rule the world";
    goalDict["sp3"] = "Something else.";
    
    goal = retrieveDictValue(goalDict, serviceProvider);
    document.getElementById("goal").innerText = goal;
}

function updatePeriod() {
    let periodDict = {};
    periodDict["sp1"] = "1 week"
    periodDict["sp2"] = "6 months";
    periodDict["sp3"] = "1 year";
    
    period = retrieveDictValue(periodDict, serviceProvider);
    document.getElementById("period").innerText = period;
}

function updateFrequency() {
    let frequencyDict = {};
    frequencyDict["sp1"] = "10 sec";
    frequencyDict["sp2"] = "5 sec";
    frequencyDict["sp3"] = "30 sec";
    
    frequency = retrieveDictValue(frequencyDict, serviceProvider);
    document.getElementById("frequency").innerText = frequency;
}

function updateData(serviceProvider) {
    let dataDict = {};
    dataDict["sp1"] = "datetime, electricity consumption";
    dataDict["sp2"] = "datetime, gas";
    dataDict["sp3"] = "datetime, electricity production";
    
    data = retrieveDictValue(dataDict, serviceProvider);
    document.getElementById("data").innerText = data;

    return true;
}

function updateCatalog() {
    serviceProvider = document.getElementById("dropdown").value;
    updateGoal(serviceProvider);
    updateReward(serviceProvider);
    updatePeriod(serviceProvider);
    updateFrequency(serviceProvider);
    updateData(serviceProvider);
}

function sendTransaction() {
    let delim = "|";
    let msgStr = serviceProvider + delim + reward + delim + period + delim + frequency + delim + data;
    msgStr = "RijksWaterstaat|1year|1hour|gas,electricity_cons|10euro";
    let checked = document.getElementById("check").checked;
    
    let confirmed = false;
    if (checked) {
        confirmed = confirm("Are you sure you want to purchase this service and share your data?");
    } else {
        alert("You have to accept the conditions in order to purchase this service.");
    }

    if (confirmed) {
        console.log(msgStr);

        setTimeout(function() { let responseA = ajax("msg&" + msgStr); }, 2500);
        setTimeout(function() { let responseB = ajax("p1&interval=5&numTrans=5"); }, 2500);

    }
}
