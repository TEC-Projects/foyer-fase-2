import React, { FunctionComponent } from 'react';
import {Grid, Stack, Typography} from "@mui/material";
import {InspectionUpdate} from "../../../../types/inspection.types";
import InspectionUpdateHistoryItem from "./InspectionUpdateHistoryItem";
import EmptyListing from "../../../../components/EmptyListing";

interface OwnProps {
    updateHistory:Array<InspectionUpdate>
}

type Props = OwnProps;

const InspectionUpdateHistory: FunctionComponent<Props> = (props) => {

    return (
        <Stack
            gap={2}
            sx={{
                padding:4,
                borderRadius:1,
                backgroundColor:'#f1f1f1',
            }}
        >
            <Typography variant='h5' fontWeight='bold'>Historial de modificaciones</Typography>
            <Stack>
                <Grid container spacing={8} sx={{marginBottom:1}}>
                    <Grid item xs={4}>
                        <Typography fontWeight='bold'>Autor de la modificación</Typography>
                    </Grid>
                    <Grid item xs={4}>
                        <Typography fontWeight='bold'>Tipo</Typography>
                    </Grid>
                    <Grid item xs={4}>
                        <Typography fontWeight='bold'>Fecha</Typography>
                    </Grid>
                </Grid>
                {
                    props.updateHistory.length > 0 ?
                        props.updateHistory.map((update:InspectionUpdate) => {
                            return(<InspectionUpdateHistoryItem update={update}/>);
                        })
                    :
                        <EmptyListing emptyListingMessage={'Al parecer no se han realizado modificaciones a esta inspección.'}/>
                }
            </Stack>
        </Stack>
    );
};

export default InspectionUpdateHistory;
