console.clear();

const { 
    ContractFunctionParameters, 
    ContractExecuteTransaction,
} = require('@hashgraph/sdk');

const sdkPath = './../../hedera.sdk/';
const SolidityTypes = require(sdkPath + "constants/solidity");

const clientHandler = require('../../hedera.sdk/handlers/clientHandler');
const accountHandler = require('../../hedera.sdk/handlers/accountHandler');
const contractHandler = require('../../hedera.sdk/handlers/contractHandler');

async function tokenContractSanityCheck(client, contractId, name, message, amount) {

    console.log(`Before Donation Journey:\n`)
    // await accountHandler.getAccountBalance(client);
    await contractHandler.getContractCallQuery(client, contractId, "getContractBalance", SolidityTypes.Number256);
   // await contractHandler.getContractCallQuery(client, contractId, "getTokenRemainingBalance", SolidityTypes.Number256);
   // await contractHandler.getContractCallQuery(client, contractId, "getFairTradeBuyerNumbers", SolidityTypes.Number256);

    // Create FT using TokenSender create function
    const makeDonation = new ContractExecuteTransaction()
        .setContractId(contractId)
        .setGas(2000000)
        .setPayableAmount(amount)
        .setFunction("makeDonationHbars", 
            new ContractFunctionParameters()
            .addString(name)
            .addString(message)
            .addUint256(amount));
          

    console.log('Donating because we love coffee....')
    const makeDonationTx = await makeDonation.execute(client);
    const makeDonationRx = await makeDonationTx.getRecord(client); //getRecord
    const makeDonationRxResult = makeDonationRx.contractFunctionResult.getUint256(0);

    console.log(`After Donation Journey:\n`)
    console.log(makeDonationRxResult);

    await accountHandler.getAccountBalance(client);
    await contractHandler.getContractCallQuery(client, contractId, "getContractBalance", SolidityTypes.Number256);
    await contractHandler.getContractCallQuery(client, contractId, "getTokenRemainingBalance", SolidityTypes.Number256);
    await contractHandler.getContractCallQuery(client, contractId, "getFairTradeBuyerNumbers", SolidityTypes.Number256);
  
    await accountHandler.getAccountBalance(client);

    console.log(`And we're done for now.`);
    return makeDonationRx;
}

async function getDonations(client, contractId) {

    // Create FT using TokenSender create function
    const getDonation = new ContractExecuteTransaction()
        .setContractId(contractId)
        .setGas(2000000)
        .setFunction("withdrawDonations");
          
    const getDonationTx = await getDonation.execute(client);
    const getDonationRx = await getDonationTx.getRecord(client);  //getRecord
    console.log(`Rx result`);
    console.log(getDonationRx.status);
}

async function main() {
    // Init clients/users
    const client = await clientHandler.getTestnetClient();

    // 1. Sanity Check
    const tokenId = `0.0.49336025`; // example
    const contractId = `0.0.49336024`; // example
    await tokenContractSanityCheck(client, contractId, "Arkhia", "A little gift", 50);
    
    // 2. Withdraw donations (should fail)
    // await getDonations(client, result.contractId)
}

main();
