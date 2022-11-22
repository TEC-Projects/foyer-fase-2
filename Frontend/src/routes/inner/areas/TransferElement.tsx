import React, {FunctionComponent, useContext, useState} from 'react';
import {Box, Button, Grid, Stack, Typography, useTheme} from "@mui/material";
import GoBackButton from "../../../components/buttons/GoBackButton";
import {useLocation, useNavigate} from "react-router-dom";
import AreaSelector from "../../../components/selector/AreaSelector";
import {transferElement} from "../../../graphQL/Functions/area";
import {useApolloClient} from "@apollo/client";
import Context from "../../../context/Context";

interface OwnProps {}

type Props = OwnProps;

const TransferElement: FunctionComponent<Props> = (props) => {

    const location = useLocation();
    const theme = useTheme();
    const navigate = useNavigate()
    const apolloClient = useApolloClient();
    const {showSnackbar} = useContext(Context);

    const [destinationAreaId, setDestinationAreaId] = useState<string>('');

    const handleTransferElement = async () => {
        try {
            await transferElement(apolloClient, location.state.elementId.split('-')[0], destinationAreaId, location.state.elementId, navigate)
        }catch (e : unknown) {
            showSnackbar((e as Error).toString().replace('Error: ',  ''), 'warning')
        }
    }

    return (
        <Box>
            <GoBackButton/>
            <Typography variant='h4' fontWeight='bold' marginBottom={4}>TRANSFERIR ELEMENTO</Typography>
            <Grid container spacing={4}>
                <Grid item xs={4}>
                    <Stack gap={4}>
                        <Stack>
                            <Typography variant='h6' fontWeight='bold' sx={{marginBottom:2}}>Elemento: {location.state.elementName}</Typography>
                            <Typography>Código del elemento: {location.state.elementId}</Typography>
                            <Typography fontWeight='bold' color={theme.palette.primary.main}>Área actual: {location.state.parentArea}</Typography>
                        </Stack>
                        <AreaSelector label={'Área de destino'} value={destinationAreaId} changeHandler={setDestinationAreaId}/>
                        <Button
                            variant='contained'
                            onClick={handleTransferElement}
                            sx={{
                                height:56
                            }}
                        >Transferir elemento</Button>
                    </Stack>
                </Grid>
            </Grid>
        </Box>
    );
};

export default TransferElement;
