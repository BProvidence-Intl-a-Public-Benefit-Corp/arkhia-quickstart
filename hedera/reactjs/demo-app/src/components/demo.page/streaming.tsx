import Button from "../theme/button";
import appConfig from "@/config/appConfig";
import { Alert, Box, Divider, Typography, useTheme } from "@mui/material";
import React, { useEffect, useState } from "react";
import io from 'socket.io-client';
import { WatchtowerService } from "@/handlers/watchtower.api.service";
import WifiPasswordIcon from '@mui/icons-material/WifiPassword';
import WifiOffIcon from '@mui/icons-material/WifiOff';
import Subtitle from "../generic/subtitle";
import { DataGridService } from "@/handlers/data.grid.service";
import ArkhiaDataGrid from "../generic/data.grid";
import { CoffeeDonationRecord } from "@/types/demo";

interface Props {
    topicId: string;
}

function Streaming (props: Props) {
    const theme = useTheme();
    const socket = io(appConfig.arkhiaApi.getWatchtowerUrl());
    const [socketError, setSocketError] = useState(``);
    const [streamConnected, setStreamConnected] = useState(false);
    const [messageCollection, setMessageCollection] = useState<Array<CoffeeDonationRecord>>([]);
    const [statusStreaming, setStatusStreaming] = useState(``);

    const addMessageToCollection = (message: any) => {
        if (message.error) {
            console.error(message.error);
            return;
        }
        const messageObject: CoffeeDonationRecord = { 
            topicMessage: message.data.message, 
            topicTimestamp: message.data.consensusTimestamp.nanos 
        };
        setMessageCollection(messageCollection => [...messageCollection, messageObject])
    }

    const subscribeToTopic = () => {

        const requestPayload = WatchtowerService.getSubscriptionPayload(props.topicId, `100`);
        console.log(requestPayload);
        socket.emit(`subscribe`, requestPayload, (msg: any) => {           
            setStatusStreaming('Streaming & Listening...');
            socket.on(msg.listeners.data, function (message: any) {
                console.log(`message`);
                console.log(message)
                addMessageToCollection(message);
            });

            socket.on(msg.listeners.error, function (message: any) {
                setSocketError(message);
                console.log(`Error`);
                console.log(message)
            });
        });
    };

    
    useEffect(() => {
        socket.on(`connect`, () => {
            setStreamConnected(true);
            socket.on(`status`, (msg) => {
                console.log(`status`, msg);
            });
            socket.emit(`list-services`, (services: any) => {
                console.log(`services`, services);
            });
        });
        socket.on(`disconnect`, () => {
            setStreamConnected(false);
        });

        socket.on(`error`, (message) => {
            setSocketError(message);
        })
    }, [socket]);

    return (
        <>
            <Box display={'flex'} justifyContent={`space-between`}>
                <Typography variant="h6">
                    HCS Donator Ledger
                </Typography>
                <Button onClick={subscribeToTopic}>Connection  
                    { streamConnected ?
                            <WifiPasswordIcon></WifiPasswordIcon> :  <WifiOffIcon></WifiOffIcon>
                    }
                </Button>
            </Box>
            <Divider></Divider>
     
            <Box display={`flext`} justifyContent={`center`}>
                {
                    socketError && (
                        <Alert severity="error">{socketError}</Alert>
                    )
                }
                {
                    statusStreaming && (
                        <Alert sx={{marginBottom: theme.spacing(2)}} severity="info">{statusStreaming}</Alert>
                    )
                }
                {
                    messageCollection.length > 0 && (
                        <ArkhiaDataGrid
                            minHeight='250px'
                            rowsData={DataGridService.getLedgerData(messageCollection)}
                            columnDef={DataGridService.getLedgerColumns()}
                        />
                    )
                }
            </Box>
        </>
    );
}

export default Streaming;
