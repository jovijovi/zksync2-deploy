import {Wallet} from 'zksync-web3';
import * as ethers from 'ethers';
import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {Deployer} from '@matterlabs/hardhat-zksync-deploy';
import {env} from 'process';

const ZK_CONTRACT_NAME = env.ZK_CONTRACT_NAME;
const ZK_NFT_NAME = env.ZK_NFT_NAME;
const ZK_NFT_SYMBOL = env.ZK_NFT_SYMBOL;
const ZK_NFT_BASE_TOKEN_URI = env.ZK_NFT_BASE_TOKEN_URI;
const ZK_NFT_MAXSUPPLY = env.ZK_NFT_MAXSUPPLY;
const ZK_PK = env.ZK_PK;

// deploy contract
export default async function (hre: HardhatRuntimeEnvironment) {
	console.log('Deploying contract...');
	console.log('Contract Name:', ZK_CONTRACT_NAME);
	console.log('NFT Name:', ZK_NFT_NAME);
	console.log('NFT Symbol:', ZK_NFT_SYMBOL);
	console.log('NFT BaseTokenURI:', ZK_NFT_BASE_TOKEN_URI);
	console.log('NFT MaxSupply:', ZK_NFT_MAXSUPPLY);
	console.log('PK:', !!ZK_PK);

	// Initialize the wallet
	const wallet = new Wallet(ZK_PK);

	// Create deployer object and load the artifact of the contract we want to deploy
	const deployer = new Deployer(hre, wallet);
	const artifact = await deployer.loadArtifact(ZK_CONTRACT_NAME);

	// Contract constructor arguments
	const getArts = (): any[] => {
		if (ZK_NFT_BASE_TOKEN_URI && ZK_NFT_MAXSUPPLY) {
			return [ZK_NFT_NAME, ZK_NFT_SYMBOL, ZK_NFT_BASE_TOKEN_URI, ZK_NFT_MAXSUPPLY, []];
		}
		return [ZK_NFT_NAME, ZK_NFT_SYMBOL];
	}
	const args = getArts();

	// Estimate fee
	// Pay fees with ether
	// Ref:
	// https://v2-docs.zksync.io/dev/zksync-v2/handling-of-eth.html
	// https://v2-docs.zksync.io/dev/zksync-v2/aa.html#paymasters
	const deploymentFee = await deployer.estimateDeployFee(artifact, args);
	const parsedFee = ethers.utils.formatUnits(deploymentFee.toString());
	console.log(`Deploy contract will cost: ${parsedFee} ETH`);

	// Deploy contract
	const contract = await deployer.deploy(artifact, args);

	// Show the contract address
	console.log(`${artifact.contractName} was deployed to ${contract.address}`);
}
