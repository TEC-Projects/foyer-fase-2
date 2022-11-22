import React, { FunctionComponent } from 'react';
import {Box, Grid, Stack, Typography, useTheme} from "@mui/material";
import {InspectionListingItem} from "../../../../types/inspection.types";
import {Link} from "react-router-dom";
import {dateFormatter, statusTypeFormatter} from "../../../../util/formatterUtil";

interface OwnProps {
    inspectionData:InspectionListingItem
}

type Props = OwnProps;

const InspectionsListItem: FunctionComponent<Props> = (props) => {

    const theme = useTheme();

    const toBeInspectedType = props.inspectionData.toBeInspected.type === 'AREA' ? 'Área: ' : 'Elemento: ';
    const toBeInspectedDetailRoute = props.inspectionData.toBeInspected.type === 'AREA' ? '/areas/' + props.inspectionData.toBeInspected.id : '/areas/' + props.inspectionData.toBeInspected.id.split('-')[0] + '/element/' + props.inspectionData.toBeInspected.id;

    return (
        <Grid item xs={6}>
            <Box
                sx={{
                    backgroundColor:'#f1f1f1',
                    borderRadius:1,
                    padding:4,
                }}
            >
                <Grid
                    container
                    spacing={8}
                >
                    <Grid item xs={6}>
                        <Stack gap={1}>
                            <Link to={props.inspectionData.id} style={{ textDecoration: 'none', color:'black' }}>
                                <Typography variant='h5' fontWeight='bold' sx={{marginBottom:1, '&:hover':{textDecoration: 'underline'}}}>Inspección no. {props.inspectionData.id}</Typography>
                            </Link>
                            <Typography sx={{display:'flex'}}>
                                {toBeInspectedType}
                                <Link to={toBeInspectedDetailRoute} style={{ textDecoration: 'none', color:'black'}}>
                                    <Typography sx={{marginLeft:0.5, '&:hover':{textDecoration: 'underline'}}}>  {props.inspectionData.toBeInspected.name}</Typography>
                                </Link>
                            </Typography>
                            <Typography>Encargado: {props.inspectionData.responsible.name}</Typography>
                        </Stack>
                    </Grid>
                    <Grid item xs={6}>
                        <Stack gap={1}>
                            <Typography fontWeight='bold' color={theme.palette.primary.main} sx={{marginBottom:1, marginTop:1}}>{statusTypeFormatter(props.inspectionData.status)}</Typography>
                            <Typography>Fecha de inicio: {dateFormatter(props.inspectionData.startDate, 'short')}</Typography>
                            <Typography>Fecha de fin: {dateFormatter(props.inspectionData.endDate, 'short')}</Typography>
                        </Stack>
                    </Grid>
                </Grid>
            </Box>
        </Grid>
    );
};

export default InspectionsListItem;
