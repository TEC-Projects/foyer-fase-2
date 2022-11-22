import React, { FunctionComponent } from 'react';
import {Box, Button, Stack, Typography, Grid} from "@mui/material";
import {useNavigate} from "react-router-dom";
import OuterNavBar from "../../components/nav/OuterNavBar";


interface OwnProps {}

type Props = OwnProps;



const NotFound: FunctionComponent<Props> = (props) => {

    const navigate = useNavigate();

    return (
        <Box>
            <OuterNavBar/>
            <Grid
                container
                alignItems="center"
                justifyContent="center"
                style={{ minHeight: '70vh' }}
            >
                <Grid item xs={6}>
                    <Stack sx={{gap:4}}>
                        <Typography variant='h1' fontWeight='bold'>Error 404</Typography>
                        <Typography variant='h3' display="block">Al parecer esta dirección no existe.</Typography>
                        <Button
                            variant='contained'
                            sx={{color:'white', width:'50%'}}
                            onClick={() => navigate('/')}
                        >Volver al inicio</Button>
                    </Stack>
                </Grid>
            </Grid>
        </Box>
    );
};

export default NotFound;
