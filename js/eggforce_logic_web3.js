let contract;
let contractAddress = "0x2eBabFE27c967967F97a005F9A5be1fA5e202421";

window.addEventListener('load', async () => {
    // Modern dapp browsers...
    if (window.ethereum) {
        window.web3 = new Web3(ethereum);
        try {
            // Request account access if needed
            await ethereum.enable();
            // Acccounts now exposed
            web3.eth.sendTransaction({/* ... */});
        } catch (error) {
            // User denied account access...
        }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
        window.web3 = new Web3(web3.currentProvider);
        // Acccounts always exposed
        web3.eth.sendTransaction({/* ... */});
    }
    // Non-dapp browsers...
    else {
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }
});

function getContractOwner() {
	owner(function(result) {
		document.getElementById("contractOwner").innerHTML = result;	
	});
}

function startGame() {
	var weitospend = web3.toWei(1,'ether');
	StartGame(function(result){
		console.log(result);
	});
}
