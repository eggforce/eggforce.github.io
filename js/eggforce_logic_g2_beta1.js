// INITIALIZE WEB3

let contract;
let contractAddress = "0x20f7ffaF5f38C799df9973aE45A0110AeD9712d2"; // G2 beta 1
let provider;
let signer = 0;
let filter;

var m_account = ""; // should be "", setup for local tests
//document.getElementById('account').innerHTML = formatEthAdr(m_account);

window.addEventListener('load', async () => {
    // Modern dapp browsers...
    if (window.ethereum) {
        try {
            // Request account access if needed
            await ethereum.enable();

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
			
        } catch (error) {
            // User denied account access...
			useReadOnlyProvider();
        }
    }
    // Non-dapp browsers...
    else {
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
		useReadOnlyProvider();
    }
});

function useReadOnlyProvider() {
	provider = new ethers.providers.JsonRpcProvider("https://core.poa.network");		
	contract = new ethers.Contract(contractAddress, abi, provider);
	startLoop();
}

// VARIABLES

const POA_BLOCK_TIME = 5.4;
const PAST_BLOCKS = 12 * 60 * 24 * 2 * 10; // ~12 blocks per minute, 60min per hour, 24h in a day
// only used as an arbitrary point to query events from, so accuracy isn't important

var a_end = 0;
var a_gameState = 0;
var a_pullCost = 0;

var m_balance = 0;
var m_eggoa = 0;
var m_glory = 0;
var m_openedChest = false;
var m_sacrifice = 0;
var m_share = 0;
var m_shroom = 0;

var	loggingThePast = true;

/* GLOBAL LOOP */

// Initiates loops
function startLoop(){
	console.log('Main loop started.');
	initializeBlockchainData();
	controlLoopFast();
	controlLoopSlow();
}

//One-time init
function initializeBlockchainData() {
    initializeFilter();
    refreshData();
    updateEndTimestamp();
	/*updateJoinCost();
	updateLaunchTimestamp();
	
	updateTerritory();
	getSacrificeAmount(1);
	getFloorDaiCost(1);
	getShroomCost();*/
}

//Fast loop every 100ms 
function controlLoopFast() {
	changeEggoaSacrifice();
	/*updateLaunchTimer();
	
	updateDaimidTimer();
	updateGoamidTimer();
	updateLastRadTimer();
	updateLastShroomTimer();
	//updateSelectedLandTimer(h_selectedLand);
	updateNestTextTimer();*/
	setTimeout(controlLoopFast, 100);
}

//Slow loop on 4 seconds
function controlLoopSlow() {
	if(signer != 0) {
		updateAccount();
    }
    checkGameState();
	/*   
	updateGameState();
	logThePast();*/
	refreshData();
    setTimeout(controlLoopSlow, 4000);
}

function refreshData(){
    updateChest();
    updateEndTimer();
    updateKing();
	updateReign();
	if(a_gameState !== 0){ updatePushCost()};
	updatePullCost();
	if(m_account !== "") {
		updateEggoa();
		updateShroom();
		updateGlory();
		updateShare();
	}
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

// Add spaces between integers, every 3 integers
function numberWithSpaces(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

// Set text to red if condition is true, reset to base if condition is false
function setRedLimit(_id, _bool) {
    if(_bool == true) {
        document.getElementById(_id).style.color = "rgb(255, 0, 0)";
        document.getElementById(_id).style.textShadow = "1px 1px 1px #ff0000";
    }
    else {
        document.getElementById(_id).style.color = "";
        document.getElementById(_id).style.textShadow = "";
    }
}

// MODALS

var current_modal;

// Close modal
function closeModal(_modal) {
	document.getElementById(_modal).style.display = "none";
}

// Show modal
function showModal(_modal){
	current_modal = document.getElementById(_modal);
	document.getElementById(_modal).style.display = "block";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
	if (event.target == current_modal) {
	  current_modal.style.display = "none";
	}
  }

//** LOCAL FUNCTIONS **//

// Check if game hasn't started (0), is ongoing (1), has ended (2)
function checkGameState() {
	_currentTimestamp = getCurrentTime();
	let _end = parseInt(a_end);
    if(_end < _currentTimestamp) {
        if(_end !== 0) {
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

// Restricts __number between __min and __max
// Updates appropriate __html element
function checkBoundaries(__number, __html, __min, __max) {
	if(__number > __max) {
		__number = __max;
	} else if (__number < __min) {
		__number = __min;
	}
	document.getElementById(__html).value = __number;
	return __number;
}

// Check if player has enough eggoas to sacrifice
function checkEggoaSacrifice() {
	if(parseInt(m_eggoa) > parseInt(a_pullCost)) {
		showModal('pull-modal');
	}
	else {
		showModal('cant-pull-modal');
	}
}

// Change Eggoa sacrifice
function changeEggoaSacrifice() {
	let _sacrifice = document.getElementById('eggoaSacrifice').value;
	_sacrifice = checkBoundaries(_sacrifice, 'eggoaSacrifice', parseInt(a_pullCost), parseInt(m_eggoa))
	m_sacrifice = _sacrifice;
}


/*
// Calculate DAI earnings for player, based on his proportion of earned rads
// Check if game is over and if player has opened chest too

function updatePlayerChest() {

	let d_playerChest = document.getElementById('playerChest');

	let _playerShare = parseFloat(a_chest * m_earnedRad / a_globalRad).toFixed(6);
	m_playerChest = _playerShare;

	let _currentTimestamp = parseInt((new Date()).getTime() / 1000); // from ms to s
	let _time = a_end - _currentTimestamp;

	// has player opened his chest already?
	if(m_openedChest[0] == true) {
		d_playerChest.innerHTML = "You've opened your POA chest before, and won " + m_playerChest + " POA. Good job!";
	}
	// is the game over?
	else if(_time < 0 && m_openedChest[0] == false) {
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
            d_joinOrChangeButton.innerHTML = '<button class="btn btn-danger" onclick="checkTribeIsSelected(joinGame)">Join Game</button>'
        }
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
*/
function updateEndTimer() {
	document.getElementById('end').innerHTML = convertTime(a_end);
}

//-- READ ONLY ETHERS

// if signer isn't 0, check if player changes accounts
// TEST
function updateAccount() {

	provider = new ethers.providers.Web3Provider(web3.currentProvider);
	signer = provider.getSigner();	
	contract = new ethers.Contract(contractAddress, abi, signer);

	let addressPromise = signer.getAddress().then(function(result){
		if(m_account != result) {
			m_account = result;
            document.getElementById('account').innerHTML = formatEthAdr(m_account);
            resetNest();
			refreshData();
		}
	});
}

// Set all nest text to 0
function resetNest() {

}

// Current player balance
function updateBalance(){
	contract.balance(m_account).then((result) => 
		{
			m_balance = ethers.utils.formatEther(result);
		});
}

// Current chest
function updateChest() {
	contract.chest().then((result) =>
	{
        a_chest = ethers.utils.formatEther(result);
        document.getElementById('chest').innerHTML = parseFloat(a_chest).toFixed(4);
	})
}

// End timestamp - should only need to be called once
function updateEndTimestamp(){
	contract.end().then((result) =>
	{
		a_end = result.toString();
	});
}

// Current King
function updateKing() {
    contract.throneKing().then((result) =>
    {
        a_king = result;
        document.getElementById('king').innerHTML = formatEthAdr(a_king);
    });
}

// Reign start timestamp
function updateReign() {
    contract.throneReign().then((result) =>
    {
        a_reignTimestamp = result.toString();
        document.getElementById('reignDuration').innerHTML = convertTime(a_reignTimestamp);
    });
}

// Push Cost (DAI)
function updatePushCost() {
    contract.ComputePush().then((result) =>
    {
		let _cost = ethers.utils.formatEther(result) + parseInt(0.001);
        a_pushCost = _cost;
        document.getElementById('pushCost').innerHTML = parseFloat(a_pushCost).toFixed(4);
    });
}

// Pull Cost (Eggoa sacrifice)
function updatePullCost() {
    contract.throneArmy().then((result) =>
    {
        a_pullCost = result.toString();
		document.getElementById('pullCost').innerHTML = a_pullCost;
		document.getElementById('pullCost2').innerHTML = a_pullCost;
		document.getElementById('pullCost3').innerHTML = a_pullCost;
    });
}

// Player Eggoa
function updateEggoa() {
	contract.eggoa(m_account).then((result) =>
    {
        m_eggoa = result.toString();
		document.getElementById('eggoa').innerHTML = m_eggoa;
    });
}

// Player Shroom
function updateShroom() {
	contract.ComputeShroom(m_account).then((result) =>
    {
        m_shroom = result.toString();
        document.getElementById('shroom').innerHTML = m_eggoa;
    });
}

// Player Glory
function updateGlory() {
	contract.glory(m_account).then((result) =>
    {
        m_glory = result.toString();
        document.getElementById('glory').innerHTML = m_glory;
    });
}

// Player Share
function updateShare() {
	contract.totalGlory().then((result) =>
	{
		_totalGlory = parseInt(result.toString());
		if(_totalGlory == 0) { _totalGlory = 1}; // avoid division by 0
		m_sharePercent = parseInt(m_glory) / _totalGlory
		m_share = m_sharePercent * a_chest;
		m_sharePercent = m_sharePercent * 100;
		document.getElementById('sharePercent').innerHTML = parseFloat(m_sharePercent).toFixed(2);
		document.getElementById('share').innerHTML = parseFloat(m_share).toFixed(4);
	});
}

//-- WRITE ETHERS

// Push - spend DAI to become King

const pushKing = async() => {
	console.log("step 1");
	try {
		console.log("step 2");
		//let _pushCost = parseFloat(a_pushCost) + 0.001;
		console.log(_pushCost);
		notificationSend('About to push the King for ' + a_pushCost + ' POA');
		console.log("step 4");
		const pushTheKing = await contract.Push({
            value: ethers.utils.parseEther(a_pushCost)
		})
		console.log("step 5");
		notificationSuccess('Pushing the King!');
	  } catch (error) {

		notificationError();
	  }
}

// Pull - sacrifice a given number of Eggoas to become King

const pullKing = async() => {
	try {
		notificationSend('About to sacrifice ' + m_sacrifice + ' Eggoas to pull the King');
		const pullTheKing = await contract.Pull(m_sacrifice);
		//console.log("found anomaly successfully");
		notificationSuccess('Pulling the King!');
	} catch (error) {
		//console.log("Error: ", error);
		notificationError();
	}
}

// Hatch - change Shrooms into Eggoas

const hatchShroom = async() => {
	try {
		notificationSend('About to hatch ' + m_shroom + ' into Eggoas');
		const pullTheKing = await contract.Hatch();
		//console.log("found anomaly successfully");
		notificationSuccess('Hatching Eggoas!');
	} catch (error) {
		//console.log("Error: ", error);
		notificationError();
	}
}

// OpenChest - opens player's reward chest and withdraws it to their wallet

const openRewardChest = async () => {
	try {
		//console.log("opening dai chest...");
		notificationSend('Opening POA chest...');
		const openMyChest = await contract.OpenChest();
		//console.log("success!");
		notificationSuccess('Your wallet grows fatter!');
	} catch (error) {
		//console.log("Error: couldn't open ", error);
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


// Event logging

// Conversion of Date to hh:mm:ss
var d_eventLog = document.getElementById('eventLog');
//var d_scrollLog = document.getElementById('scrollLog');

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
	d_eventLog.innerHTML = "<h5>[" + getTimeFromBlock(__block) + "] " + __string + "</h5>";
	//d_scrollLog.scrollTop = d_scrollLog.scrollHeight;
}

function truncateEther(__eth) {
	let e = ethers.utils.formatEther(__eth);
	e = parseFloat(e).toFixed(6);
	e = parseFloat(e);
	return e;
}

function beginEventLogging() {
	
	console.log("event logging begins");

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
	
	contract.on("Pushed", (sender, eth, event) => {
		let _string = formatEthAdr(sender) + " wins the throne through spending " + truncateEther(eth) + " POA. 200 Eggoas join their nest.";
		checkEventPast(_string, event.blockNumber);
	});
	
	contract.on("Pulled", (sender, eggoa, event) => {
		let _string = formatEthAdr(sender) + " seizes the throne with a sacrifice of " + eggoa.toString() + " Eggoas.";
		checkEventPast(_string, event.blockNumber);
	});

	contract.on("Overthrown", (sender, glory, event) => {
		let _string = formatEthAdr(sender) + " loses the throne! His reign awards him " + glory.toString() + " Glory.";
		checkEventPast(_string, event.blockNumber);
	});

	contract.on("Hatched", (sender, eggoa, event) => {
		let _string = formatEthAdr(sender) + " hatches " + eggoa.toString() + " shrooms into Eggoas.";
		checkEventPast(_string, event.blockNumber);
	});
}

function getPastEvents() {

	filter = {
		address: contractAddress,
		fromBlock: f_fromBlock,
		toBlock: "latest"
	};

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
}