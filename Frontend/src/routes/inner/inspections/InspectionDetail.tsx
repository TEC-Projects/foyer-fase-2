import React, {FunctionComponent, useContext, useEffect, useState} from 'react';
import {Box, Grid, Stack, Typography, useTheme} from "@mui/material";
import GoBackButton from "../../../components/buttons/GoBackButton";
import Header from "../../../components/Header";
import {useNavigate, useParams} from "react-router-dom";
import {Inspection, Status} from "../../../types/inspection.types";
import {getInspectionDetail} from "../../../graphQL/Functions/inspection";
import {useApolloClient} from "@apollo/client";
import Context from "../../../context/Context";
import {
    actionsTypeFormatter,
    dateFormatter,
    statusTypeFormatter,
    toBeInspectedTypeFormatter
} from "../../../util/formatterUtil";
import UnderlineButton from "../../../components/buttons/UnderlineButton";
import DownloadableFileList from "../../../components/downloadableList/DownloadableFileList";
import InspectionUpdateHistory from "./inspectionUpdateHistory/InspectionUpdateHistory";
import {getSessionData} from "../../../util/sessionDataUtil";
import {ToBeInspected} from "../../../types/area.types";

interface OwnProps {}

type Props = OwnProps;

const InspectionDetail: FunctionComponent<Props> = (props) => {

    const theme = useTheme();
    const {inspectionId} = useParams();
    const apolloClient = useApolloClient()
    const {showSnackbar} = useContext(Context);
    const navigate = useNavigate();

    const [inspectionDetail, setInspectionDetail] = useState<Inspection>({
        id:inspectionId as string,
        toBeInspected: undefined,
        responsible: {
            name: '',
            id: '',
        },
        status: undefined,
        startDate: new Date(),
        endDate: new Date(),
        closeDate: new Date(),
        action: null,
        updateLog: [],
        documentsListing: [],
    });

    useEffect(() => {
        getInspectionDetail(apolloClient, setInspectionDetail, inspectionId as string).catch((e : unknown) => {
            showSnackbar((e as Error).toString().replace('Error: ',  ''), 'warning')
        })
    }, [])

    const sessionData = getSessionData();
    const toBeInspectedDetailRoute = inspectionDetail?.toBeInspected?.type === 'AREA' ? '/areas/' + inspectionDetail?.toBeInspected?.id : '/areas/' + inspectionDetail?.toBeInspected?.id.split('-')[0] + '/element/' + inspectionDetail?.toBeInspected?.id;
    const closeDate = inspectionDetail.closeDate ? dateFormatter(inspectionDetail.closeDate, 'long') : 'Inspección en curso';
    const suggestedAction = inspectionDetail.action ? actionsTypeFormatter(inspectionDetail.action) : 'Inspección en curso';
    const showCloseInspectionButton = inspectionDetail.closeDate === null && ((sessionData?.user?.type === 'ADMIN_USER' && inspectionDetail.status === 'LATE') || sessionData?.user?.type === 'OPERATIVE_USER');
    const showPeeKCloseInspectionFormButton = inspectionDetail.closeDate === null && ((sessionData?.user?.type === 'ADMIN_USER' && inspectionDetail.status === 'IN_PROGRESS'));
    const showModifyInspectionButton = sessionData?.user?.type === 'ADMIN_USER';

    return (
        <Box>
            <GoBackButton/>
            <Header
                title={'Inspección No. ' + inspectionId}
                showFirstButton={showModifyInspectionButton}
                firstButtonLabel={'Modificar inspección'}
                firstButtonNavigationRoute={'modify-inspection'}
                firstButtonParams={{
                    inspectionDetail
                }}
                showSecondButton={showCloseInspectionButton || showPeeKCloseInspectionFormButton}
                secondButtonLabel={showCloseInspectionButton ? 'Finalizar inspección' : 'Supervisar cierre'}
                secondButtonNavigationRoute={showCloseInspectionButton ? 'close-inspection' : 'peek-close-inspection-form'}
                secondButtonStyle={'outlined'}
                secondButtonParams={{
                    inspectionDetail
                }}
            />
            <Grid container spacing={4}>
                <Grid item xs={8}>
                    <Typography fontWeight='bold' color={theme.palette.primary.main} sx={{marginBottom:4}}>{statusTypeFormatter(inspectionDetail.status as Status)}</Typography>
                    <Grid  container spacing={4} sx={{marginBottom:8}}>
                        <Grid item xs={6}>
                            <Stack gap={2}>
                                <Box>
                                    <Typography fontWeight='bold'>{toBeInspectedTypeFormatter(inspectionDetail.toBeInspected?.type as ToBeInspected)}:</Typography>
                                    <Box sx={{display:'flex', alignItems:'center', marginY:-1}}>
                                        <Typography>{inspectionDetail?.toBeInspected?.name}</Typography>
                                        <UnderlineButton label={'ver detalle'} action={() => navigate(toBeInspectedDetailRoute)} buttonTextColor={theme.palette.primary.main} buttonBackgroundColor={'white'}/>
                                    </Box>
                                </Box>
                                <Typography fontWeight='bold'>Encargado:<Typography>{inspectionDetail.responsible.name}</Typography></Typography>
                                <Typography fontWeight='bold'>Acción resultante:<Typography>{suggestedAction}</Typography></Typography>
                            </Stack>
                        </Grid>
                        <Grid item xs={6}>
                            <Stack gap={2}>
                                <Typography fontWeight='bold'>Fecha de inicio:<Typography>{dateFormatter(inspectionDetail.startDate, 'long')}</Typography></Typography>
                                <Typography fontWeight='bold'>Fecha de fin:<Typography>{dateFormatter(inspectionDetail.endDate, 'long')}</Typography></Typography>
                                <Typography fontWeight='bold'>Fecha de cierre:<Typography>{closeDate}</Typography></Typography>
                            </Stack>
                        </Grid>
                    </Grid>
                    <InspectionUpdateHistory updateHistory={inspectionDetail.updateLog}/>
                </Grid>
                <Grid item xs={4}>
                    <Typography variant='h5' fontWeight='bold'>Documentos aportados</Typography>
                    <DownloadableFileList downloadableFileList={inspectionDetail.documentsListing}/>
                </Grid>
            </Grid>
        </Box>
    );
};

export default InspectionDetail;
