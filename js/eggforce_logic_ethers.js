// INITIALIZE WEB3

let contract;
let contractAddress = "0x6Cf592D1687041147a20C6CC1504715864A52752"; // v008
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
var a_chest = [0];
var a_daiAuctionCost = [0];
var a_daiAuctionTimer = [0];
var a_daiAuctionCostNow = [0];
var a_end = [0];
var a_globalRad = [0];
var a_joinCost = [0];
var a_launch = [0];
var a_plantamidDaiCost = [0];
var a_radAuctionCost = [0];
var a_radAuctionTimer = [0];
var a_radAuctionCostNow = [0];
var a_tribeRad = [0];

var h_anomalyLand = true; // whether land or prod is targeted on anomaly buy
var h_anomalyTargetId = 0;
var h_anomalyWeight = [0, 0, 0, 0];

var h_landWeight = 0;

var h_selectedLand = 1; // base land selected for land update
var h_selectedTier = 1; // base tier for Eggoa Plantamid
var h_selectedFloor = 1; // base rise for Dai Plantamid

var h_selectedTribe = 0; // selected tribe to join game - or to change tribe

var h_upgradeTier = 1; // selected tier for Eggoa Upgrade
var h_upgradeWeight = [0, 0, 0, 0];

var m_balance = [0];
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
	updateDaimidTimer();
	updateGoamidTimer();
	updateLastRadTimer();
	updateLastShroomTimer();
	updateSelectedLandTimer(h_selectedLand);
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
	updateDaiPlantamid(m_account);
	updateEggoaPlantamid(m_account);
	updateEarnedRad(m_account);
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
}

//** UTILITIES **//

//Truncates ETH address to first 8 numbers
function formatEthAdr(__adr){
	return __adr.substring(0, 10);
}

// Convert timestamp in seconds into readable date
// hh:mm:ss if < |24h|, x days if >= |24h|
function convertTime(__timestamp){

	let _currentTimestamp = parseInt((new Date()).getTime() / 1000); // from ms to s
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

// Check available tribe rads

function updateTribeRadToClaim() {
	document.getElementById('tribeRadToClaim').innerHTML = parseInt(a_tribeRad) - parseInt(m_collectedTribeRad);	
} 

// Calculate DAI earnings for player, based on his proportion of earned rads
// Check if game is over and if player has opened chest too

function updatePlayerChest() {

	let d_playerChest = document.getElementById('playerChest');

	// avoid NaN. Even if inaccurate, this doesn't matter
	if(a_globalRad == 0) { a_globalRad = 1};

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
		d_playerChest.innerHTML = "You have won " + m_playerChest + " POA!<br><button onclick='openRewardChest()'>Open Chest</button>";
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
		d_joinOrChange.innerHTML = 'changing tribe';
		d_joinOrChangeButton.innerHTML = '<button onclick="changeTribe()">Change Tribe</button>'
	}
	else {
		d_joinOrChange.innerHTML = 'joining the game';
		d_joinOrChangeButton.innerHTML = '<button onclick="joinGame()">Join Game</button>'
	}
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
		document.getElementById('landLast').innerHTML = convertTime(t_land[__id].lastLand);
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
		d_landButton.innerHTML = '<button onClick="collectShrooms()">Collect Shrooms</button>';
	} else if (t_land[h_selectedLand].tribe == m_tribe) {
		d_landButton.innerHTML = 'Land Owned by a Tribe Member';
	} else {
		d_landButton.innerHTML = '<button onClick="attackLand()">Attack Land</button>';
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
		document.getElementById('anomalyTargetType').innerHTML = 'Land';
	}
	else if(__type == 'prod') {
		h_anomalyLand = false;
		document.getElementById('anomalyTargetType').innerHTML = 'Prod';
	}
}

function updateTargetId(__id) {

	if(h_anomalyLand == true) {
		__id = checkBoundaries(__id, 'anomalyTargetId', 1, 64);
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

function updateTerritory(__id) {

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
				h_landWeight = parseInt(result2[0]) + parseInt(result2[1]) + parseInt(result2[2]) + parseInt(result2[3]);
				//console.log(_landWeight);
				if(h_landWeight == 0) { h_landWeight = 1};
				contract.ComputeForce(__id, h_landWeight, result.lord, result.eggoa).then((result4) =>
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
	document.getElementById('landLast').innerHTML = convertTime(t_land[__id].lastLand);
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

function selectTribe(__tribe) {
	h_selectedTribe = __tribe;
	d_selectedTribe = document.getElementById('selectedTribe');
	switch(__tribe){
		case 1: d_selectedTribe.innerHTML = 'Crimson';
		break;
		case 2: d_selectedTribe.innerHTML = 'Blu';
		break;
		case 3: d_selectedTribe.innerHTML = 'Greg';
		break;
		case 4: d_selectedTribe.innerHTML = 'Lumi';
		break;
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
		"<h6>Amount: " + m_nest[__tier].amount + "</h6>" +
		"<h6>Level: " + m_nest[__tier].level + "</h6>" +
		"<h6>Time until attack: " + _timeUntilAttack + "</h6>" +
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
		let _html = a_[0];
		if(operation_ == "dai") {
			_html = parseFloat(a_[0]).toFixed(4);
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
	let _currentTimestamp = parseInt((new Date()).getTime() / 1000); // from ms to s
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
	let _currentTimestamp = parseInt((new Date()).getTime() / 1000); // from ms to s
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

function beginEventLogging() {
	
	console.log("event logging begins");
	
	contract.on("JoinedGame", (sender, tribe, event) => {
		console.log("New player: " + sender + " has joined tribe " + tribe.toString());
	});
}



// WRITE ETHERS

// (TODO - MOST FUNCTIONS) call appropriate refresh function to show updated data

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
	checkBoundaries(__tier, 'attackLandTierSelector', 1, m_tier[0]);
	h_attackLandTier = __tier;

	// check player power, then calculate his chance to win
	contract.ComputeForce(h_selectedLand, h_landWeight, m_account, h_attackLandTier).then((result) =>
	{
		handleResult(result, m_power, 'attackPower', "string");
		let _winRate = parseInt(m_power * 100 / (m_power + t_land[h_selectedLand].power));
		document.getElementById('winRate').innerHTML = _winRate;
	});
}

function checkAttackTimerThenAttack(__tier) {

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
		const joinTheGame = await contract.JoinGame(h_selectedTribe, {
		  value: ethers.utils.parseEther(a_joinCost[0])
		})

		console.log("joined the game successfully");
	  } catch (error) {
		console.log("Error: ", error); //fires as the contract reverted the payment
	  }
}

const changeTribe = async() => {
	try {
		console.log("about to send transaction changetribe");
		const changeMyTribe = await contract.ChangeTribe(h_selectedTribe, {
		  value: ethers.utils.parseEther(a_joinCost[0])
		})

		console.log("changed tribe successfully");
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
	let _finalRad = checkMultipleFour(__rad);
	h_hatchShroomRad = _finalRad;
	document.getElementById('shroomRad').innerHTML = _finalRad;
	computeShroomEggoa();
}

let h_hatchShroomTier = 1;

function changeShroomTier(__tier) {
	h_hatchShroomTier = __tier;
	computeShroomEggoa();
}

// check how many eggoas we get for given input
function computeShroomEggoa() {

	// calculate multiplier
	let _remainder = h_hatchShroomRad;
	let _power = 2;
	while(_remainder >= 4) {
		_remainder = _remainder / 4;
		_power++;
	}
	_power -= h_hatchShroomTier;

	// multiply m_shroom to get number of eggoas
	m_shroomEggoa = parseInt(m_shroom) * parseInt(_power);

	// update html
	document.getElementById('shroomEggoa').innerHTML = m_shroomEggoa;
}

// find the first power of 4 we can use with input rads
function checkMultipleFour(__rad) {
	let _four = 4;
	while(_four < __rad) {
		_four = _four * 4;
	}
	return _four / 4;
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
		updateRad(m_account); // probably replace this with event logging later
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
// WORKS

const upgradeGoa = async() => {
	try {
		console.log("upgrading eggoas...");
		const upgradeMyEggoa = await contract.UpgradeEggoa(h_upgradeTier, h_upgradeWeight[0], h_upgradeWeight[1], h_upgradeWeight[2], h_upgradeWeight[3])
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


// FIND DAI ANOMALY - WORKSish. deploy v8 and test
const findDaiAnomaly = async() => {
	try {
		console.log("about to send transaction findDAIanomaly");
		const findMyDaiAnomaly = await contract.FindAnomaly(0, h_anomalyLand, h_anomalyTargetId, h_anomalyWeight[0], h_anomalyWeight[1], h_anomalyWeight[2], h_anomalyWeight[3], {
			value: ethers.utils.parseEther(a_daiAuctionCostNow[0])
		})

		console.log("found anomaly successfully");
	} catch (error) {
		console.log("Error: ", error); //fires as the contract reverted the payment
	}
}

// FIND RAD ANOMALY - WORKS
const findRadAnomaly = async() => {
	try {
		console.log("about to send transaction findRADanomaly");
		const findMyRadAnomaly = await contract.FindAnomaly(a_radAuctionCostNow, h_anomalyLand, h_anomalyTargetId, h_anomalyWeight[0], h_anomalyWeight[1], h_anomalyWeight[2], h_anomalyWeight[3], {
			value: 0
		})

		console.log("found anomaly successfully");
	} catch (error) {
		console.log("Error: ", error); //fires as the contract reverted the payment
	}
}

//
