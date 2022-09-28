import appConfig from "@/config/appConfig";
import {
    AccountId,
    Client,
    PrivateKey
} from "@hashgraph/sdk";
import { ClientHandler } from "./client.handler";


let clientTestnet: Client | null;

const submitMessageTopic = (name: string, message: string) => {
 
    const client = ClientHandler.getClientTestnet();

    //Create the account info query
    const accountId = appConfig.demoValues.fairTradeValues.ftc_treasury_id;
    const privateKey = appConfig.demoValues.fairTradeValues.ftc_treasury_pkey;
    const operatorId = AccountId.fromString(accountId);
    const operatorKey = PrivateKey.fromString(privateKey);
    
    clientTestnet = Client.forTestnet().setOperator(operatorId, operatorKey);
    return clientTestnet;

};

export const TopicHandler = { submitMessageTopic };
