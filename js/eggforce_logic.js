//Error: unsupported network
//"1" works (mainnet?), 2 doesn't, 3 doesn't, 4 does (testnet?)
//let provider = ethers.getDefaultProvider(99);

//Reference Error: web3 undefined in local tests
//Works once deployed to web
let provider = new ethers.providers.Web3Provider(web3.currentProvider);

let abi = [
	{
		"constant": false,
		"inputs": [],
		"name": "acceptOwnership",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"internalType": "uint256",
				"name": "__land",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "__tier",
				"type": "uint256"
			}
		],
		"name": "AttackTerritory",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"internalType": "uint256",
				"name": "__newTribe",
				"type": "uint256"
			}
		],
		"name": "ChangeTribe",
		"outputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [],
		"name": "ClaimTribeRad",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"internalType": "uint256",
				"name": "__land",
				"type": "uint256"
			}
		],
		"name": "CollectShroom",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"internalType": "uint256",
				"name": "__rad",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "__territory",
				"type": "bool"
			},
			{
				"internalType": "uint256",
				"name": "__target",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "__stat0",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "__stat1",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "__stat2",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "__stat3",
				"type": "uint256"
			}
		],
		"name": "FindAnomaly",
		"outputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [],
		"name": "HarvestRad",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"internalType": "uint256",
				"name": "__tier",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "__rad",
				"type": "uint256"
			}
		],
		"name": "HatchShroom",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"internalType": "uint256",
				"name": "__tribe",
				"type": "uint256"
			}
		],
		"name": "JoinGame",
		"outputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [],
		"name": "OpenChest",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "eth",
				"type": "uint256"
			}
		],
		"name": "OpenedChest",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "tribe",
				"type": "uint256"
			}
		],
		"name": "JoinedGame",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "rad",
				"type": "uint256"
			}
		],
		"name": "HarvestedRad",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "rad",
				"type": "uint256"
			}
		],
		"name": "ClaimedTribeRad",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "tribe",
				"type": "uint256"
			}
		],
		"name": "ChangedTribe",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "eth",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "rad",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "bool",
				"name": "land",
				"type": "bool"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "stat0",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "stat1",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "stat2",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "stat3",
				"type": "uint256"
			}
		],
		"name": "FoundAnomaly",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "_from",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "_to",
				"type": "address"
			}
		],
		"name": "OwnershipTransferred",
		"type": "event"
	},
	{
		"constant": false,
		"inputs": [
			{
				"internalType": "uint256",
				"name": "__upgrade",
				"type": "uint256"
			}
		],
		"name": "RaiseDaiPlantamid",
		"outputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"internalType": "uint256",
				"name": "__tier",
				"type": "uint256"
			}
		],
		"name": "RaiseEggoaPlantamid",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "launch",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "end",
				"type": "uint256"
			}
		],
		"name": "StartedGame",
		"type": "event"
	},
	{
		"constant": false,
		"inputs": [],
		"name": "StartGame",
		"outputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"internalType": "address payable",
				"name": "_newOwner",
				"type": "address"
			}
		],
		"name": "transferOwnership",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "eth",
				"type": "uint256"
			}
		],
		"name": "WithdrewBalance",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "tier",
				"type": "uint256"
			}
		],
		"name": "UnlockedTier",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "rad",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "tier",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "eggoa",
				"type": "uint256"
			}
		],
		"name": "HatchedShroom",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "land",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "shroom",
				"type": "uint256"
			}
		],
		"name": "CollectedShroom",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "land",
				"type": "uint256"
			}
		],
		"name": "DiscoveredLand",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "land",
				"type": "uint256"
			}
		],
		"name": "TookOverLand",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "lord",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "powerSender",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "powerLord",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "result",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "shroom",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "eggoa",
				"type": "uint256"
			}
		],
		"name": "WonLandFight",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "lord",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "powerSender",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "powerLord",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "result",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "eggoa",
				"type": "uint256"
			}
		],
		"name": "LostLandFight",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "rad",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "tier",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "stat0",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "stat1",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "stat2",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "stat3",
				"type": "uint256"
			}
		],
		"name": "UpgradedEggoa",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "tier",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "eggoa",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "plantamid",
				"type": "uint256"
			}
		],
		"name": "RaisedEggoaPlantamid",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "eth",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "upgrade",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "plantamid",
				"type": "uint256"
			}
		],
		"name": "RaisedDaiPlantamid",
		"type": "event"
	},
	{
		"constant": false,
		"inputs": [],
		"name": "UnlockTier",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"internalType": "uint256",
				"name": "__tier",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "__rad",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "__stat0",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "__stat1",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "__stat2",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "__stat3",
				"type": "uint256"
			}
		],
		"name": "UpgradeEggoa",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [],
		"name": "WithdrawBalance",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"constant": true,
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "balance",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "chest",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "collectedTribeRad",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"internalType": "uint256",
				"name": "__start",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "__baseCost",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "__now",
				"type": "uint256"
			}
		],
		"name": "ComputeAuction",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "pure",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"internalType": "uint256",
				"name": "__floor",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "__upgrade",
				"type": "uint256"
			}
		],
		"name": "ComputeDaiPlantamidCost",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"internalType": "uint256",
				"name": "__floor",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "__tier",
				"type": "uint256"
			}
		],
		"name": "ComputeEggoaPlantamidCost",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "pure",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"internalType": "uint256",
				"name": "__land",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "__landWeight",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "__fighter",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "__fighterTier",
				"type": "uint256"
			}
		],
		"name": "ComputeForce",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "_power",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"internalType": "address",
				"name": "__player",
				"type": "address"
			}
		],
		"name": "ComputeFullRad",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"internalType": "uint256",
				"name": "__land",
				"type": "uint256"
			}
		],
		"name": "ComputeLandShroom",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"internalType": "address",
				"name": "__player",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "__elapsed",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "__tier",
				"type": "uint256"
			}
		],
		"name": "ComputeRad",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"internalType": "uint256",
				"name": "__max",
				"type": "uint256"
			}
		],
		"name": "ComputeRandom",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"internalType": "address",
				"name": "__who",
				"type": "address"
			}
		],
		"name": "ComputeShroom",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"internalType": "uint256",
				"name": "__rad",
				"type": "uint256"
			}
		],
		"name": "ComputeShroomMultiplier",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "pure",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"internalType": "uint256",
				"name": "__start",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "__end",
				"type": "uint256"
			}
		],
		"name": "ComputeSum",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "pure",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"internalType": "uint256",
				"name": "__change",
				"type": "uint256"
			}
		],
		"name": "ComputeTribeChange",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"internalType": "address",
				"name": "__sender",
				"type": "address"
			}
		],
		"name": "ComputeTribeRad",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"internalType": "uint256",
				"name": "__tier",
				"type": "uint256"
			}
		],
		"name": "ComputeUnlockCost",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "pure",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"internalType": "uint256",
				"name": "__level",
				"type": "uint256"
			}
		],
		"name": "ComputeUpgradeCost",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "pure",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "daiAuctionCost",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "daiAuctionTimer",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "daiPlantamid",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "earnedRad",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "eggoaNest",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "level",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "attackNext",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "ownedLand",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "eggoaPlantamid",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "end",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"internalType": "address",
				"name": "__player",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "__tier",
				"type": "uint256"
			}
		],
		"name": "GetNestStat",
		"outputs": [
			{
				"internalType": "uint256[4]",
				"name": "",
				"type": "uint256[4]"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"internalType": "uint256",
				"name": "__tier",
				"type": "uint256"
			}
		],
		"name": "GetTierProd",
		"outputs": [
			{
				"internalType": "uint256[4]",
				"name": "",
				"type": "uint256[4]"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "globalRad",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "joinCost",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "land",
		"outputs": [
			{
				"internalType": "address",
				"name": "lord",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "eggoa",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "lastLand",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "level",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "lastRad",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "lastShroom",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "launch",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "newOwner",
		"outputs": [
			{
				"internalType": "address payable",
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "openedChest",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address payable",
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "plantamidDaiCost",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "rad",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "radAuctionCost",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "radAuctionTimer",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "shroom",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "tier",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "tribe",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "tribeChange",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "tribeRad",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	}
]

let contractAddress = "0x2eBabFE27c967967F97a005F9A5be1fA5e202421";

// We connect to the Contract using a Provider, so we will only
// have read-only access to the Contract
let contract = new ethers.Contract(contractAddress, abi, provider);

// Get owner address
contract.owner().then((result) => 
	{
		let _owner = result; // in case we need to manipulate result
		console.log(_owner); 
	});