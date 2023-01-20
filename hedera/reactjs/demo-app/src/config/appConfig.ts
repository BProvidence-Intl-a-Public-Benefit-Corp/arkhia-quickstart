import hederaItems from "./hederaItems";

const loadedConfig = import.meta.env;
interface FairTradeValues {
    ftc_treasury_id: string;
    ftc_treasury_pkey: string;
    ftc_contract_id: string;
    ftc_contract_solidity_id: string;
    ftc_token_id: string;
    ftc_token_solidity_id: string;
    ftc_topic_id: string;
}

const server = {
    name: loadedConfig.VITE_APP_ENV || `dev`,
    port: loadedConfig.VITE_APP_PORT || `8989`,
};

const arkhiaApi = {
    arkhiaApiKey: loadedConfig.VITE_ARKHIA_API_KEY || ``,
    getRestApiUrl: () => getHederaNetRestApiUrl(loadedConfig),
    getJsonRpcUrl: () => getHederaNetJsonApiUrl(loadedConfig ),
    getWatchtowerUrl: () => getWatchtowerUrlConfig(loadedConfig),
};

// investigate through Workbench (https://dashboard.arkhia.io/workbench) what schemas you can get from these points
const restEndpoints = {
    accounts: `/accounts`,
    tokens: `/tokens`,
    contracts: `/contracts`,
    transactions: `/transactions`
};

const explorer = { explorerUrl: ()  => getArkhiaExplorerUrl(loadedConfig) };

const env = {
    local: `local`,
    dev: `dev`,
    qa: `qa`,
    prod: `prod`,
    getEnv: () => server.name,
    isLocal: () => server.name === `local`,
    isDev: () => server.name === `dev`,
    isQa: () => server.name === `qa`,
    isProd: () => server.name === `prod`,
};

const fairTradeValues: FairTradeValues = {
    ftc_treasury_id: String(loadedConfig.VITE_HEDERA_FTC_TREASURY_ID) || ``,
    ftc_treasury_pkey: String(loadedConfig.VITE_HEDERA_FTC_TREASURY_PV_KEY) || ``,
    ftc_contract_id: hederaItems.CONTRACT_ID,
    ftc_contract_solidity_id: hederaItems.CONTRACT_SOLIDITY_ID,
    ftc_token_id: hederaItems.TOKEN_ID,
    ftc_token_solidity_id: hederaItems.TOKEN_SOLIDITY_ID,
    ftc_topic_id: hederaItems.TOPIC_ID
};

const demoValues = { fairTradeValues };

const getWatchtowerUrlConfig = (loadedConfig: ImportMetaEnv) => {
    const watchTowerBaseurl = loadedConfig.VITE_ARKHIA_USE_MAINNET === `true` ? loadedConfig.VITE_ARKHIA_MAINNET_WATCHTOWER : loadedConfig.VITE_ARKHIA_TESTNET_WATCHTOWER;
    return `wss://${watchTowerBaseurl}?api_key=y0J7Ia49dV9fd592Ifxa00Ctsdacymd2`;
};

const getHederaNetRestApiUrl = (loadedConfig: any) => {
    return loadedConfig.VITE_ARKHIA_USE_MAINNET === `true` ? `${loadedConfig.VITE_ARKHIA_MAINNET_BASE_URL}/${loadedConfig.VITE_ARKHIA_REST_SUFFIX}` :
        `${loadedConfig.VITE_ARKHIA_TESTNET_BASE_URL}/${loadedConfig.VITE_ARKHIA_REST_SUFFIX}`;
};

const getHederaNetJsonApiUrl = (loadedConfig: any) => {
    return loadedConfig.VITE_ARKHIA_USE_MAINNET === `true` ? `${loadedConfig.VITE_ARKHIA_MAINNET_BASE_URL}/${loadedConfig.VITE_ARKHIA_JSON_RPC_SUFFIX}/${loadedConfig.VITE_ARKHIA_API_KEY}` :
        `${loadedConfig.VITE_ARKHIA_TESTNET_BASE_URL}/${loadedConfig.VITE_ARKHIA_JSON_RPC_SUFFIX}/${loadedConfig.VITE_ARKHIA_API_KEY}`;
};

const getArkhiaExplorerUrl = (loadedConfig: any) => {
    return loadedConfig.VITE_ARKHIA_USE_MAINNET === `true` ? String(loadedConfig.VITE_EXPLORER_LINK_MAINNET) : String(loadedConfig.VITE_EXPLORER_LINK_TESTNET);
};

const appConfig = {
    server,
    arkhiaApi,
    restEndpoints,
    demoValues,
    env,
    explorer
};

export default appConfig;

