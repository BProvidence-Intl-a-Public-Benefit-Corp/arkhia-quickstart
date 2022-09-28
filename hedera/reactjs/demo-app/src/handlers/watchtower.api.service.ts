import appConfig from "@/config/appConfig";

const subscribeTopicRoute = `/com.hedera.mirror.api.proto.ConsensusService/subscribeTopic`;

const getSubscriptionPayload =  (topic_id: string, limit: string) => {
    const subscriptionPayload = {
        subscribe: subscribeTopicRoute,
        body: {
            consensusStartTime: {
                nanos: 0,
                seconds: `0`
            },
            limit: limit,
            topicID: {
                realmNum: `0`,
                shardNum: `0`,
                topicNum: topic_id
            }
        }
    };

    return subscriptionPayload;
};

export const WatchtowerService = {
    getSubscriptionPayload
};
