import React, {FunctionComponent, useContext, useEffect, useState} from 'react';
import {Button, Grid, Stack, Typography, useTheme} from "@mui/material";
import GoBackButton from "../../../components/buttons/GoBackButton";
import SuggestedActionSelector from "../../../components/selector/SuggestedActionSelector";
import FileUploadList from "../../../components/fileUploadList/FileUploadList";
import {useApolloClient} from "@apollo/client";
import Context from "../../../context/Context";
import {useLocation, useNavigate} from "react-router-dom";
import {Actions, PlanModifyInspection} from "../../../types/inspection.types";
import {DownloadableFile, UploadableFile} from "../../../types/common.types";
import {modifyInspection as modifyInspectionFunction} from "../../../graphQL/Functions/inspection";
import CustomDateField from "../../../components/fields/CustomDateField";
import CustomTextField from "../../../components/fields/CustomTextField";
import {getSessionData} from "../../../util/sessionDataUtil";
import {toBeInspectedTypeFormatter} from "../../../util/formatterUtil";
import {ToBeInspected} from "../../../types/area.types";

interface OwnProps {}

type Props = OwnProps;

const ModifyInspection: FunctionComponent<Props> = (props) => {

    const apolloClient = useApolloClient();
    const {showSnackbar} = useContext(Context)
    const navigate = useNavigate();
    const location = useLocation()
    const theme = useTheme();

    const [fileUpdate, setFileUpdate] = useState<Array<UploadableFile | File | null>>([]);

    const [modifyInspection, setModifyInspection] = useState<PlanModifyInspection>({
        id: '',
        startDate: null,
        endDate: null,
        responsibleId: '',
        suggestedAction: 'RESTORATION',
    });

    const handleResponsibleIdChange = (onChangeId: string) : void => {
        setModifyInspection({
            ...modifyInspection,
            responsibleId: onChangeId,
        })
    }

    const handleSuggestedActionChange = (onChangeStatus: Actions | null | string) : void => {
        setModifyInspection({
            ...modifyInspection,
            suggestedAction: onChangeStatus as Actions,
        })
    }

    const handleAddDocumentListing = (onChangeDocument : File | null) : void => {
        if(onChangeDocument?.type === 'application/pdf'){
            let newDocumentListing:Array<File | null> = [];
            newDocumentListing.push(onChangeDocument)
            setFileUpdate(newDocumentListing)
        }else{
            showSnackbar('Por favor adjunte un archivo de formato PDF',  'warning')
        }
    }

    const handleRemoveDocumentListing = (onChangeDocument : File | UploadableFile | DownloadableFile | null) : void => {
        setFileUpdate([])
    }

    const handleStartDateChange = (onChangeDate : Date | null) : void => {
        if(modifyInspection.endDate && modifyInspection.endDate < (onChangeDate as Date)){
            showSnackbar('Por favor ingresar una fecha de inicio anterior a la de fin', 'warning')
        }else{
            setModifyInspection({
                ...modifyInspection,
                startDate: onChangeDate
            })
        }

    }

    const handleEndDateChange = (onChangeDate : Date | null) : void => {
        if(modifyInspection.startDate && modifyInspection.startDate > (onChangeDate as Date)){
            showSnackbar('Por favor ingresar una fecha de fin posterior a la de inicio', 'warning')
        }else{
            setModifyInspection({
                ...modifyInspection,
                endDate: onChangeDate
            })
        }
    }

    const handleFileUpdateTransformation = () : Array<File> => {
        let fileList : Array<File> = []
        if(fileUpdate[0]){
            if((fileUpdate[0] as File).lastModified){
                fileList.push(fileUpdate as unknown as File)
            }
        }else{
            throw new Error("Por favor adjunte un documento de resultados")
        }
        return fileList;
    }

    useEffect(() => {
        let suggestedAction : Actions | null;
        let files :Array<UploadableFile | File | null> = []

        if(location.state.inspectionDetail.closeDate){
            suggestedAction = location.state.inspectionDetail.action;
            files = location.state.inspectionDetail.documentsListing.map((file:DownloadableFile) =>
                ({
                    name: file.name,
                    type: file.name.slice(-3) === 'pdf' ? 'application/pdf' : 'image'
                }));
        }else{
            suggestedAction = null
            files = [{name:'', type:''}]
        }

        setModifyInspection({
            ...modifyInspection,
            id: location.state.inspectionDetail.id,
            startDate: location.state.inspectionDetail.startDate,
            endDate: location.state.inspectionDetail.endDate,
            responsibleId: location.state.inspectionDetail.responsible.id,
            suggestedAction,
        });

        setFileUpdate(files)

    }, [location.state]);


    const handleModifyInspection = async () : Promise<void> => {
        try {
            const fileList : Array<File> = handleFileUpdateTransformation()
            await modifyInspectionFunction(apolloClient, modifyInspection, fileList, getSessionData()?.user.id, navigate)
        }catch (e : unknown) {
            showSnackbar((e as Error).toString().replace('Error: ',  ''), 'warning')
        }
    }

    return (
        <Stack>
            <GoBackButton/>
            <Typography variant='h4' fontWeight='bold' marginBottom={4}>MODIFICAR INSPECCIÓN</Typography>
            <Stack sx={{marginBottom:4}}>
                <Typography variant='h6' fontWeight='bold'>Inspección No. {location.state.inspectionDetail.id}</Typography>
                <Typography fontWeight='bold' color={theme.palette.primary.main}>{toBeInspectedTypeFormatter(location.state.inspectionDetail.toBeInspected?.type as ToBeInspected) + ': ' + location.state.inspectionDetail.toBeInspected.name}</Typography>
            </Stack>
            <Grid container spacing={8}>
                <Grid item xs={4}>
                    <Stack gap={4}>
                        <CustomDateField label={'Fecha de inicio'} value={modifyInspection.startDate} changeHandler={handleStartDateChange} maxDate={null} minDate={null}/>
                        <CustomDateField label={'Fecha de fin'} value={modifyInspection.endDate} changeHandler={handleEndDateChange} maxDate={null} minDate={null}/>
                        <CustomTextField label={'Identificación del encargado'} value={modifyInspection.responsibleId} changeHandler={handleResponsibleIdChange}/>
                        <Button
                            onClick={handleModifyInspection}
                            variant='contained'
                            sx={{
                                width:'100%',
                                paddingY: 2,
                            }}
                        >MODIFICAR INSPECCIÓN</Button>
                    </Stack>
                </Grid>
                {
                    location.state.inspectionDetail.closeDate ?
                        <Grid item xs={4}>
                            <Stack gap={4} sx={{marginTop:-1}}>
                                <SuggestedActionSelector value={modifyInspection.suggestedAction as string} changeHandler={handleSuggestedActionChange}/>
                                <FileUploadList
                                    label={"Imágenes asociadas"}
                                    uploadFileType={'application/pdf'}
                                    maxUploadCount={1}
                                    fileList={fileUpdate}
                                    addChangeHandler={handleAddDocumentListing}
                                    removeChangeHandler={handleRemoveDocumentListing}
                                />
                            </Stack>
                        </Grid>
                    :
                        null
                }
            </Grid>
        </Stack>
    );
};

export default ModifyInspection;
