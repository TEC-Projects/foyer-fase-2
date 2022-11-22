import React, {FunctionComponent, useContext, useEffect, useState} from 'react';
import {Grid, Stack, Typography, useTheme} from "@mui/material";
import GoBackButton from "../../../../components/buttons/GoBackButton";
import {getInspectionDetail, peekCloseInspectionDraft} from "../../../../graphQL/Functions/inspection";
import {useApolloClient} from "@apollo/client";
import {Actions, Inspection, OperativeCloseInspection} from "../../../../types/inspection.types";
import Context from "../../../../context/Context";
import {useLocation} from "react-router-dom";
import {SpoilageAgent} from "../../../../types/spoilageAgent.types";
import {actionsTypeFormatter, toBeInspectedTypeFormatter} from "../../../../util/formatterUtil";
import {ToBeInspected} from "../../../../types/area.types";
import EmptyListing from "../../../../components/EmptyListing";
import DamageReport from "./DamageReport";

interface OwnProps {}

type Props = OwnProps;

const PeekCloseInspectionForm: FunctionComponent<Props> = (props) => {

    const apolloClient = useApolloClient();
    const {showSnackbar} = useContext(Context);
    const location = useLocation();
    const theme = useTheme();

    const [closeInspection, setCloseInspection] = useState<OperativeCloseInspection>({
        id:"",
        suggestedAction: "",
        damageListing:[{
            id:"0",
            spoilageAgentId:"7",
            observations:"",
            recommendations:"",
            image:[],
        }],
        hasDraftBeenFound:false,
    });

    useEffect(() => {
        try {
            peekCloseInspectionDraft(apolloClient, location.state.inspectionDetail.id, setCloseInspection);
        }catch (e : unknown) {
            showSnackbar((e as Error).toString().replace('Error: ',  ''), 'warning')
        }
    }, [])


    return (
        <Stack>
            <GoBackButton/>
            <Typography variant='h4' fontWeight='bold' >REPORTE DE CIERRE</Typography>
            {
                closeInspection.hasDraftBeenFound ?
                    <Typography>Reporte generado por: {location.state.inspectionDetail.responsible.name}</Typography>
                :
                    null

            }
            <Stack my={4}>
                <Typography variant='h6' fontWeight='bold'>Inspección No. {location.state.inspectionDetail.id}</Typography>
                <Typography fontWeight='bold' color={theme.palette.primary.main}>{toBeInspectedTypeFormatter(location.state.inspectionDetail.toBeInspected?.type as ToBeInspected) + ': ' + location.state.inspectionDetail.toBeInspected?.name}</Typography>
            </Stack>
            {
                closeInspection.hasDraftBeenFound ?
                    <Stack>
                        <Typography fontWeight='bold'>Acción resultante:<Typography>{ actionsTypeFormatter(closeInspection.suggestedAction as Actions)}</Typography></Typography>
                        <Stack gap={4} sx={{my:4}}>
                            <Typography variant='h5' fontWeight='bold'>Registro de daños</Typography>
                            {
                                closeInspection.damageListing.length?
                                    closeInspection.damageListing.filter((damage => !damage.hasBeenDeleted)).map((damage) => {
                                        return (
                                            <DamageReport damage={damage}/>
                                        )
                                    })
                                    :
                                    <EmptyListing emptyListingMessage={'Al parecer no hay daños registrados en la inspección.'}/>
                            }
                        </Stack>
                    </Stack>
            :
                <EmptyListing emptyListingMessage={'Al parecer no se ha generado un reporte para esta inspección.'}/>
            }
        </Stack>

    );
};

export default PeekCloseInspectionForm;
