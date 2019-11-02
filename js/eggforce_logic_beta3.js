// INITIALIZE WEB3

let contract;
let contractAddress = "0xB771aB556092785a0487Cd011dd92a70fec62c34"; // beta 3
let provider;
let signer = 0;
let filter;

var m_account = ""; // should be "", setup for local tests
document.getElementById('account').innerHTML = formatEthAdr(m_account);

window.addEventListener('load', async () => {
    // Modern dapp browsers...
    if (window.ethereum) {
        try {
            // Request account access if needed
            await ethereum.enable();
			
			//Error: unsupported network
			//"1" works (mainnet?), 2 doesn't, 3 doesn't, 4 does (testnet?)
			//let provider = ethers.providers.InfuraProvider(99);

			//Reference Error: web3 undefined in local tests
			//Works once deployed to web

			provider = new ethers.providers.Web3Provider(web3.currentProvider);
			signer = provider.getSigner();
						
			// provider: read-only access
			// signer: read and write
			contract = new ethers.Contract(contractAddress, abi, signer);

			let addressPromise = signer.getAddress().then(function(result){
				m_account = result;
				document.getElementById('account').innerHTML = formatEthAdr(m_account);
				console.log(m_account);
				startLoop();
			});

			
			//beginEventLogging();			
        } catch (error) {
            // User denied account access...
			useReadOnlyProvider();
			//beginEventLogging();
        }
    }
    // Non-dapp browsers...
    else {
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
		useReadOnlyProvider();
		//beginEventLogging();
    }
});

function useReadOnlyProvider() {
	provider = new ethers.providers.JsonRpcProvider("https://core.poa.network");		
	contract = new ethers.Contract(contractAddress, abi, provider);
	startLoop();
}

// VARIABLES

const MULT_COST = 10;
const PAST_BLOCKS = 12 * 60 * 24 * 2 * 10; // 12 blocks per minute, 60min per hour, 24h in a day
const POA_BLOCK_TIME = 5.4;
const TIME_FOR_1RAD = 60 * 60 * 4; // 4 hours in seconds

var a_chest = [0];
var a_daiAuctionCost = [0];
var a_daiAuctionTimer = [0];
var a_daiAuctionCostNow = [0];
var a_end = [0];
var a_gameState = 0;
var a_globalRad = [0];
var a_joinCost = [0];
var a_launch = [0];
var a_plantamidDaiCost = [0];
var a_radAuctionCost = [0];
var a_radAuctionTimer = [0];
var a_radAuctionCostNow = [0];
var a_tribeRad = [0];
var a_maxTerritory = [0];

var a_tierProd = [0, 0, 0, 0, 0, 0, 0, 0, 0];
for(let k = 1; k < 9; k++){
	a_tierProd[k] = [0, 0, 0, 0];
}
var a_tierSum = [0, 0, 0, 0, 0, 0, 0, 0, 0];

var h_anomalyLand = true; // whether land or prod is targeted on anomaly buy
var h_anomalyString = ""; // contains Land or Prod, based on choice
var h_anomalyTargetId = 0;
var h_anomalyWeight = [0, 0, 0, 0];

var h_landWeight = 0;

var h_selectedLand = 1; // base land selected for land update
var h_selectedTier = 1; // base tier for Eggoa Plantamid
var h_selectedFloor = 1; // base rise for Dai Plantamid

var h_selectedTribe = 0; // selected tribe to join game - or to change tribe
var h_selectedName = ""; // player chosen name for land
var nameMaxChar = 20; // maximum characters for name
var h_join = true; // whether the join button or tribe button is shown

var h_upgradeTier = 1; // selected tier for Eggoa Upgrade
var h_upgradeWeight = [0, 0, 0, 0];

var l_array = []; // store leaders and earned rads here

var m_balance = [0];
var m_boost = 1;
var m_collectedTribeRad = [0];
var m_daiPlantamid = [0];
var m_earnedRad = [0];
var m_eggoaPlantamid = [0];
var m_lastRad = [0];
var m_lastShroom = [0];
var m_openedChest = false;
var m_power = [0];
var m_rad = [0];
var m_radToHarvest = [0];
var m_shroom = [0];
var m_tier = [0];
var m_tribe = [0];
var m_tribeChange = [0];
var m_unlockTierRadCost = [0];
var m_upgradeCost = [0];
var m_upgradeWeightSum = [0];

var m_prod = []; // RAD per hourfor each tier
var m_totalProd = 0; // total RAD per hour, all tiers included

var n_sacrificeAmount = [0];
var n_floorDaiCost = [0];

var s_upgradeRadCost = [];

// Nest array
var m_nest = [
	{ amount: 0, level: 0, attackNext: 0, ownedLand: 0, stat0: 1, stat1: 0, stat2: 0, stat3: 0 },
	{ amount: 0, level: 0, attackNext: 0, ownedLand: 0, stat0: 1, stat1: 0, stat2: 0, stat3: 0 },
	{ amount: 0, level: 0, attackNext: 0, ownedLand: 0, stat0: 1, stat1: 0, stat2: 0, stat3: 0 },
	{ amount: 0, level: 0, attackNext: 0, ownedLand: 0, stat0: 1, stat1: 0, stat2: 0, stat3: 0 },
	{ amount: 0, level: 0, attackNext: 0, ownedLand: 0, stat0: 1, stat1: 0, stat2: 0, stat3: 0 },
	{ amount: 0, level: 0, attackNext: 0, ownedLand: 0, stat0: 1, stat1: 0, stat2: 0, stat3: 0 },
	{ amount: 0, level: 0, attackNext: 0, ownedLand: 0, stat0: 1, stat1: 0, stat2: 0, stat3: 0 },
	{ amount: 0, level: 0, attackNext: 0, ownedLand: 0, stat0: 1, stat1: 0, stat2: 0, stat3: 0 },
	{ amount: 0, level: 0, attackNext: 0, ownedLand: 0, stat0: 1, stat1: 0, stat2: 0, stat3: 0 }  
];

// Doc array
var doc_m_nest = [
	0, 
	document.getElementById("tier1"), 
	document.getElementById("tier2"), 
	document.getElementById("tier3"), 
	document.getElementById("tier4"), 
	document.getElementById("tier5"), 
	document.getElementById("tier6"), 
	document.getElementById("tier7"),
	document.getElementById("tier8")
];

var o_collectedTribeRad;

var landobj;
var t_land = []; // holds all land info. lastLand, lord, eggoa, level, tribe

/* GLOBAL LOOP */

//Initiates loops
function startLoop(){
	console.log('Main loop started.');
	initializeBlockchainData();
	controlLoop1();
	controlLoop4();
    controlLoop60();
}

//One-time init
function initializeBlockchainData() {
	initializeFilter();
	refreshData();
	updateJoinCost();
	updateLaunchTimestamp();
	updateEndTimestamp();
	updateTerritory();
	getSacrificeAmount(1);
	getFloorDaiCost(1);
	getShroomCost();
}

//Fast loop every second
function controlLoop1(){
	updateLaunchTimer();
	updateEndTimer();
	updateDaimidTimer();
	updateGoamidTimer();
	updateLastRadTimer();
	updateLastShroomTimer();
	//updateSelectedLandTimer(h_selectedLand);
	updateNestTextTimer();
	setTimeout(controlLoop1, 1000);
}

//Main loop on 4 seconds
function controlLoop4() {
	if(signer != 0) {
		updateAccount();
	}
	updateDaiAuctionCostNow();
	updateRadAuctionCostNow();
	updateTierWeightHtml();
    updatePlayerChest();
    checkGameState();
	updateGameState();
	logThePast();
    setTimeout(controlLoop4, 4000);
}

//Large update loop every minute
function controlLoop60(){
	refreshData();
    setTimeout(controlLoop60, 60000);
}

// Get past block, current block, current time to get past events and compute their timestamps
function initializeFilter() {
	provider.getBlockNumber().then((current) => { 
		f_fromBlock = current - PAST_BLOCKS;
		getPastEvents();
	});
	provider.getBlockNumber().then((current2) => {
		f_currentBlock = current2;
	});
	f_currentTime = getCurrentTime();
}

// Current block, then block details
function updateCurrentBlock(){
	provider.getBlockNumber().then((blockNumber) => {
		console.log("Current block number: " + blockNumber);
		provider.getBlock().then((result) => {
			console.log(result.timestamp);
		})
	});
}

function refreshData(){
	updateTribeChange(m_account);
	updateTribe(m_account);
	updateTribeRad(m_tribe);
	updateRad(m_account);
	updateShroom(m_account);
	updateTier(m_account);
	//updateNest(m_account);
	updateOpenedChest(m_account);
	updateLastRad(m_account);
	updateLastShroom(m_account);	
	updateDaiPlantamid(m_account);
	updateEggoaPlantamid(m_account);
	updateEarnedRad(m_account, true);
	updateBalance(m_account);
	updateCollectedTribeRad(m_account);
	updatePlayerChest();
	updateGlobalRad();
	updateChest();
	updateDaiAuctionCost();
	updateDaiAuctionTimer();
	updateRadAuctionCost();
	updateRadAuctionTimer();
	updateUpgradeCost();
	updateRadToHarvest();
	updateJoinOrChange();
	updateTribeRadToClaim();
	updateTierProd();
	updateTerritory();
	updateBoost();
	computeProduction();
	updateLeaderRad();
    sortUpdateLeaderboard();
    updateMaxTerritory();
}

//** UTILITIES **//

// Truncates ETH address to first 8 numbers
function formatEthAdr(__adr){
	return __adr.substring(0, 10);
}

// Returns current time in seconds
function getCurrentTime() {
	return parseInt((new Date()).getTime() / 1000);
}

// Returns timestamp in hh:mm:ss
function getTimeFromBlock(__block) {
	//console.log("block: " + __block);
	let _dif = parseInt(f_currentBlock) - parseInt(__block);
	//console.log("dif: " + _dif);
	let _time = parseInt(f_currentTime) - parseInt(_dif * POA_BLOCK_TIME);
	//console.log("time : " + _time);
	let _date = new Date(1000 * _time).toISOString().substr(11, 8);
	//console.log(_date);
	return _date;
}

// Convert timestamp in seconds into readable date
// hh:mm:ss if < |24h|, x days if >= |24h|
function convertTime(__timestamp){

	let _currentTimestamp = getCurrentTime();
	let _time = __timestamp - _currentTimestamp;
	//console.log(_time);
	let _positive = true;

	let _days = 0;
	let _hours = 0;
	let _minutes = 0;
	let _seconds = 0;

	let _returnString = "";

	if(_time < 0) {
		_positive = false;
	}

	if(_positive == true) {
		_hours = Math.floor(_time / 3600);
		_days = parseFloat(_hours / 24).toFixed(0);
		_minutes = Math.floor((_time % 3600) / 60);
		_seconds = parseFloat((_time % 3600) % 60).toFixed(0);
	}
	else {
		_hours = Math.ceil(_time / 3600);
		_days = parseFloat(_hours / 24).toFixed(0);
		_minutes = Math.ceil((_time % 3600) / 60);
		_seconds = parseFloat((_time % 3600) % 60).toFixed(0);
	}

	if(_hours >= 24 || _hours <= -24) {

		if(_positive == false) {
			_days = -_days;
		}

		if(_days == 1) {
			_returnString = _days + " day from now";
			if(_positive == false){
				_returnString = _days + " day ago";
			}
		} else {
			_returnString = _days + " days from now";
			if(_positive == false){
				_returnString = _days + " days ago";
			}
		}
			
	} else if(_hours >= 0 && _positive == true) {

		if(_hours < 10) { _hours = "0" + _hours }
		if(_minutes < 10) { _minutes = "0" + _minutes }
		if(_seconds < 10) { _seconds = "0" + _seconds }

		_returnString =  _hours + ":" + _minutes + ":" + _seconds;

	} else {
		_hours = -_hours;
		_minutes = -_minutes;
		_seconds = -_seconds;

		if(_hours > 1) { 
			_returnString = _hours + " hours ago";
		} else if(_hours == 1) { 
			_returnString = "1 hour ago";
		} else if(_minutes > 1) {
			_returnString = _minutes + " minutes ago";
		} else if(_minutes == 1) {
			_returnString = "1 minute ago";
		} else {
			_returnString = "a few seconds ago";
		}
	}

	return _returnString;
}

//** LOCAL FUNCTIONS **//

// Calculate production per second for each tier

function computeProduction() {
	m_totalProd = 0;
	for(let i = 1; i <= m_tier; i++) {
		// add all 4 stats weighted
		m_prod[i] = parseInt(m_nest[i].stat0) * parseInt(a_tierProd[i][0]) + parseInt(m_nest[i].stat1) * parseInt(a_tierProd[i][1]) + parseInt(m_nest[i].stat2) * parseInt(a_tierProd[i][2]) + parseInt(m_nest[i].stat3) * parseInt(a_tierProd[i][3]);
		// multiply by amount, tier, and boost
		m_prod[i] = m_prod[i] * m_nest[i].amount * i * m_boost;
		// divide by weight sum
		m_prod[i] = m_prod[i] / a_tierSum[i];
		// divide by TIME_FOR_1RAD for seconds, divide by 4 for prod per hour
		m_prod[i] = parseInt(m_prod[i] / 4);
		//m_prod[i] = m_prod[i].toFixed(2);
		//console.log("Tier " + i + " = " + m_prod[i]);
		
		// add result to totalprod
		m_totalProd = parseFloat(m_totalProd) + parseFloat(m_prod[i]);

		// update HTML
		d_tierProd[i].innerHTML = m_prod[i];
	}
	// update totalProd HTML
	document.getElementById('totalProd').innerHTML = m_totalProd;
}

// prod for leaders. might require significant rework...
/*
var stat = [0, 2, 3, 4];
var tier = [stat, stat, stat, stat, stat, stat, stat, stat]

var leaderArray = [{ address: "0", prod: "0", nest: nest}];

function computeLeaderProd() {
	
	for(let j = 0; j < leaderArray.length; j++) {
		let _totalProd = 0;
		for(let i = 1; i <= 8; i++) {
			// add all 4 stats weighted
			leaderArray[j].prod[i] = parseInt(m_nest[i].stat0) * parseInt(a_tierProd[i][0]) + parseInt(m_nest[i].stat1) * parseInt(a_tierProd[i][1]) + parseInt(m_nest[i].stat2) * parseInt(a_tierProd[i][2]) + parseInt(m_nest[i].stat3) * parseInt(a_tierProd[i][3]);
			// multiply by amount, tier, and boost
			m_prod[i] = m_prod[i] * m_nest[i].amount * i * m_boost;
			// divide by weight sum
			m_prod[i] = m_prod[i] / a_tierSum[i];
			// divide by TIME_FOR_1RAD for seconds, divide by 4 for prod per hour
			m_prod[i] = parseInt(m_prod[i] / 4);
			//m_prod[i] = m_prod[i].toFixed(2);
			//console.log("Tier " + i + " = " + m_prod[i]);
			
			// add result to totalprod
			m_totalProd = parseFloat(m_totalProd) + parseFloat(m_prod[i]);
	
			// update HTML
			d_tierProd[i].innerHTML = m_prod[i];
		}
		// update totalProd HTML
		document.getElementById('totalProd').innerHTML = m_totalProd;
	}

}
*/
// Add eggoaPlantamid and daiPlantamid (+ the base of 1)

function updateBoost() {
	m_boost = parseInt(m_eggoaPlantamid) + parseInt(m_daiPlantamid) + parseInt(1);
	document.getElementById('boost').innerHTML = m_boost;
}

// Check available tribe rads

function updateTribeRadToClaim() {
	document.getElementById('tribeRadToClaim').innerHTML = parseInt(a_tribeRad) - parseInt(m_collectedTribeRad);	
} 

// Calculate DAI earnings for player, based on his proportion of earned rads
// Check if game is over and if player has opened chest too

function updatePlayerChest() {

	let d_playerChest = document.getElementById('playerChest');

	let _playerShare = parseFloat(a_chest * m_earnedRad / a_globalRad).toFixed(6);
	m_playerChest = _playerShare;

	// has player opened his chest already?
	if(m_openedChest == true) {
		d_playerChest.innerHTML = "You've opened your POA chest before, and won " + m_playerChest + " POA. Good job!";
	}

	// is the game over?
	let _currentTimestamp = parseInt((new Date()).getTime() / 1000); // from ms to s
	let _time = a_end - _currentTimestamp;
	if(_time < 0 && m_openedChest == false) {
		d_playerChest.innerHTML = "You have won " + m_playerChest + " POA!<br><button class='btn btn-success'  onclick='openRewardChest()'>Open Chest</button>";
	}

	// if the game is still ongoing, give estimation
	else if(_time >= 0) {
		d_playerChest.innerHTML = "Your estimated earnings: " + m_playerChest + " POA.";
	}
}

// Show "join" or "changeTribe" button based on whether played has joined game already
function updateJoinOrChange() {
	d_joinOrChange = document.getElementById('joinOrChange');
	d_joinOrChangeButton = document.getElementById('joinOrChangeButton');

	if(m_tier[0] > 0) {
        if(h_join == true) {
            h_join = false;
            d_joinOrChange.innerHTML = 'changing tribe';
            d_joinOrChangeButton.innerHTML = '<button class="btn btn-danger" onclick="checkTribeIsSelected(changeTribe)">Change Tribe</button>'
        }
	}
	else {
        if(h_join == false) {
            h_join = true;
            d_joinOrChange.innerHTML = 'joining the game';
            d_joinOrChangeButton.innerHTML = 'Choose land name: <input type="text" id="newLandName" value="" size="20"><button class="btn btn-danger" onclick="checkTribeIsSelected(joinGame)">Join Game</button>'
        }
	}
}

// Check if game hasn't started (0), is ongoing (1), has ended (2)
function checkGameState() {
    _currentTimestamp = getCurrentTime();
    if(a_end[0] < _currentTimestamp) {
        if(a_end[0] !== 0) {
            a_gameState = 2;
        }
        else {
            a_gameState = 0;
        }
    }
    else {
        a_gameState = 1;
    }
}

d_gameState = document.getElementById('gameState');

function updateGameState() {
    let _string = "";
    if(a_gameState == 1) {
        _string = "<h3>THE GAME IS ACTIVE</h3><h5>Collect RADs to win part of the reward chest</h5>"; 
    }
    else if(a_gameState == 0) {
        _string = "<h3>THE GAME IS ABOUT TO START</h3><h5>Get ready to hatch!</h5>";
    }
    else if(a_gameState == 2) {
        _string = "<h3>THE GAME HAS ENDED</h3><h5>Open your Reward Chest and withdraw your earnings!</h5>"
    }
    d_gameState.innerHTML = _string;
}

// Timers

function updateLaunchTimer() {
	document.getElementById('launch').innerHTML = convertTime(a_launch);
}

function updateEndTimer() {
	document.getElementById('end').innerHTML = convertTime(a_end);
}

function updateDaimidTimer() {
	document.getElementById('daiAuctionTimer').innerHTML = convertTime(a_daiAuctionTimer);
}

function updateGoamidTimer() {
	document.getElementById('radAuctionTimer').innerHTML = convertTime(a_radAuctionTimer);
}

function updateLastRadTimer() {
	document.getElementById('lastRad').innerHTML = convertTime(m_lastRad);
}

function updateLastShroomTimer() {
	document.getElementById('lastShroom').innerHTML = convertTime(m_lastShroom);
}

function updateSelectedLandTimer(__id) {
	contract.land(__id).then((result) =>
	{
		t_land[__id].lastLand = result.lastLand.toString();
		if(t_land[__id].lastLand != 0) {
			document.getElementById('landLast').innerHTML = convertTime(t_land[__id].lastLand);
		}
		else {
			document.getElementById('landLast').innerHTML = convertTime(getCurrentTime());
		}
	});
}

function updateNestTextTimer() {
	for(let i = 1; i <= m_tier; i++) {
		updateNestText(i);
	}
}

// change land button to "attack" or "collect" depending if player is lord of h_selectedland
let d_landButton = document.getElementById('landButton');

function updateLandButton() {
	if(t_land[h_selectedLand].lord == m_account) {
		d_landButton.innerHTML = '<button class="btn btn-success" onClick="collectShrooms()">Collect Shrooms</button>';
	} else if (t_land[h_selectedLand].tribe == m_tribe) {
		d_landButton.innerHTML = 'Land Owned by a Tribe Member';
	} else {
		d_landButton.innerHTML = '<button class="btn btn-success" onClick="attackLand()">Attack Land</button>';
	}
}

// READ ONLY ETHERS

// if signer isn't 0, check if player changes accounts
// TEST
function updateAccount() {

	provider = new ethers.providers.Web3Provider(web3.currentProvider);
	signer = provider.getSigner();	
	contract = new ethers.Contract(contractAddress, abi, signer);

	let addressPromise = signer.getAddress().then(function(result){
		m_account = result;
		document.getElementById('account').innerHTML = formatEthAdr(m_account);
		//console.log(m_account);
		refreshData();
	});
}

function updateMaxTerritory() {
    contract.maxTerritory().then((result) => 
		{
            handleResult(result, a_maxTerritory, 'maxLand', "string");
            document.getElementById('maxLand2').innerHTML = result.toString();
		});
}

/*
function getContractOwner() {
	contract.owner().then((result) => 
			{
				let _owner = result;
				console.log(_owner);
				document.getElementById("contractOwner").innerHTML = formatEthAdr(_owner);
			});
}
*/
// Tier prod (all 8) BAD NAME? SHOULD BE TIER WEIGHT
function updateTierProd() {
	for(let i = 1; i < 9; i++) {
		contract.GetTierProd(i).then((result) =>
		{
			a_tierProd[i][0] = result[0].toString();
			a_tierProd[i][1] = result[1].toString();
			a_tierProd[i][2] = result[2].toString();
			a_tierProd[i][3] = result[3].toString();
			a_tierSum[i] = parseInt(a_tierProd[i][0]) + parseInt(a_tierProd[i][1]) + parseInt(a_tierProd[i][2]) + parseInt(a_tierProd[i][3]); 
		});
	}
}

var d_tierProd = [
	0,
	document.getElementById('tier1prod'),
	document.getElementById('tier2prod'),
	document.getElementById('tier3prod'),
	document.getElementById('tier4prod'),
	document.getElementById('tier5prod'),
	document.getElementById('tier6prod'),
	document.getElementById('tier7prod'),
	document.getElementById('tier8prod')
]

function updateTierWeightHtml() {
	for(let i = 1; i < 9; i++) {
		d_tierWeight[i].innerHTML = a_tierProd[i][0] + "/" + a_tierProd[i][1] + "/" + a_tierProd[i][2] + "/" + a_tierProd[i][3];
	}	
}

var d_tierWeight = [
	0,
	document.getElementById('tier1weight'),
	document.getElementById('tier2weight'),
	document.getElementById('tier3weight'),
	document.getElementById('tier4weight'),
	document.getElementById('tier5weight'),
	document.getElementById('tier6weight'),
	document.getElementById('tier7weight'),
	document.getElementById('tier8weight')
]

// Territory stats (all 64)
/*
function updateTerritory(){
	for(let i = 1; i <= 64; i++){
		contract.land(i).then((result) =>
		{
			console.log("Territory " + i);
			console.log(result.lastLand.toString());
			console.log(result.lord);
			console.log(result.eggoa.toString());
			console.log(result.level.toString());
			contract.GetLandStat(i).then((result3) =>
			{
				contract.tribe(result.lord).then((result2) =>
				{
					console.log("Territory " + i + " is held by tribe " + result2.toString());
					t_land[i] = [result.lastLand.toString(), result.lord, result.eggoa.toString(), result.level.toString(), result2.toString(), result3[0].toString(), result3[1].toString(), result3[2].toString(), result3[3].toString()];
					updateLand(document.getElementById('landSelector').value);
				});
			});
		});
	}
}
*/

// restricts __number between __min and __max
// updates appropriate __html element
function checkBoundaries(__number, __html, __min, __max) {
	if(__number > __max) {
		__number = __max;
	} else if (__number < __min) {
		__number = __min;
	}
	document.getElementById(__html).value = __number;
	return __number;
}

function checkBoundariesWithCb(__number, __html, __min, __max, __callback) {
	if(__number > __max) {
		__number = __max;
	} else if (__number < __min) {
		__number = __min;
	}
	document.getElementById(__html).value = __number;
	__callback(__number);
}

// selected tier of eggoas to use for UpgradeEggoa
function updateUpgradeTier(__tier) {
	__tier = checkBoundaries(__tier, 'tierToUpgrade', 1, m_tier[0]);
	h_upgradeTier = __tier;

	updateUpgradeCost();
}

function updateUpgradeWeight(__weight, __number, __html) {
	__number = checkBoundaries(__number, __html, 0, 999); // 999 upgrades at once ought to be enough for anyone...
	h_upgradeWeight[__weight] = parseInt(__number);

	m_upgradeWeightSum = getArraySum(h_upgradeWeight);

	updateUpgradeCost();
}

function getArraySum(__array) {
	let _sum = 0;
	for(let i = 0; i < __array.length; i++) {
		_sum += __array[i];
	}
	return _sum;
}

function updateTargetType(__type) {
	if(__type == 'land') {
        h_anomalyLand = true;
        h_anomalyString = 'Land';
		document.getElementById('anomalyTargetType').innerHTML = 'Land';
	}
	else if(__type == 'prod') {
        h_anomalyLand = false;
        h_anomalyString = 'Prod';
		document.getElementById('anomalyTargetType').innerHTML = 'Prod';
	}
}

function updateTargetId(__id) {

	if(h_anomalyLand == true) {
		__id = checkBoundaries(__id, 'anomalyTargetId', 1, parseInt(a_maxTerritory));
	}
	else if(h_anomalyLand == false) {
		__id = checkBoundaries(__id, 'anomalyTargetId', 1, 8);
	}

	h_anomalyTargetId = __id;
}

function updateWeight(__weight, __number, __html) {

	__number = checkBoundaries(__number, __html, 0, 4);

	h_anomalyWeight[__weight] = __number;
}

function updateTerritory() {

	let __id = document.getElementById('landSelector').value;

	__id = checkBoundaries(__id, 'landSelector', 1, parseInt(a_maxTerritory));

	// initialize t_land if previously undefined
	if(t_land[__id] == null){
		t_land[__id] = {};
	}

	// display message while waiting for promise result 
	//document.getElementById('w3q_land').innerHTML = "Waiting for blockchain...";

	// begin the spam
	contract.land(__id).then((result) =>
	{
		contract.GetLandStat(__id).then((result2) =>
		{
			contract.tribe(result.lord).then((result3) =>
			{
				h_landWeight = parseInt(result2[0]) + parseInt(result2[1]) + parseInt(result2[2]) + parseInt(result2[3]);
				//console.log(_landWeight);
				if(h_landWeight == 0) { h_landWeight = 1};
				contract.ComputeForce(__id, h_landWeight, result.lord, result.eggoa).then((result4) =>
				{
					contract.ComputeLandShroom(__id).then((result5) =>
					{
                        t_land[__id].name = result.name;
						t_land[__id].lord = result.lord;
						t_land[__id].lastLand = result.lastLand.toString();
						t_land[__id].level = result.level.toString();
						t_land[__id].tribe = result3.toString();
						t_land[__id].stat0 = result2[0].toString();
						t_land[__id].stat1 = result2[1].toString();
						t_land[__id].stat2 = result2[2].toString();
						t_land[__id].stat3 = result2[3].toString();
						t_land[__id].power = result4.toString();
						t_land[__id].shroom = result5.toString();

						// update all the HTML bits
						updateLand(__id);

						// update status message
						//document.getElementById('w3q_land').innerHTML = "Up to date.";

						// update possible action
						updateLandButton();
					});
				});
			});
		});
	});
}

// Update HTML stats of a specific land
function updateLand(__id){
	h_selectedLand = __id;

	//this should be refactored into switching between Discover and Attack states if land is/isn't init
	//not sure the following is actually useful??
	/*if(t_land[__id] == null){
		t_land[__id] = { lord: "none", level: 0, tribe: 0, power: 0, lastLand: a_launch, stat0: 0, stat1: 0, stat2: 0, stat3: 0};
	}*/
	//document.getElementById('landSelected').innerHTML = __id;
	if(t_land[__id].lastLand != 0) {
		document.getElementById('landLast').innerHTML = convertTime(t_land[__id].lastLand);
	}
	else {
		document.getElementById('landLast').innerHTML = convertTime(getCurrentTime());
    }
    document.getElementById('currentLandName').innerHTML = t_land[__id].name;
	document.getElementById('landLord').innerHTML = formatEthAdr(t_land[__id].lord);
	document.getElementById('landPower').innerHTML = t_land[__id].power;
	document.getElementById('landLevel').innerHTML = t_land[__id].level;
	document.getElementById('landTribe').innerHTML = switchTribeName(parseInt(t_land[__id].tribe));
	document.getElementById('landShroom').innerHTML = t_land[__id].shroom;
	document.getElementById('landStat').innerHTML = t_land[__id].stat0 + "/" + t_land[__id].stat1 + "/" + t_land[__id].stat2 + "/" + t_land[__id].stat3;

	// call changeAttackLandTier for proper % to show
	changeAttackLandTier();
}
/*
// Land stat array
function updateLandStat(__id) {
	contract.GetLandStat(__id).then((result) =>
	{
		console.log(result[0].toString());
		t_land[__id][5] = result[0].toString();
		console.log(result[1].toString());
		t_land[__id][6] = result[1].toString();
		console.log(result[2].toString());
		t_land[__id][7] = result[2].toString();
		console.log(result[3].toString());
		t_land[__id][8] = result[3].toString();
	});
}
/*
// Nest values
function updateNestValue(__player, __tier){
	contract.eggoaNest(__player, __tier).then((result) =>
	{
		console.log("Nest " + __tier);
		m_nest[__tier].amount = result.amount.toString();
		console.log("Size : " + result.amount.toString());
		m_nest[__tier].level = result.level.toString();
		console.log("Level : " + result.level.toString());
		m_nest[__tier].attackNext = result.attackNext;
		console.log("Next attack : " + result.attackNext);
		m_nest[__tier].ownedLand = result.ownedLand.toString()
		console.log("Owned land : " + result.ownedLand.toString());
		//console.log(result.stat[2].toString()); // shouldn't work
	})
}
*/

function selectTribe(__tribe) {
	h_selectedTribe = __tribe;
	document.getElementById('selectedTribe').innerHTML = switchTribeName(__tribe);
}

function switchTribeName(__number) {
	switch(__number){
		case 1: return 'Crimson';
		case 2: return 'Blu';
		case 3: return 'Greg';
		case 4: return 'Lumi';
	}
}


// Nest stat array
function updateNestValue(__player, __tier){
	contract.GetNestStat(__player, __tier).then((result) =>
	{
		contract.eggoaNest(__player, __tier).then((result2) =>
		{		
		m_nest[__tier].amount = result2.amount.toString();
		m_nest[__tier].level = result2.level.toString();
		m_nest[__tier].attackNext = result2.attackNext;
		m_nest[__tier].ownedLand = result2.ownedLand.toString()

		m_nest[__tier].stat0 = result[0].toString();
		m_nest[__tier].stat1 = result[1].toString();
		m_nest[__tier].stat2 = result[2].toString();
		m_nest[__tier].stat3 = result[3].toString();
		
		updateNestText(__tier);
		
		//console.log("Nest " + __tier + " size: " + result2.amount.toString() + " level: " + result2.level.toString() + " next attack: " + result2.attackNext + " owned land: " + result2.ownedLand.toString() + " stats: " + result[0].toString() + "/" + result[1].toString() + "/" + result[2].toString() + "/" + result[3].toString());
		});
	});
}

// Update all nests for player
function updateNest(__player ) {

	// if player is active
	for(let i = 1; i <= m_tier[0]; i++) {
		updateNestValue(__player, i);
	}

	// if player isn't active (account change)
	if(m_tier[0] == 0) {
		for(let j = 1; j < 9; j++) {
			m_nest[j].amount = 0;
			m_nest[j].level = 0;
			m_nest[j].attackNext = 0;
			m_nest[j].ownedLand = 0;

			m_nest[j].stat0 = 0;
			m_nest[j].stat1 = 0;
			m_nest[j].stat2 = 0;
			m_nest[j].stat3 = 0;

			updateNestText(j);
		}
	}
}

// Update nest text for m_account
function updateNestText(__tier) {

		// check if "time until attack" is a negative by searching for "ago"
		// if true, convert it into "ready!"
		let _timeUntilAttack = convertTime(m_nest[__tier].attackNext);
		if (_timeUntilAttack.indexOf('ago') > -1) {
			_timeUntilAttack = "ready!";
		}

		doc_m_nest[__tier].innerHTML = 
		"<h6>" + m_nest[__tier].amount + " Eggoas</h6>" +
		"<h6>Level " + m_nest[__tier].level + "</h6>" +
		"<h6>Time until attack: " + _timeUntilAttack + "</h6>" +
		"<h6>Lord of Land: " + m_nest[__tier].ownedLand + "</h6>" +
		"<h6>Stats: " + m_nest[__tier].stat0 + "/" + m_nest[__tier].stat1 + "/" + m_nest[__tier].stat2 + "/" + m_nest[__tier].stat3;
}

// Current block, then block details
function updateCurrentBlock(){
	provider.getBlockNumber().then((blockNumber) => {
		console.log("Current block number: " + blockNumber);
		provider.getBlock().then((result) => {
			console.log(result.timestamp);
		})
	});
}
//-- ADD MORE READ ONLY FUNCTIONS BELOW

// Set variable a_ according to operation_
// Get element of ID doc, change innerHTML to a_
// Log to console and return a_
function handleResult(result_, a_, doc_, operation_){
	if(operation_ == "none"){
		a_[0] = result_;
	} 
	else if(operation_ == "string"){
		a_[0] = result_.toString();
	}
	else if(operation_ == "dai"){
		a_[0] = ethers.utils.formatEther(result_);
	}

	if(doc_ != 0){
		let _html = a_[0];
		if(operation_ == "dai") {
			_html = parseFloat(a_[0]).toFixed(4);
			_html = parseFloat(_html);
		}
		document.getElementById(doc_).innerHTML = _html;
	}

	//console.log(a_[0]);
	return a_[0];
}

// Current player balance
function updateBalance(__player){
	contract.balance(__player).then((result) => 
		{
			handleResult(result, m_balance, 'balance', "dai");
		});
}

// Collected rads from tribe chest for player
function updateCollectedTribeRad(__player){
	contract.collectedTribeRad(__player).then((result) =>
	{
		if(__player == m_account){
			handleResult(result, m_collectedTribeRad, 'collectedTribeRad', "string");
		}
		else {
			handleResult(result, o_collectedTribeRad, 'otherCollectedTribeRad', "string");
		}
	});
}

// Current chest
function updateChest() {
	contract.chest().then((result) =>
	{
		handleResult(result, a_chest, 'chest', "dai");
	})
}

// Base cost for DAI auction
function updateDaiAuctionCost(){
	contract.daiAuctionCost().then((result) =>
	{
		handleResult(result, a_daiAuctionCost, 0, "dai");
	})
}

// Start time for DAI auction
function updateDaiAuctionTimer(){
	contract.daiAuctionTimer().then((result) =>
	{
		handleResult(result, a_daiAuctionTimer, 0, "none");
	})
}

// Current cost for DAI auction
function updateDaiAuctionCostNow() {
	let _currentTimestamp = getCurrentTime();
	let _daiBaseCost = ethers.utils.parseEther(a_daiAuctionCost[0].toString());
	contract.ComputeAuction(a_daiAuctionTimer[0], _daiBaseCost, _currentTimestamp).then((result) =>
	{
		// for some reason, the exact cost doesn't work
		// we refund the difference anyway, so multiply requirement
		result = ethers.utils.formatEther(result);
		result = parseFloat(result * 1.2).toFixed(4);
		handleResult(result, a_daiAuctionCostNow, 'daiAuctionCost', "none");
	});
}

// DAI Plantamid for player
function updateDaiPlantamid(__player){
	contract.daiPlantamid(__player).then((result) =>
	{
		handleResult(result, m_daiPlantamid, 'daiPlantamid', "string");
	});
}

// Historical rads player earned
function updateEarnedRad(__player){
	contract.earnedRad(__player).then((result) =>
	{
			handleResult(result, m_earnedRad, 'earnedRad', "string");
	});
}

// Historical rads for leaders
function updateLeaderRad() {
	for(let i = 0; i < l_array.length; i++) {
		contract.earnedRad(l_array[i].address).then((result) =>
		{
			l_array[i].rad = parseInt(result.toString());
		});
	}
}

// Sort an array in decreasing order
function compare(_a, _b) {
    if(_a.rad < _b.rad) {
        return 1;
    }
    if(_a.rad > _b.rad) {
        return -1;
    }
    return 0;
}

function sortUpdateLeaderboard() {
	d_leaderboard = document.getElementById('leaderboard');
	let _string = "";

	// sort array
	//l_array.sort(function(a,b) {return (b.rad - a.rad);} );
    l_array.sort(compare);

	// run through it and add to string
	for(let i = 0; i < l_array.length; i++) {
		_string += '<h5> ' + formatEthAdr(l_array[i].address) + ' = ' + l_array[i].rad + ' RAD</h5>';
	}

	// finally update d_leaderboard
	d_leaderboard.innerHTML = _string;
}


// Eggoa Plantamid for player
function updateEggoaPlantamid(__player){
	contract.eggoaPlantamid(__player).then((result) =>
	{
		handleResult(result, m_eggoaPlantamid, 'eggoaPlantamid', "string");
	});
}

// End timestamp - should only need to be called once
function updateEndTimestamp(){
	contract.end().then((result) =>
	{
		handleResult(result, a_end, 0, "string");
	});
}

// Global rads earned by all players
function updateGlobalRad(){
	contract.globalRad().then((result) =>
	{
		handleResult(result, a_globalRad, 'globalRad', "string");
	});
}

// DAI cost to join game or change tribe (a "constant", update only once)
function updateJoinCost(){
	contract.joinCost().then((result) =>
	{
		handleResult(result, a_joinCost, 'joinCost', "dai");
	});
}

// Last time player collected his production rads
function updateLastRad(__player){
	contract.lastRad(__player).then((result) =>
	{
		handleResult(result, m_lastRad, 0, "string");
	});
}

// Last time player collected shrooms
function updateLastShroom(__player){
	contract.lastShroom(__player).then((result) =>
	{
		handleResult(result, m_lastShroom, 0, "string");
	});
}

// Launch timestamp - should only need one update
function updateLaunchTimestamp(){
	contract.launch().then((result) =>
	{
		handleResult(result, a_launch, 0, "string");
	});
}

// Whether player opened chest or not
function updateOpenedChest(__player){
	contract.openedChest(__player).then((result) =>
	{
		handleResult(result, m_openedChest, 0, "none");
	});
}

// Plantamid Dai Cost (should only need to be called once)
function updatePlantamidDaiCost(){
	contract.plantamidDaiCost().then((result) =>
	{
		handleResult(result, a_plantamidDaiCost, 'plantamidDaiCost', "dai");
	})
}

// Owned Rads for player
function updateRad(__player){
	contract.rad(__player).then((result) =>
	{
		handleResult(result, m_rad, 'rad', "string");
	});
}

// Base cost for rad auction
function updateRadAuctionCost(){
	contract.radAuctionCost().then((result) =>
	{
		handleResult(result, a_radAuctionCost, 0, "string");
	})
}

// Start time for rad auction
function updateRadAuctionTimer(){
	contract.radAuctionTimer().then((result) =>
	{
		handleResult(result, a_radAuctionTimer, 0, "none");
	})
}

// Current cost for rad auction
function updateRadAuctionCostNow() {
	let _currentTimestamp = getCurrentTime();
	contract.ComputeAuction(a_radAuctionTimer.toString(), a_radAuctionCost.toString(), _currentTimestamp.toString()).then((result) =>
	{
		handleResult(result, a_radAuctionCostNow, 'radAuctionCost', "string");
	});
}

// Owned Shrooms for player (from land grabs)
function updateShroom(__player) {

	// if player has joined the game
	if(m_tier[0] > 0) {
		contract.ComputeShroom(__player).then((result) =>
		{
			handleResult(result, m_shroom, 'shroom', "string");
			computeShroomEggoa();
		});
	}
	// if player hasn't (i.e account change), reset value to 0
	else {
		handleResult(0, m_shroom, 'shroom', "none");
	}
}

// Unlocked tier for player
function updateTier(__player){
	contract.tier(__player).then((result) =>
	{		
		handleResult(result, m_tier, 'tier', "string");
		updateNest(__player);
		updateUnlockCost();
	});
}

// Tribe for player
function updateTribe(__player){
	contract.tribe(__player).then((result) =>
	{
		handleResult(result, m_tribe, 0, "string");
		updateTribeName();
	});
}

function updateTribeName() {
	document.getElementById('tribe').innerHTML = switchTribeName(parseInt(m_tribe));
}

// Number of times player changed tribes
function updateTribeChange(__player){
	contract.tribeChange(__player).then((result) =>
	{
		handleResult(result, m_tribeChange, 'tribeChange', "string");
	});
}

// Accumulated rads for a tribe
function updateTribeRad(__tribe){
	contract.tribeRad(__tribe).then((result) =>
	{
		handleResult(result, a_tribeRad, 0, "string");
	});
}

// Get amount of Eggoas of given tier to sacrifice for player's next plantamid floor
function getSacrificeAmount(__tier){
	contract.ComputeEggoaPlantamidCost(m_eggoaPlantamid, __tier).then((result) =>
	{
		handleResult(result, n_sacrificeAmount, 'sacrificeAmount', "string");
		h_selectedTier = __tier;
	});
}

// Get Dai cost to raise the Plantamid by __floor floors
function getFloorDaiCost(__floor){
	contract.ComputeDaiPlantamidCost(m_daiPlantamid, __floor).then((result) =>
	{
		handleResult(result, n_floorDaiCost, 'floorDaiCost', "dai");
		h_selectedFloor = __floor;
	});
}

// Get Rad cost to unlock next tier
// might not even be needed. unlock cost = tier ** 10 * 10
function updateUnlockCost() {
	contract.ComputeUnlockCost(m_tier).then((result) =>
	{
		handleResult(result, m_unlockTierRadCost, 'unlockTierRadCost', "string");
	});
}

// Get Rad cost for next upgrade of given Eggoa
function updateUpgradeCost() {
	contract.ComputeUpgradeCost(m_nest[h_upgradeTier].level, m_upgradeWeightSum).then((result) =>
	{
		handleResult(result, m_upgradeCost, 'upgradeCost', "string");
	});
}

// Get Rads player can harvest
function updateRadToHarvest() {
	contract.ComputeFullRad(m_account).then((result) =>
	{
		handleResult(result, m_radToHarvest, 'radToHarvest', "string");
	});
}

// Events

// Conversion of Date to hh:mm:ss
var d_eventLog = document.getElementById('eventLog');
var d_scrollLog = document.getElementById('scrollLog');
/*
function date24() {
	let d = new Date();
	d = d.toTimeString();
	d = d.split(' ')[0];
	return d;
}	
*/

var eventArray = [];

function checkEventPast(__string, __block) {
	if(loggingThePast == false) {
		handleEvent(__string, __block);
	}
	else {
		let _eventObj = {string: __string, block: __block};
		eventArray.push(_eventObj);
	}
}

function logThePast() {	
	if(loggingThePast === true && eventArray.length > 0) {
		console.log("hello i'm logging the past");
		loggingThePast = false;
		eventArray.sort(function(a,b) {return (a.block - b.block);} );
		for(let i = 0; i < eventArray.length; i++) {
			handleEvent(eventArray[i].string, eventArray[i].block);
		}
	}
}

function handleEvent(__string, __block) {
	d_eventLog.innerHTML += "<br>[" + getTimeFromBlock(__block) + "] " + __string;
	d_scrollLog.scrollTop = d_scrollLog.scrollHeight;
}

function truncateEther(__eth) {
	let e = ethers.utils.formatEther(__eth);
	e = parseFloat(e).toFixed(6);
	e = parseFloat(e);
	return e;
}

// Event logging

// Are we logging past events?
var loggingThePast = false;

/*
var testValue = 1100000 + 20000;
var testValueSmaller = 1100000 + 100;
var eventObjTest3 = { string: "hello", block: testValue};
var eventObjTest4 = { string: "good morning", block: testValueSmaller};
eventArray.push(eventObjTest3);
eventArray.push(eventObjTest4);
eventArray.sort(function(a,b) {return (a.block - b.block);} );
console.log(eventArray[0].string);
// Testing array sorting
/*
var eventObjTest = { text: "This is a string", block: 123};
var eventObjTest2 = { text: "Also a string", block: 44};
eventArray.push(eventObjTest);
eventArray.push(eventObjTest2);
eventArray.sort(function(a,b) {return (a.block - b.block);} );
*/

function checkLeaderExists(_sender) {
	if (l_array.some(any => any.address === _sender)) {
		// already a leader, don't add the new one
	} 
	else {
		console.log("ok");
		let _newLeader = {address: _sender, rad: 0};
		l_array.push(_newLeader);
	}
}

function beginEventLogging() {
	
	console.log("event logging begins");
	/*
	contract.on(" ", (sender, eth, event) => {
		let _string = formatEthAdr(sender) + ethers.utils.formatEther(eth);
		handleEvent(_string);
	});
	*/

	//let eventNumber = 0;

	// event.blockNumber then converting it to timestamp through a local assumption of blocktime
	// isn't as reliable as event.getBlock().timestamp, but not sure how to get the later working

	contract.on("StartedGame", (launch, end, event) => {
		let _string = "The game has started! It will end " + convertTime(end) + ". May the best egg win.";	
		checkEventPast(_string, event.blockNumber);
	});

	contract.on("WithdrewBalance", (sender, eth, event) => {
		let _string = formatEthAdr(sender) + " has withdrawn " + truncateEther(eth) + " POA to his wallet." ;
		checkEventPast(_string, event.blockNumber);
	});

	contract.on("OpenedChest", (sender, eth, event) => {
		let _string = formatEthAdr(sender) + " opens their reward chest! They win " + truncateEther(eth) + " POA.";
		checkEventPast(_string, event.blockNumber);
	});

	contract.on("JoinedGame", (sender, tribe, land, name, event) => {
		//console.log("New player: " + sender + " has joined tribe " + tribe.toString());
		let _string = formatEthAdr(sender) + ", of the " + switchTribeName(parseInt(tribe.toString())) + " Tribe, joins the game and names his land " + name;
		checkEventPast(_string, event.blockNumber);
	});

	contract.on("HarvestedRad", (sender, rad, event) => {
		//console.log(sender + " harvested " + rad.toString() + " rads");
		let _string = formatEthAdr(sender) + " harvested " + rad.toString() + " rads.";
		checkEventPast(_string, event.blockNumber);
		checkLeaderExists(sender);
	});

	contract.on("ClaimedTribeRad", (sender, rad, tribe, event) => { // add tribe on next contract
		//console.log(sender + " claimed " + rad.toString() + " rads from their Tribe chest.");
		let _string = formatEthAdr(sender) + " of the " + switchTribeName(parseInt(tribe.toString())) + " Tribe claimed " + rad.toString() + " rads from their Tribe chest.";
		checkEventPast(_string, event.blockNumber);
		checkLeaderExists(sender);
	});

	contract.on("ChangedTribe", (sender, tribe, event) => {
		//console.log(sender + " renounces their old ways and joins the " + switchTribeName(tribe.toString()));
		let _string = formatEthAdr(sender) + " renounces their old ways and joins the " + switchTribeName(parseInt(tribe.toString())) + ".";
		checkEventPast(_string, event.blockNumber);
	});

	// change "eth" to "cost" for contract v9
	contract.on("FoundAnomaly", (sender, eth, rad, land, stat0, stat1, stat2, stat3, event) => {
		let _string = formatEthAdr(sender) + " finds an Anomaly using ";

		// check if anomaly is rad or poa
		if(rad == 0) {
			_string += truncateEther(eth) + " POA. "; 
		} 
		else {
			_string += eth.toString() + " rads. ";
		}

		// check if target is land or prod
		if(land == true) {
			_string += "Land ";
		}
		else {
			_string += "Tier ";
		}
		
		// add stats then send string
		_string += "addIdLater weight is changed to " + stat0.toString() + "/" + stat1.toString() + "/" + stat2.toString() + "/" + stat3.toString() + ".";
		checkEventPast(_string, event.blockNumber);
	});

	contract.on("UnlockedTier", (sender, tier, event) => {
		let _string = formatEthAdr(sender) + " unlocks tier " + tier.toString() + ".";
		checkEventPast(_string, event.blockNumber);
	});

	contract.on("HatchedShroom", (sender, rad, tier, shroom, eggoa, event) => {
		let _string = formatEthAdr(sender) + " hatches " + shroom.toString() + " shrooms with " + rad.toString() + " rads into " + eggoa.toString() + " eggoas of tier " + tier.toString() + ".";
		checkEventPast(_string, event.blockNumber);
	});

	contract.on("CollectedShroom", (sender, name, shroom, event) => {
        console.log("collected shroom event has been logged");
		//let _string = formatEthAdr(sender) + ", lord of land " + name + ", collected " + shroom.toString() + " shrooms.";
		//checkEventPast(_string, event.blockNumber);
	});

	contract.on("TookOverLand", (sender, name, event) => {
		let _string = formatEthAdr(sender) + " snatches land " + name + " (previously abandoned).";
		checkEventPast(_string, event.blockNumber);
	});

	// add land as 3rd argument in contract v9
	contract.on("WonLandFight", (sender, lord, name, powerSender, powerLord, result, shroom, eggoa, event) => {
		let _powerSender = powerSender.toString();
		let _powerLord = powerLord.toString();
		let _winChance = parseFloat(_powerSender) / (parseFloat(_powerSender) + parseFloat(_powerLord));
		_winChance = parseFloat(_winChance * 100).toFixed(2);
		let _string = formatEthAdr(sender) + ", with a " + _winChance + "% chance to win, takes land " + name + " from " + formatEthAdr(lord) + "! " + formatEthAdr(lord) + " loses " + eggoa.toString() + " Eggoas.";
		checkEventPast(_string, event.blockNumber);
	});
	
	// add land as 3rd argument in contract v9
	contract.on("LostLandFight", (sender, lord, name, powerSender, powerLord, result, eggoa, event) => {
        console.log("here's the lost land fight event");
		let _powerSender = powerSender.toString();
		let _powerLord = powerLord.toString();
		let _winChance = parseFloat(_powerSender) / (parseFloat(_powerSender) + parseFloat(_powerLord));
		_winChance = parseFloat(_winChance * 100).toFixed(2);
		let _string = formatEthAdr(lord) + " defends his land " + name + " against " + formatEthAdr(sender) + " had a " + _winChance + "% chance to win, but loses " + eggoa.toString() + " Eggoas. also " + result.toString();
		checkEventPast(_string, event.blockNumber);
	});

	contract.on("UpgradedEggoa", (sender, rad, tier, stat0, stat1, stat2, stat3, event) => {
		let _string = formatEthAdr(sender) + " uses " + rad.toString() + " rads to upgrade his tier " + tier.toString() + " Eggoas. Bonus stats: " + stat0.toString() + "/" + stat1.toString() + "/" + stat2.toString() + "/" + stat3.toString() + ".";
		checkEventPast(_string, event.blockNumber);
	});

	contract.on("RaisedEggoaPlantamid", (sender, tier, eggoa, plantamid, event) => {
		let _string = formatEthAdr(sender) + " sacrifices " + eggoa.toString() + " Eggoas of tier " + tier.toString() + " to raise his Plantamid to floor " + plantamid.toString() + ".";
		checkEventPast(_string, event.blockNumber);
	});

    contract.on("RaisedDaiPlantamid", (sender, eth, upgrade, plantamid, event) => {
		let _string = formatEthAdr(sender) + " spends " + truncateEther(eth) + " POA to raise his Plantamid by " + upgrade.toString() + " floor(s), reaching floor " + plantamid.toString() + ".";
		checkEventPast(_string, event.blockNumber);
	});

}

//var events;


// this sets the event logging from the start block, and triggers it instantly
// need to set dates based on block time!
var	loggingThePast = true;

function getPastEvents() {

	filter = {
		address: contractAddress,
		fromBlock: f_fromBlock,
		toBlock: "latest"
	};

	
	//signer.resetEventsBlock(f_fromBlock);

	if(signer == 0) {
		provider.resetEventsBlock(f_fromBlock);
	}
	else {
		provider = new ethers.providers.Web3Provider(web3.currentProvider);
		provider.resetEventsBlock(f_fromBlock);
		signer = provider.getSigner();
		contract = new ethers.Contract(contractAddress, abi, signer);
	}
	
	beginEventLogging();
	
	console.log("starting to log past events...");

	/*let iface = new ethers.utils.Interface(abi);

	provider.getLogs(filter).then((logs) => {
		console.log(logs);
		events = logs.map((log) => iface.parseLog(log));
		console.log(events);
		for(let e = 0; e < logs.length; e++) {
			if(logs[e].topics == "0xf145761ccef32f84b8528f66139cc490a4c4723a07b1b101ae9d33cad484adef") {
				console.log("we got a hit, captain");
			}
		}	
	});
	/*
	contract.on(filter, (launch, end, event) => {
		let _string = "The game has started! It will end " + convertTime(end) + ". May the best egg win.";
		handleEvent(_string);
	});
	/*filter = contract.filters.JoinedGame();
	contract.queryFilter(filter, f_fromBlock, f_toBlock, (result) => {
		console.log(result);
	});
	*/
}


// WRITE ETHERS

// (TODO - MOST FUNCTIONS) call appropriate refresh function to show updated data


const startGame = async() => {
	try {
		console.log("about to send transaction");
		const startTheGame = await contract.StartGame({
		  value: ethers.utils.parseEther("1")
		})

		console.log("this worked");
	  } catch (error) {
		console.log("Error: ", error); //fires as the contract reverted the payment
	  }
}

// Attack Land h_selectedLand using Eggoas of tier h_attackLandTier
let h_attackLandTier = 1;

function changeAttackLandTier() {
	let __tier = document.getElementById('attackLandTierSelector').value;
	checkBoundariesWithCb(__tier, 'attackLandTierSelector', 1, m_tier[0], changeAttackLandTierCallback);
}

function changeAttackLandTierCallback(__tier) {
	h_attackLandTier = __tier;
	// check player power, and update html
	let _power = m_nest[h_attackLandTier].stat0 * t_land[h_selectedLand].stat0 
	+ m_nest[h_attackLandTier].stat1 * t_land[h_selectedLand].stat1 
	+ m_nest[h_attackLandTier].stat2 * t_land[h_selectedLand].stat2 
	+ m_nest[h_attackLandTier].stat3 * t_land[h_selectedLand].stat3;
	_power = _power * m_nest[h_attackLandTier].amount * (parseInt(m_daiPlantamid) + parseInt(m_eggoaPlantamid) + parseInt(1));
	_power = parseInt(_power / h_landWeight);
	document.getElementById('attackPower').innerHTML = _power;

	// compute chance to win, update html
	let _winRate = 100;
	if(typeof t_land[h_selectedLand].power !== 'undefined') {
		_winRate = (parseInt(_power) * 100) / (parseInt(_power) + parseInt(t_land[h_selectedLand].power));
		_winRate = parseFloat(_winRate).toFixed(2);
	} 
	document.getElementById('winRate').innerHTML = _winRate;
}

/*
// multiply each stat by tier and land weight 
            for(uint256 i = 0; i < BASE_STAT; i++){
                _power = _power.add(eggoaNest[__fighter][__fighterTier].stat[i].mul(__fighterTier).mul(land[__land].stat[i]));
            }
            
            // mutiply by amount of eggoa, then plantamid
            _power = _power.mul(eggoaNest[__fighter][__fighterTier].amount);
            _power = _power.mul(daiPlantamid[__fighter].add(eggoaPlantamid[__fighter]).add(1));
            
            // divide by land weight
            _power = _power.div(__landWeight);
*/

function checkAttackTimerThenAttack(__tier) {

}

const attackLand = async() => {
	try {
		//console.log("about to send transaction");
		notificationSend('About to attack Land ' + h_selectedLand + ' with Tier ' + h_attackLandTier);
		const attackThisLand = await contract.AttackTerritory(h_selectedLand, h_attackLandTier, {
            gasLimit: 200000
        })
		notificationSuccess('Attacking Land ' + h_selectedLand + '!');
		//console.log("sent attackland tx successfully");
	} catch(error) {
		//console.log("Error: ", error);
		notificationError();
	}
}

// JOINGAME WORKS - SECOND ARGUMENT IS "OVERRIDE", FOR ETH VALUE AMONGST OTHER

function checkTribeIsSelected(__func) {
    if(m_tier[0] == 0) {
        h_selectedName = document.getElementById('newLandName').value;
        if(h_selectedName == "") {
            notificationCondition('Pick a name to ensure the legacy of your land.');
        } else if(h_selectedName.length > nameMaxChar) {
            notificationCondition('Too many characters! Maximum: 20');
        }
    }
	if(h_selectedTribe == 0) {
		notificationCondition('You must select a Tribe first (click on 1 of the 4 images)');
	}
	else {
		__func();
    }
}

/*
function changeLandName(__name) {
    h_selectedName = __name;
}
*/

const joinGame = async() => {
	try {
        //console.log("about to send transaction joingame");
        let _newTribe = switchTribeName(parseInt(h_selectedTribe));
		notificationSend('About to join game as a member of Tribe ' + _newTribe + ', naming your Land ' + h_selectedName);
		const joinTheGame = await contract.JoinGame(h_selectedTribe, h_selectedName, {
            value: ethers.utils.parseEther(a_joinCost[0]),
            gasLimit: 600000
		})
		notificationSuccess('Joining game!');
		//console.log("joined the game successfully");
	  } catch (error) {
		//console.log("Error: ", error); //fires as the contract reverted the payment
		notificationError();
	  }
}

const changeTribe = async() => {
	try {
		//console.log("about to send transaction changetribe");
		let _newTribe = switchTribeName(parseInt(h_selectedTribe));
		notificationSend('About to change to ' + _newTribe + ' Tribe');
		const changeMyTribe = await contract.ChangeTribe(h_selectedTribe, {
		  value: ethers.utils.parseEther(a_joinCost[0])
		})
		notificationSuccess('Changing Tribe!');
		//console.log("changed tribe successfully");
	  } catch (error) {
		//console.log("Error: ", error);
		notificationError();
	  }
}


// WORKS
const raiseGoamid = async() => {
	try {
		//console.log("about to send transaction raiseeggoaplantamid");
		notificationSend('About to raise the Goa Plantamid with a sacrifice of ' + n_sacrificeAmount[0] + ' Tier ' + h_selectedTier + ' Eggoas');
		const raiseMyGoamid = await contract.RaiseEggoaPlantamid(h_selectedTier)
		notificationSuccess('Raising the Goa Plantamid!');
		//console.log("raised the plantamid successfully");
	} catch (error) {
		//console.log("Error: ", error); 
		notificationError();
	}
}

// WORKS
const raiseDaimid = async() => {
	try {
		//console.log("about to send transaction raisedaiplantamid");
		notificationSend('About to raise POA Plantamid by ' + h_selectedFloor + ' floor(s) using ' + n_floorDaiCost[0] + " POA");
		const raiseMyGoamid = await contract.RaiseDaiPlantamid(h_selectedFloor, {
			value: ethers.utils.parseEther(n_floorDaiCost[0])
		})
		notificationSuccess('Raising the POA Plantamid!');
		//console.log("raised the plantamid successfully");
	} catch (error) {
		//console.log("Error: ", error); 
		notificationError();
	}
}


// Hatch Shrooms using h_hatchShroomMult into Eggoas of h_hatchShroomTier
// METAMASK FAILS IF h_hatchShroomRad > m_rad
let h_hatchShroomRad = 0;
let h_hatchShroomMult = 1;
let h_hatchShroomTier = 1;

function changeShroomMult(__mult) {
	h_hatchShroomMult = __mult;
	h_hatchShroomRad = getShroomCost();
	computeShroomEggoa();
}

function changeShroomTier(__tier) {
	h_hatchShroomTier = __tier;
	h_hatchShroomRad = getShroomCost();
	computeShroomEggoa();
}

function getShroomCost() {
	let _cost = MULT_COST ** (parseInt(h_hatchShroomMult) + parseInt(h_hatchShroomTier));
	document.getElementById('shroomCost').innerHTML = _cost;
	return _cost;
}

function checkShroomCostThenHatch() {
	if(h_hatchShroomRad > parseInt(m_rad)) {
		notificationCondition('Not enough RADs for selected tier/multiplier');
	}
	else {
		hatchShrooms();
	}
}

// check how many eggoas we get for given input
function computeShroomEggoa() {
	m_shroomEggoa = parseInt(m_shroom) * parseInt(h_hatchShroomMult);
	document.getElementById('shroomEggoa').innerHTML = m_shroomEggoa;
}

const hatchShrooms = async() => {
	try {
		//console.log("about to try to hatch shrooms");
		notificationSend('About to hatch Shrooms into tier ' + h_hatchShroomTier + ' Eggoas, using ' + h_hatchShroomRad + ' RADs');
		const hatchMyShrooms = await contract.HatchShroom(h_hatchShroomTier, h_hatchShroomMult)
		//console.log("hatched shrooms !");
		notificationSuccess('Hatching Shrooms!');
	} catch (error) {
		//console.log("Error: couldn't hatch shrooms due to ", error);
		notificationError();
	}
} 

// Harvest Rads - WORKS
const harvestRads = async() => {
	try {
		//console.log("about to try to harvest rads");
		notificationSend('About to harvest RADs...');
		const harvestMyRads = await contract.HarvestRad()
		//console.log("harvested rads !");
		notificationSuccess('Harvesting RADs!');
	} catch (error) {
		//console.log("Error: couldn't harvest due to ", error);
		notificationError();
	}
} 

// Collect Shrooms - WORKS - but need contract v7
// (TODO) Add condition for button to appear: h_selectedLand must = player owned lands
const collectShrooms = async() => {
	try {
		//console.log("about to collect shrooms");
		notificationSend('About to collect Shrooms from land ' + h_selectedLand);
		const collectMyShrooms = await contract.CollectShroom(h_selectedLand)
		//console.log("collected shrooms !");
		notificationSuccess('Collecting Shrooms!');
	} catch (error) {
		//console.log("Error: couldn't collect ", error);
		notificationError();
	}
} 

// UnlockTier - WORKS
// (TODO) run ComputeUnlockCost and disable/enable action based on m_rad evaluation
const unlockNextTier = async() => {
	try {
		let _tier = parseInt(m_tier[0]) + parseInt(1);
		//console.log("about to unlock tier");
		notificationSend('About to unlock tier ' + _tier);
		const unlockMyNextTier = await contract.UnlockTier()
		//console.log("unlocked tier!");
		notificationSuccess('Unlocking tier ' + _tier);
	} catch (error) {
		//console.log("Error: couldn't unlock ", error);
		notificationError();
	}
}

// WithdrawBalance - TEST
const withdrawDai = async() => {
	try {
		//console.log("withdrawing all the internet money...");
		notificationSend('About to withdraw POA...');
		const withdrawMyBalance= await contract.WithdrawBalance()
		//console.log("you are now a rich man!");
		notificationSuccess('POA incoming to your wallet!');
	} catch (error) {
		//console.log("Error: stole all your money ", error);
		notificationError();
	}
}

// UpgradeEggoa - TEST
// (TODO) let player pick upgradeStat. total should be 4
// WORKS

function checkUpgradeCostThenUpgrade() {
	if(parseInt(m_upgradeCost) > parseInt(m_rad)) {
		notificationCondition("You don't have enough RADs for this amount of upgrade!");
	}
	else {
		upgradeGoa();
	}
}

const upgradeGoa = async() => {
	try {
		//console.log("upgrading eggoas...");
		notificationSend('Upgrading tier' + h_upgradeTier + ' Eggoas: +' + h_upgradeWeight[0] + '/' + h_upgradeWeight[1] + '/' + h_upgradeWeight[2] + '/' + h_upgradeWeight[3]);
		const upgradeMyEggoa = await contract.UpgradeEggoa(h_upgradeTier, h_upgradeWeight[0], h_upgradeWeight[1], h_upgradeWeight[2], h_upgradeWeight[3])
		//console.log("success!");
		notificationSuccess('Eggoas upgraded!');
	} catch (error) {
		//console.log("Error: couldn't collect ", error);
		notificationError();
	}
} 

// OpenChest - TEST

const openRewardChest = async () => {
	try {
		//console.log("opening dai chest...");
		notificationSend('Opening POA chest...');
		const openMyChest = await contract.OpenChest()
		//console.log("success!");
		notificationSuccess('Your wallet grows fatter!');
	} catch (error) {
		//console.log("Error: couldn't open ", error);
		notificationError();
	}
}

// ClaimTribeRad - WORKS

const claimTribeRads = async () => {
	try {
		//console.log("claiming tribe rad...");
		notificationSend('Claiming tribe rad...');
		const claimMyTribeRads = await contract.ClaimTribeRad()
		//console.log("success!");
		notificationSuccess('Getting RADS from tribe!');
	} catch (error) {
		//console.log("Error: couldn't get tribe rads ", error);
		notificationError();
	}
}


// FIND DAI ANOMALY

// make sure all parameters are valid
function checkAnomalyParams(_func) {

    // get sum of weight array
    let _weightSum = h_anomalyWeight.reduce((a, b) => a + b, 0);

    // check each condition in turn
    if(h_anomalyString == "") {
        notificationCondition("First, choose whether your Anomaly will affect Land or Prod");
    } else if(h_anomalyTargetId == 0) {
        notificationCondition("Pick the ID of your targeted " + h_anomalyString);
    } else if(_weightSum == 0) {
        notificationCondition("Choose a non-zero number for at least one of your weights");
    } 
    // if nothing is wrong, call proper function
    else {
        _func();
    }
}

const findDaiAnomaly = async() => {
	try {
		//console.log("about to send transaction findDAIanomaly");
		notificationSend('Searching for POA Anomaly to change ' + h_anomalyString + ' ' + h_anomalyTargetId + ' to weights: ' + h_anomalyWeight[0] + '/' + h_anomalyWeight[1] + '/' + h_anomalyWeight[2] + '/' + h_anomalyWeight[3]);
		const findMyDaiAnomaly = await contract.FindAnomaly(0, h_anomalyLand, h_anomalyTargetId, h_anomalyWeight[0], h_anomalyWeight[1], h_anomalyWeight[2], h_anomalyWeight[3], {
			value: ethers.utils.parseEther(a_daiAuctionCostNow[0])
		})
		//console.log("found anomaly successfully");
		notificationSuccess('Finding POA Anomaly!');
	} catch (error) {
		//console.log("Error: ", error);
		notificationError();
	}
}

// FIND RAD ANOMALY - WORKS
const findRadAnomaly = async() => {
	try {
		//console.log("about to send transaction findRADanomaly");
		let _radToSend = (parseInt(a_radAuctionCostNow) + parseInt(1));
		notificationSend('Searching for RAD Anomaly to change ' + h_anomalyString + ' ' + h_anomalyTargetId + ' to weights: ' + h_anomalyWeight[0] + '/' + h_anomalyWeight[1] + '/' + h_anomalyWeight[2] + '/' + h_anomalyWeight[3]);
		const findMyRadAnomaly = await contract.FindAnomaly(_radToSend, h_anomalyLand, h_anomalyTargetId, h_anomalyWeight[0], h_anomalyWeight[1], h_anomalyWeight[2], h_anomalyWeight[3], {
			value: 0,
			gasLimit: 200000
		})
		//console.log("found anomaly successfully");
		notificationSuccess('Finding RAD Anomaly!');
	} catch (error) {
		//console.log("Error: ", error);
		notificationError();
	}
}

// Notifications

function notificationCondition(__text) {
	SimpleNotification.message({text: __text},			
	{position: 'bottom-left', removeAllOnDisplay: 'true'});
}


function notificationSend(__text) {
	SimpleNotification.warning({text: __text},			
	{position: 'bottom-left', removeAllOnDisplay: 'true'});
}

function notificationSuccess(__text) {
	SimpleNotification.success({text: __text},			
	{position: 'bottom-left', removeAllOnDisplay: 'true'});
}

// Generic error
function notificationError() {
	SimpleNotification.error({text: "ERROR: Couldn't send transaction."},
	{position: 'bottom-left', removeAllOnDisplay: 'true'});
}

/*
SimpleNotification._options = {
	position: 'bottom-right'
};
*/
function simpleTest() {
	SimpleNotification.warning({
		//title: 'Title', // The title of the notification
		//image: 'url', // Optional image displayed inside the notification
		text: 'Content', // Content of the notification
		// Optional list of buttons to interact with the notification
		/*buttons: [{
			value: 'Confirm', // The text inside the button
			type: 'success', // The type of the button, same as for the notifications
			onClick: (notification) => {
				// The onClick function receive the notification from which the button has been clicked
				// You can call notification.remove(), notification.close() or notification.closeFadeout()
				// if you wish to remove the notification by clicking on  the buttons
			}
		}]*/
	}, {position: 'bottom-right'});
	setTimeout(function(){ SimpleNotification.success({text: 'We did it!'}, {position: 'bottom-right', removeAllOnDisplay: true}); }, 2000);
}

// OBSOLETE STUFF BELOW

/*
// find the first power of 4 we can use with input rads
function checkMultipleFour(__rad) {
	let _four = 4;
	while(_four <= __rad) {
		_four = _four * 4;
	}
	return _four / 4;
}
*/