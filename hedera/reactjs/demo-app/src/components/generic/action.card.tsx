import { ActionCardContent } from '@/types/demo';
import {
    Box,
    Button,
    CardActionArea,
    CardMedia,
    useTheme
} from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import * as React from 'react';


export default function ActionAreaCard (props: ActionCardContent) {
    const theme = useTheme();

    return (
        <Card >
            <CardActionArea>
                <CardMedia
                    component="img"
                    image={props.imageUrl}
                    alt="Arkhia demo instance"
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        {props.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {props.description}
                    </Typography>
                    <Box display="flex" justifyContent="space-between" sx={{  p: String(theme.spacing(1,1)) }}>
                        <Button
                            sx={{
                                borderColor: `white`, borderWidth:`1em`
                            }}
                            href={props.tutorialLink}
                            target="_blank"
                        >Tutorial</Button>
                        <Button href={props.demoLink}>Demo</Button>
                        <Button href={props.exerciseLink}>Exercise</Button>
                    </Box>
                </CardContent>
            </CardActionArea>
        </Card>);
}
