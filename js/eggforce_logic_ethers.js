// INITIALIZE WEB3

let contract;
let contractAddress = "0xc302B696CcE10880BE65717beDd440e353E885a6"; // v006
let provider;
let signer = 0;

var m_account = "0xABF3E252006D805Cce3C7219A929B83465F2a46e"; // should be "", setup for local tests
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

			let addressPromise = signer.getAddress().then(function(result){
				m_account = result;
				document.getElementById('account').innerHTML = formatEthAdr(m_account);
				console.log(m_account);
				startLoop();
			});
			
			// provider: read-only access
			// signer: read and write
			contract = new ethers.Contract(contractAddress, abi, signer);
			
			beginEventLogging();			
        } catch (error) {
            // User denied account access...
			useReadOnlyProvider();
			beginEventLogging();
        }
    }
    // Non-dapp browsers...
    else {
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
		useReadOnlyProvider();
		beginEventLogging();
    }
});

function useReadOnlyProvider() {
	provider = new ethers.providers.JsonRpcProvider("https://core.poa.network");		
	contract = new ethers.Contract(contractAddress, abi, provider);
	startLoop();
}

// VARIABLES

var a_daiAuctionCost = [0];
var a_daiAuctionTimer = [0];
var a_end = [0];
var a_globalRad = [0];
var a_joinCost = [0];
var a_launch = [0];
var a_plantamidDaiCost = [0];
var a_radAuctionCost = [0];
var a_radAuctionTimer = [0];
var a_tribeRad = [0];

var h_selectedLand = 1; // base land selected for land update
var h_selectedTier = 1; // base tier for Eggoa Plantamid
var h_selectedFloor = 1; // base rise for Dai Plantamid

var m_balance = [0];
var m_collectedTribeRad = [0];
var m_daiPlantamid = [0];
var m_earnedRad = [0];
var m_eggoaPlantamid = [0];
var m_lastRad = [0];
var m_lastShroom = [0];
var m_openedChest = false;
var m_rad = [0];
var m_radToHarvest = [0];
var m_shroom = [0];
var m_tier = [0];
var m_tribe = [0];
var m_tribeChange = [0];
var m_unlockTierRadCost = [0];

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
/*
for(let t = 1; t < 65; t++) {
	t_land[t] = landobj;
}

var doc_balance = document.getElementById('balance');
var doc_daiAuctionCost = document.getElementById('daiAuctionCost');
var doc_daiAuctionTimer = document.getElementById('daiAuctionTimer');
var doc_daiPlantamid = document.getElementById('daiPlantamid');
var doc_collectedTribeRad = document.getElementById('collectedTribeRad');
var doc_otherCollectedTribeRad = document.getElementById('otherCollectedTribeRad');

var doc_landLast = document.getElementById('landLast');
var doc_landLord = document.getElementById('landLord');
var doc_landPower = document.getElementById('landPower');
var doc_landLevel = document.getElementById('landLevel');
var doc_landTribe = document.getElementById('landTribe');
var doc_landSelected = document.getElementById('landSelected');
*/

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
function initializeBlockchainData(){
	refreshData();
	updateJoinCost();
	updateLaunchTimestamp();
	updateEndTimestamp();
	updateTerritory(1);
	getSacrificeAmount(1);
	getFloorDaiCost(1);
}

//Fast loop every second
function controlLoop1(){
	updateLaunchTimer();
	updateEndTimer();
	setTimeout(controlLoop1, 1000);
}

//Main loop on 4 seconds
function controlLoop4() {
	if(signer != 0) {
		updateAccount();
	}

    setTimeout(controlLoop4, 4000);
}

//Large update loop every minute
function controlLoop60(){
	refreshData();
    setTimeout(controlLoop60, 60000);
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
	updateGlobalRad();
	updateDaiPlantamid(m_account);
	updateEggoaPlantamid(m_account);
	updateEarnedRad(m_account);
	updateBalance(m_account);
	updateCollectedTribeRad(m_account);
	updateDaiAuctionCost();
	updateDaiAuctionTimer();
	updateRadAuctionCost();
	updateRadAuctionTimer();
	updateUpgradeCost();
	updateRadToHarvest();
}

//** UTILITIES **//

//Truncates ETH address to first 8 numbers
function formatEthAdr(__adr){
	return __adr.substring(0, 10);
}

// Convert timestamp in seconds into readable date
// hh:mm:ss if < |24h|, x days if >= |24h|
function convertTime(__timestamp){

	let _currentTimestamp = (new Date()).getTime() / 1000; // from ms to s
	let _time = __timestamp - _currentTimestamp;

	let _hours = Math.floor(_time / 3600);
	let _days = parseFloat(_hours / 24).toFixed(0);
	let _minutes = Math.floor((_time % 3600) / 60);
	let _seconds = parseFloat((_time % 3600) % 60).toFixed(0);

	let _positive = true;

	let _returnString = "";

	if(_hours >= 24 || _hours <= -24){
		if(_hours <= -24){
			_positive = false;
			_days = -_days;
		}

		if(_days == 1){
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
			
	} else if(_hours >= 0) {
		if(_hours < 0) {
			_positive = false;
			_hours = -_hours;

		}

		if(_hours < 10) { _hours = "0" + _hours }
		if(_minutes < 10) { _minutes = "0" + _minutes }
		if(_seconds < 10) { _seconds = "0" + _seconds }

		_returnString =  _hours + ":" + _minutes + ":" + _seconds;
		/*if(_positive == false){
			_returnString = _returnString + " ago";
		}*/

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

function updateLaunchTimer() {
	document.getElementById('launch').innerHTML = convertTime(a_launch);
}

function updateEndTimer() {
	document.getElementById('end').innerHTML = convertTime(a_end);
}

// change land button to "attack" or "collect" depending if player is lord of h_selectedland
let d_landButton = document.getElementById('landButton');

function updateLandButton() {
	if(t_land[h_selectedLand].lord == m_account) {
		d_landButton.innerHTML = '<button onClick="collectShrooms()">Collect Shrooms</button>';
	} else if (t_land[h_selectedLand].tribe == m_tribe) {
		d_landButton.innerHTML = 'Land Owned by a Tribe Member';
	} else {
		d_landButton.innerHTML = '<button onClick="attackLand()">Attack Land</button>';
	}
}

// html update for upgrade costs
var d_upgradeCost = [];
d_upgradeCost[1] = document.getElementById('upgradeCost1');
d_upgradeCost[2] = document.getElementById('upgradeCost2');
d_upgradeCost[3] = document.getElementById('upgradeCost3');
d_upgradeCost[4] = document.getElementById('upgradeCost4');
d_upgradeCost[5] = document.getElementById('upgradeCost5');
d_upgradeCost[6] = document.getElementById('upgradeCost6');
d_upgradeCost[7] = document.getElementById('upgradeCost7');
d_upgradeCost[8] = document.getElementById('upgradeCost8');

function updateHTMLupgradeCost() {
	for(i = 1; i <= m_tier; i++) {
		d_upgradeCost[i].innerHTML = s_upgradeRadCost[i];
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
		console.log(m_account);
		refreshData();
	});
}

function getContractOwner() {
	contract.owner().then((result) => 
			{
				let _owner = result;
				console.log(_owner);
				document.getElementById("contractOwner").innerHTML = formatEthAdr(_owner);
			});
}

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

function checkBoundaries(__number, __html, __min, __max) {
	if(__number > __max) {
		__number = __max;
	} else if (__number < __min) {
		__number = __min;
	}
	document.getElementById(__html).value = __number;
	return __number;
}

function updateTerritory(__id) {

	/*
	// make sure __id is within boundaries
	if(__id > 64) {
		__id = 64;
		document.getElementById('landSelector').value = __id;
	} else if(__id < 1) {
		__id = 1;
		document.getElementById('landSelector').value = __id;
	}
	*/
	__id = checkBoundaries(__id, 'landSelector', 1, 64);

	// initialize t_land if previously undefined
	if(t_land[__id] == null){
		t_land[__id] = {};
	}

	// display message while waiting for promise result 
	document.getElementById('w3q_land').innerHTML = "Waiting for blockchain...";

	// begin the spam
	contract.land(__id).then((result) =>
	{
		contract.GetLandStat(__id).then((result2) =>
		{
			contract.tribe(result.lord).then((result3) =>
			{
				let _landWeight = parseInt(result2[0]) + parseInt(result2[1]) + parseInt(result2[2]) + parseInt(result2[3]);
				console.log(_landWeight);
				if(_landWeight == 0) { _landWeight = 1};
				contract.ComputeForce(__id, _landWeight, result.lord, result.eggoa).then((result4) =>
				{
					t_land[__id].lord = result.lord;
					t_land[__id].lastLand = result.lastLand.toString();
					t_land[__id].level = result.level.toString();
					t_land[__id].tribe = result3.toString();
					t_land[__id].stat0 = result2[0].toString();
					t_land[__id].stat1 = result2[1].toString();
					t_land[__id].stat2 = result2[2].toString();
					t_land[__id].stat3 = result2[3].toString();
					t_land[__id].power = result4.toString();

					// update all the HTML bits
					updateLand(__id);

					// update status message
					document.getElementById('w3q_land').innerHTML = "Up to date.";

					// update possible action
					updateLandButton();
				});
			});
		});
	});
}

// Update HTML stats of a specific land
function updateLand(__id){
	h_selectedLand = __id;

	//this should be refactored into switching between Discover and Attack states if land is/isn't init
	if(t_land[__id] == null){
		t_land[__id] = { lord: "none", level: 0, tribe: 0, power: 0, lastLand: 0, stat0: 0, stat1: 0, stat2: 0, stat3: 0};
	}
	//document.getElementById('landSelected').innerHTML = __id;
	document.getElementById('landLast').innerHTML = t_land[__id].lastLand;
	document.getElementById('landLord').innerHTML = formatEthAdr(t_land[__id].lord);
	document.getElementById('landPower').innerHTML = t_land[__id].power;
	document.getElementById('landLevel').innerHTML = t_land[__id].level;
	document.getElementById('landTribe').innerHTML = t_land[__id].tribe;
	document.getElementById('landStat').innerHTML = t_land[__id].stat0 + "/" + t_land[__id].stat1 + "/" + t_land[__id].stat2 + "/" + t_land[__id].stat3;
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
function updateNestText(__tier){
		doc_m_nest[__tier].innerHTML = 
		"<h6>Amount: " + m_nest[__tier].amount + "</h6>" +
		"<h6>Level: " + m_nest[__tier].level + "</h6>" +
		"<h6>Time until attack: " + m_nest[__tier].attackNext + "</h6>" +
		"<h6>Lord of Land: " + m_nest[__tier].ownedLand + "</h6>" +
		"<h6>Stats: " + m_nest[__tier].stat0 + "/" + m_nest[__tier].stat1 + "/" + m_nest[__tier].stat2 + "/" + m_nest[__tier].stat3;
}

// Tier prod (all 4)
function updateTierProd(){
	for(let i = 0; i < 4; i++){
		contract.GetTierProd(i).then((result) =>
		{
			console.log(result.toString());
		});
	}
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
		document.getElementById(doc_).innerHTML = a_[0];
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

// Base cost for DAI auction
function updateDaiAuctionCost(){
	contract.daiAuctionCost().then((result) =>
	{
		handleResult(result, a_daiAuctionCost, 'daiAuctionCost', "dai");
	})
}

// Start time for DAI auction
function updateDaiAuctionTimer(){
	contract.daiAuctionTimer().then((result) =>
	{
		handleResult(result, a_daiAuctionTimer, 'daiAuctionTimer', "none");
	})
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
		handleResult(result, a_end, 0, "none");
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
		handleResult(result, m_lastRad, 'lastRad', "string");
	});
}

// Last time player collected shrooms
function updateLastShroom(__player){
	contract.lastShroom(__player).then((result) =>
	{
		handleResult(result, m_lastShroom, 'lastShroom', "string");
	});
}

// Launch timestamp - should only need one update
function updateLaunchTimestamp(){
	contract.launch().then((result) =>
	{
		handleResult(result, a_launch, 0, "none");
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
		handleResult(result, a_radAuctionCost, 'radAuctionCost', "string");
	})
}

// Start time for rad auction
function updateRadAuctionTimer(){
	contract.radAuctionTimer().then((result) =>
	{
		handleResult(result, a_radAuctionTimer, 'radAuctionTimer', "none");
	})
}

// Owned Shrooms for player (from land grabs)
function updateShroom(__player) {

	// if player has joined the game
	if(m_tier[0] > 0) {
		contract.ComputeShroom(__player).then((result) =>
		{
			handleResult(result, m_shroom, 'shroom', "string");
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
		handleResult(result, m_tribe, 'tribe', "string");
	});
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
		handleResult(result, a_tribeRad, 'tribeRad', "string");
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
	let __tier = parseInt(m_tier) + parseInt(1);
	contract.ComputeUnlockCost(__tier).then((result) =>
	{
		handleResult(result, m_unlockTierRadCost, 'unlockTierRadCost', "string");
	});
}

// Get Rad cost for next upgrade of given Eggoa
function updateUpgradeCost() {
	for(let i = 1; i <= m_tier; i++) {
		contract.ComputeUpgradeCost(m_nest[i].level).then((result) =>
		{
			s_upgradeRadCost[i] = result.toString();
		});
	}
	updateHTMLupgradeCost();
}

// Get Rads player can harvest
function updateRadToHarvest() {
	contract.ComputeFullRad(m_account).then((result) =>
	{
		handleResult(result, m_radToHarvest, 'radToHarvest', "string");
	});
}

// Events

function beginEventLogging() {
	
	console.log("event logging begins");
	
	contract.on("JoinedGame", (sender, tribe, event) => {
		console.log("New player: " + sender + " has joined tribe " + tribe.toString());
	});
}



// WRITE ETHERS

/*
function startGame() {
				// Sending a tx?? 
				// Error: unknown transaction override _hex

				//weiToSend = weiToSend.toString();
				//console.log(weiToSend);
				contract.StartGame(weiToSend).then((result) =>
				{
					console.log(result);
				});
}
*/
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

function changeAttackLandTier(__tier) {
	h_attackLandTier = __tier;
}

const attackLand = async() => {
	try {
		console.log("about to send transaction");
		const attackThisLand = await contract.AttackTerritory(h_selectedLand, h_attackLandTier)
		console.log("sent attackland tx successfully");
	} catch(error) {
		console.log("Error: ", error);
	}
}

// JOINGAME WORKS - SECOND ARGUMENT IS "OVERRIDE", FOR ETH VALUE AMONGST OTHER
let m_tribeChoice = 1;

const joinGame = async() => {
	try {
		console.log("about to send transaction joingame");
		const joinTheGame = await contract.JoinGame(m_tribeChoice, {
		  value: ethers.utils.parseEther("0.01")
		})

		console.log("joined the game successfully");
	  } catch (error) {
		console.log("Error: ", error); //fires as the contract reverted the payment
	  }
}


// WORKS
const raiseGoamid = async() => {
	try {
		console.log("about to send transaction raiseeggoaplantamid");
		const raiseMyGoamid = await contract.RaiseEggoaPlantamid(h_selectedTier)

		console.log("raised the plantamid successfully");
	} catch (error) {
		console.log("Error: ", error); //fires as the contract reverted the payment
	}
}

// WORKS
const raiseDaimid = async() => {
	try {
		console.log("about to send transaction raisedaiplantamid");
		const raiseMyGoamid = await contract.RaiseDaiPlantamid(h_selectedFloor, {
			value: ethers.utils.parseEther(n_floorDaiCost[0])
		})

		console.log("raised the plantamid successfully");
	} catch (error) {
		console.log("Error: ", error); //fires as the contract reverted the payment
	}
}


// Hatch Shrooms using h_hatchShroomRad into Eggoas of h_hatchShroomTier
// METAMASK FAILS IF h_hatchShroomRad > m_rad
let h_hatchShroomRad = 0;

function changeShroomRad(__rad) {
	h_hatchShroomRad = __rad;
}

let h_hatchShroomTier = 1;

function changeShroomTier(__tier) {
	h_hatchShroomTier = __tier;
}

const hatchShrooms = async() => {
	try {
		console.log("about to try to hatch shrooms");
		const hatchMyShrooms = await contract.HatchShroom(h_hatchShroomTier, h_hatchShroomRad)
		console.log("hatched shrooms !");
	} catch (error) {
		console.log("Error: couldn't hatch shrooms due to ", error);
	}
} 

// Harvest Rads - WORKS
const harvestRads = async() => {
	try {
		console.log("about to try to harvest rads");
		const harvestMyRads = await contract.HarvestRad()
		console.log("harvested rads !");
	} catch (error) {
		console.log("Error: couldn't harvest due to ", error);
	}
} 

// Collect Shrooms - WORKS - but need contract v7
// (TODO) Add condition for button to appear: h_selectedLand must = player owned lands
const collectShrooms = async() => {
	try {
		console.log("about to collect shrooms");
		const collectMyShrooms = await contract.CollectShroom(h_selectedLand)
		console.log("collected shrooms !");
	} catch (error) {
		console.log("Error: couldn't collect ", error);
	}
} 

// UnlockTier - WORKS
// (TODO) run ComputeUnlockCost and disable/enable action based on m_rad evaluation
const unlockNextTier = async() => {
	try {
		console.log("about to unlock tier");
		const unlockMyNextTier = await contract.UnlockTier()
		console.log("unlocked tier!");
	} catch (error) {
		console.log("Error: couldn't unlock ", error);
	}
}

// WithdrawBalance - TEST
const withdrawDai = async() => {
	try {
		console.log("withdrawing all the internet money...");
		const withdrawMyBalance= await contract.WithdrawBalance()
		console.log("you are now a rich man!");
	} catch (error) {
		console.log("Error: stole all your money ", error);
	}
}

// UpgradeEggoa - TEST
// (TODO) let player pick upgradeStat. total should be 4
// DOESNT WORK
let s_upgradeTier = 1;

let s_upgradeStat = [1, 1, 1, 1];

function selectTierThenUpgrade(__tier) {
	s_upgradeTier = __tier;
	upgradeGoa();
}

const upgradeGoa = async() => {
	try {
		console.log("upgrading eggoas...");
		const collectMyShrooms = await contract.UpgradeEggoa(s_upgradeTier, s_upgradeRadCost[s_upgradeTier], s_upgradeStat[0], s_upgradeStat[1], s_upgradeStat[2], s_upgradeStat[3])
		console.log("success!");
	} catch (error) {
		console.log("Error: couldn't collect ", error);
	}
} 

// OpenChest - TEST

const openRewardChest = async () => {
	try {
		console.log("opening dai chest...");
		const openMyChest = await contract.OpenChest()
		console.log("success!");
	} catch (error) {
		console.log("Error: couldn't open ", error);
	}
}

// ClaimTribeRad - WORKS

const claimTribeRads = async () => {
	try {
		console.log("claiming tribe rad...");
		const claimMyTribeRads = await contract.ClaimTribeRad()
		console.log("success!");
	} catch (error) {
		console.log("Error: couldn't get tribe rads ", error);
	}
}