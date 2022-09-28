import { MetamaskService } from "./metamask.handler";
import appConfig from "@/config/appConfig";
import { ContractSolInfo } from "@/types/contracts";
import { ethers } from "ethers";
import Web3 from "web3";
import { Contract } from "web3-eth-contract";

// Main init vars
const providerUrl = appConfig.arkhiaApi.getJsonRpcUrl();
const web3 = new Web3(providerUrl);
// Main contract vars
const abi = `[{"inputs":[{"internalType":"string","name":"_creatorName","type":"string"},{"internalType":"string","name":"_tokenSymbol","type":"string"},{"internalType":"string","name":"_tokenName","type":"string"},{"internalType":"uint256","name":"_tokenSupply","type":"uint256"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"},{"indexed":false,"internalType":"string","name":"name","type":"string"},{"indexed":false,"internalType":"string","name":"message","type":"string"}],"name":"FairTradeEvent","type":"event"},{"stateMutability":"payable","type":"fallback"},{"inputs":[{"internalType":"address","name":"receiver","type":"address"},{"internalType":"int64","name":"amount","type":"int64"}],"name":"exchangeFairTradeToken","outputs":[{"internalType":"int256","name":"","type":"int256"}],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"getContractBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getContractMetadata","outputs":[{"components":[{"internalType":"string","name":"creatorName","type":"string"},{"internalType":"string","name":"tokenSymbol","type":"string"},{"internalType":"string","name":"tokenName","type":"string"},{"internalType":"uint256","name":"tokenSupply","type":"uint256"},{"internalType":"address","name":"tokenAddress","type":"address"}],"internalType":"struct FairTradeCoffee.FairTradeMetadata","name":"","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getFairTradeBuyerNumbers","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getFairTradeBuyers","outputs":[{"components":[{"internalType":"address","name":"from","type":"address"},{"internalType":"uint256","name":"timestamp","type":"uint256"},{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"message","type":"string"},{"internalType":"uint256","name":"amount","type":"uint256"}],"internalType":"struct FairTradeCoffee.FairTradeBuyer[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getTokenRemainingBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"_name","type":"string"},{"internalType":"string","name":"_message","type":"string"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"makeDonationHbars","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"mintFungibleToken","outputs":[{"internalType":"address","name":"createdTokenAddress","type":"address"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"string","name":"_creatorName","type":"string"}],"name":"setCreatorName","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_account","type":"address"}],"name":"tokenAssociate","outputs":[{"internalType":"int256","name":"","type":"int256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"withdrawDonations","outputs":[],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"}]`;
const contractjJson = JSON.parse(abi);
const contractId = appConfig.demoValues.fairTradeValues.ftc_contract_solidity_id;

// Web3 for metadata
const fairTradeContract =  new web3.eth.Contract(contractjJson, contractId);

let fairTradeCoffeeDataCache: ContractSolInfo = {
    creatorName: ``,
    tokenAddress: ``,
    tokenName: ``,
    tokenSupply: ``,
    tokenSymbol: ``
};

const getNetworkId = async () => {
    const networkId = await web3.eth.net.getId();
    return networkId;
};

const getContractBalance = async () => {
    const balance = await web3.eth.getBalance(contractId);
    const balanceHbars = Math.round(Number(Web3.utils.fromWei(balance.toString())) * 100) /100;
    return balanceHbars;
};

const getContractMetadata = async () : Promise<ContractSolInfo> => {
    fairTradeCoffeeDataCache = await fairTradeContract.methods.getContractMetadata().call();
    return fairTradeCoffeeDataCache;
};

const getFairTradeBuyers = async () => {
    const getFairTradeBuyers = await fairTradeContract.methods.getFairTradeBuyers().call();
    return getFairTradeBuyers;
};

const getFairTradeBuyerNumbers = async () => {
    const getFairTradeBuyerNumbers = await fairTradeContract.methods.getFairTradeBuyerNumbers().call();
    return getFairTradeBuyerNumbers;
};

const getContract = (): Contract  => {
    return fairTradeContract;
};

const donateHbar = async (_donationValue: number, _name: string, _message: string) => {
    // 
    const walletAddress = (await MetamaskService.getWalletInfo()).accountAddress;
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner(walletAddress);

    // load contract into ethers with signature
    const fairTradeContractEthers = new ethers.Contract(contractId, abi, signer);
    const valueToDonate = ethers.utils.parseEther(String(_donationValue));

    const result = await fairTradeContractEthers.makeDonationHbars(_name, _message, _donationValue, { value: valueToDonate });
    console.log(`Transaction result`);
    console.log(result);

    return fairTradeContractEthers;
};


export const ContractHandler = {
    getNetworkId,
    getContract,
    getContractBalance,
    getContractMetadata,
    getFairTradeBuyers,
    getFairTradeBuyerNumbers,
    donateHbar
};

