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
			
			// provider: read-only access
			// signer: read and write
			contract = new ethers.Contract(contractAddress, abi, signer);

			// Get owner address
			// works!
			/*
			contract.owner().then((result) => 
			{
				let _owner = result;
				console.log(_owner); 
			});
			*/
			
        } catch (error) {
            // User denied account access...
        }
    }
    // Non-dapp browsers...
    else {
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
		let provider = new ethers.providers.JsonRpcProvider("https://core.poa.network");
		
		contract = new ethers.Contract(contractAddress, abi, provider);
		contract.owner().then((result) => 
			{
				let _owner = result;
				console.log(_owner); 
			});
    }
});

function getContractOwner() {
	contract.owner().then((result) => 
			{
				let _owner = result;
				console.log(_owner);
				document.getElementById("contractOwner").innerHTML = _owner;
			});
}

function startGame() {
				// Sending a tx?? 
				// Error: unknown transaction override _hex
				let weiToSend = ethers.utils.parseEther("1);
				console.log(weiToSend);
				contract.StartGame(weiToSend).then((result) =>
				{
					console.log(result);
				});
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
