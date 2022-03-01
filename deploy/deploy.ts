import {Wallet} from 'zksync-web3';
import * as ethers from 'ethers';
import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {Deployer} from '@matterlabs/hardhat-zksync-deploy';
import {env} from 'process';

const ZK_CONTRACT_NAME = env.ZK_CONTRACT_NAME;
const ZK_USDC_ADDRESS = env.ZK_USDC_ADDRESS;
const ZK_USDC_DECIMALS = env.ZK_USDC_DECIMALS; // Default is 6
const ZK_NFT_NAME = env.ZK_NFT_NAME;
const ZK_NFT_SYMBOL = env.ZK_NFT_SYMBOL;
const ZK_PK = env.ZK_PK;

// deploy contract
export default async function (hre: HardhatRuntimeEnvironment) {
	console.log('Deploying contract...');
	console.log('Contract Name:', ZK_CONTRACT_NAME);
	console.log('USDC Contract Address:', ZK_USDC_ADDRESS);
	console.log('USDC Decimals:', ZK_USDC_DECIMALS);
	console.log('NFT Name:', ZK_NFT_NAME);
	console.log('NFT Symbol:', ZK_NFT_SYMBOL);
	console.log('PK:', !!ZK_PK);

	// Initialize the wallet
	const wallet = new Wallet(ZK_PK);

	// Create deployer object and load the artifact of the contract we want to deploy
	const deployer = new Deployer(hre, wallet);
	const artifact = await deployer.loadArtifact(ZK_CONTRACT_NAME);

	// Contract constructor arguments
	const args = [ZK_NFT_NAME, ZK_NFT_SYMBOL];

	// Estimate fee
	const deploymentFee = await deployer.estimateDeployFee(artifact, args, ZK_USDC_ADDRESS);
	const parsedFee = ethers.utils.formatUnits(deploymentFee.toString(), ZK_USDC_DECIMALS);
	console.log(`The deployment will cost ${parsedFee} USDC`);

	// // Deposit funds to L2 (USDC by default)
	// const depositHandle = await deployer.zkWallet.deposit({
	// 	to: deployer.zkWallet.address,
	// 	token: ZK_USDC_ADDRESS,
	// 	amount: deploymentFee.mul(2),
	// 	approveERC20: true,
	// });
	// // Wait until the deposit is processed on zkSync
	// await depositHandle.wait();

	// Deploy contract
	const contract = await deployer.deploy(artifact, args, ZK_USDC_ADDRESS);

	// Show the contract address
	console.log(`${artifact.contractName} was deployed to ${contract.address}`);
}
