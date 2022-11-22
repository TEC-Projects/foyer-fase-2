import React, {FunctionComponent, useContext, useEffect, useState} from 'react';
import {Button, Grid, Stack, Typography, useTheme} from "@mui/material";
import SuggestedActionSelector from "../../../../components/selector/SuggestedActionSelector";
import FileUploadList from "../../../../components/fileUploadList/FileUploadList";
import {useApolloClient} from "@apollo/client";
import Context from "../../../../context/Context";
import {useNavigate} from "react-router-dom";
import {getSessionData} from "../../../../util/sessionDataUtil";
import {Actions, AdminCloseInspection, Inspection} from "../../../../types/inspection.types";
import {DownloadableFile, UploadableFile} from "../../../../types/common.types";
import {adminCloseInspection} from "../../../../graphQL/Functions/inspection";
import {toBeInspectedTypeFormatter} from "../../../../util/formatterUtil";
import {ToBeInspected} from "../../../../types/area.types";

interface OwnProps {
    inspectionDetail: Inspection,
}

type Props = OwnProps;

const AdminCloseInspectionForm: FunctionComponent<Props> = (props) => {

    const apolloClient = useApolloClient();
    const {showSnackbar} = useContext(Context)
    const navigate = useNavigate();
    const theme = useTheme();

    const [closeInspection, setCloseInspection] = useState<AdminCloseInspection>({
        id: '',
        suggestedAction: '',
        documentsListing: []
    });

    const suggestedActionChangeHandler = (actionOnChange : Actions | string) : void => {
        setCloseInspection({
            ...closeInspection,
            suggestedAction: actionOnChange,
        })
    }

    const addDocumentListingChangeHandler = (onChangeDocument : File | null) : void => {
        if(onChangeDocument?.type === 'application/pdf'){
            let newDocumentListing:Array<File | null> = [];
            newDocumentListing.push(onChangeDocument)
            setCloseInspection({
                ...closeInspection,
                documentsListing: newDocumentListing
            })
        }else{
            showSnackbar('Por favor adjunte un archivo de formato PDF',  'warning')
        }
    }

    const removeDocumentListingChangeHandler = (onChangeDocument : File | UploadableFile | DownloadableFile | null) : void => {
        setCloseInspection({
            ...closeInspection,
            documentsListing: []
        })
    }

    useEffect(() => {
        setCloseInspection({
            ...closeInspection,
            id: props.inspectionDetail.id
        })
    }, [props.inspectionDetail]);

    const handleCloseInspection = async () : Promise<void> => {
        try {
            await adminCloseInspection(apolloClient, closeInspection, getSessionData()?.user.id, navigate)
        }catch (e : unknown) {
            showSnackbar((e as Error).toString().replace('Error: ',  ''), 'warning')
        }
    }

    return (
        <Stack>
            <Typography variant='h4' fontWeight='bold' marginBottom={4}>FINALIZAR INSPECCIÓN</Typography>
            <Grid container spacing={4}>
                <Grid item xs={4}>
                    <Stack gap={4}>
                        <Stack>
                            <Typography variant='h6' fontWeight='bold'>Inspección No. {props.inspectionDetail.id}</Typography>
                            <Typography fontWeight='bold' color={theme.palette.primary.main}>{toBeInspectedTypeFormatter(props.inspectionDetail.toBeInspected?.type as ToBeInspected) + ': ' + props.inspectionDetail.toBeInspected?.name}</Typography>
                        </Stack>
                        <SuggestedActionSelector value={closeInspection.suggestedAction} changeHandler={suggestedActionChangeHandler}/>
                        <FileUploadList
                            label={"Reporte de inspección"}
                            uploadFileType={'application/pdf'}
                            maxUploadCount={1}
                            fileList={closeInspection.documentsListing}
                            addChangeHandler={addDocumentListingChangeHandler}
                            removeChangeHandler={removeDocumentListingChangeHandler}
                        />
                        <Button
                            onClick={handleCloseInspection}
                            variant='contained'
                            sx={{
                                width:'100%',
                                paddingY: 2,
                            }}
                        >FINALIZAR INSPECCIÓN</Button>
                    </Stack>
                </Grid>
            </Grid>
        </Stack>

    );
};

export default AdminCloseInspectionForm;
