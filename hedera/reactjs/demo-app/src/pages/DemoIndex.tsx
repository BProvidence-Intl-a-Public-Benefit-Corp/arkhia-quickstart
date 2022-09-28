import ActionAreaCard from '@/components/generic/action.card';
import { routes } from '@/constants/demoLinks';
import { ActionCardContent } from '@/types/demo';
import {
    Grid,
    useTheme
} from '@mui/material';
import React from 'react';

export default function DemoIndex () {
    // const navigate = useNavigate();
    const theme = useTheme();
    const urlPath = `./src/assets/generic`;
    
    const actionCardContent: ActionCardContent[] = [
        {
            title : `FairTradeCoffee`,
            description: `Maria wants to help her coffee farming community with the power of Hedera.`,
            imageUrl: `${urlPath}/fair.trade.snapshot.png`,
            demoLink: routes.fairTradeCoffee.demo,
            exerciseLink: routes.fairTradeCoffee.exercise,
            tutorialLink: routes.fairTradeCoffee.tutorial
        }
    ];

    return <>
        <Grid container spacing={2} sx={{ p: String(theme.spacing(0, 0)) }}>
            <Grid item xs={6} md={4}>
                <ActionAreaCard {...actionCardContent[0]} />
            </Grid>
        </Grid>
    </>;
}



