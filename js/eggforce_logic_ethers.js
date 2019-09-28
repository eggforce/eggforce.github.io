let contract;
let contractAddress = "0x2eBabFE27c967967F97a005F9A5be1fA5e202421";

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
			
			let provider = new ethers.providers.Web3Provider(web3.currentProvider);
			let signer = provider.getSigner();

			console.log(signer.getAddress());
			
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
	let provider = new ethers.providers.JsonRpcProvider("https://core.poa.network");		
	contract = new ethers.Contract(contractAddress, abi, provider);
}

// VARIABLES

var a_balance = 1;
var m_account = "";

var doc_balance = document.getElementById('balance');

// READ ONLY ETHERS

function getContractOwner() {
	contract.owner().then((result) => 
			{
				let _owner = result;
				console.log(_owner);
				m_account = _owner; //hack until I find out how to query account with ethers
				document.getElementById("contractOwner").innerHTML = _owner;
			});
}

// Events

function beginEventLogging() {
	
	console.log("event logging begins");
	
	contract.on("JoinedGame", (sender, tribe, event) => {
		console.log("New player: " + sender + " has joined tribe " + tribe.toString());
	});
}

// Current player balance
function updateBalance(){
	contract.balance(m_account).then((result) => 
		{
			a_balance = result;
			doc_balance.innerHTML = a_balance;
		});
}

// WRITE ETHERS

let weiToSend = ethers.utils.parseEther("1");
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
		console.log("about to send transaction")
		const startTheGame = await contract.StartGame({
		  //call function to request access, from the current wallet (REVERTS)
		  value: weiToSend
		})

		console.log("this worked");
	  } catch (error) {
		console.log("Error: ", error) //fires as the contract reverted the payment
	  }
}
/*
let testWeiToEth = ethers.utils.bigNumberify("1000000000000000000");
let testValue = ethers.utils.bigNumberify("2");
let testMultiply = testValue.mul(testWeiToEth);
console.log(testMultiply.toString());
*/

let amount = "3";
let toSend = ethers.utils.parseEther(amount);
console.log(toSend.toString());

