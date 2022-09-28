import { WalletInfo } from "@/types/demo";
import { ethers } from "ethers";

const metaMaskIsAvailable = () => {
    return window.ethereum !== undefined;
};

const metaMaskIsConnected = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const accounts = await provider.send(`eth_requestAccounts`, []);
    return accounts[0] || false;
};

const connectToWallet = () => {
    if (!metaMaskIsAvailable()) return;

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    return provider;
};

const getWalletInfo = async () : Promise<WalletInfo> => {
 
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const accounts = await provider.send(`eth_requestAccounts`, []);
    const [evmAccountAdress] = accounts;

    console.log(`evm address: ${evmAccountAdress}`);

    const balance = await provider.getBalance(accounts[0]);
    const balanceInEther = ethers.utils.formatEther(balance);
    return {
        accountAddress: accounts[0], balance: balanceInEther
    };

};

export const MetamaskService = {
    metaMaskIsAvailable,
    metaMaskIsConnected,
    connectToWallet,
    getWalletInfo,
};

