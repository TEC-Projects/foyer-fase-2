import React, { FunctionComponent } from 'react';
import {Box, Grid, Stack} from "@mui/material";
import CustomTextField from "../../../../components/fields/CustomTextField";
import CustomTextArea from "../../../../components/fields/CustomTextArea";
import FileUploadList from "../../../../components/fileUploadList/FileUploadList";
import {AddModifyElement} from "../../../../types/area.types";
import {DownloadableFile, UploadableFile} from "../../../../types/common.types";
import RemoveButton from "../../../../components/buttons/RemoveButton";

interface OwnProps {
    newElementData:AddModifyElement,
    nameChangeHandler: (onChangeName:string) => void,
    locationChangeHandler: (onChangeLocation:string) => void,
    descriptionChangeHandler: (onChangeDescription:string) => void,
    addImageChangeHandler: (onChangeImage:File | null) => void,
    removeImageChangeHandler: (onChangeImage:File | UploadableFile | DownloadableFile | null) => void,
    transactionElementIdChangeHandler: (onChangeId:number) => void,
    removeElementChangeHandler: (onChangeElementId:number) => void,
}

type Props = OwnProps;

const ElementForm: FunctionComponent<Props> = (props) => {

    return (
        <Stack
            direction='row'
            gap={4}
            sx={{
                backgroundColor:'#f1f1f1',
                padding:4,
                borderRadius:1,
            }}
        >
            <RemoveButton handleClick={() => props.removeElementChangeHandler(props.newElementData.id as number)} backgroundColor={'#f1f1f1'}/>
            <Box sx={{flex:1}}>
                <Grid container spacing={4}>
                    <Grid item xs={4} sx={{marginBottom:4}}>
                        <CustomTextField
                            label={'Nombre del elemento'}
                            value={props.newElementData.name}
                            changeHandler={props.nameChangeHandler}
                            isElementField={true}
                            elementIdChangeHandler={props.transactionElementIdChangeHandler}
                            currentElementId={props.newElementData.id}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <CustomTextField
                            label={'Ubicación exacta'}
                            value={props.newElementData.location}
                            changeHandler={props.locationChangeHandler}
                            isElementField={true}
                            elementIdChangeHandler={props.transactionElementIdChangeHandler}
                            currentElementId={props.newElementData.id}
                        />
                    </Grid>
                </Grid>
                <Grid container spacing={4}>
                    <Grid item xs={4}>
                        <CustomTextArea
                            label={'Descripción'}
                            value={props.newElementData.description}
                            changeHandler={props.descriptionChangeHandler}
                            isElementField={true}
                            globalIdChangeHandler={props.transactionElementIdChangeHandler}
                            currentId={props.newElementData.id}
                        />
                    </Grid>
                    <Grid item xs={4} sx={{marginTop:1}}>
                        <FileUploadList
                            label={"Imágenes asociadas"}
                            uploadFileType={'image/png, image/jpg, image/jpeg'}
                            maxUploadCount={3}
                            fileList={props.newElementData.imagesListing}
                            addChangeHandler={props.addImageChangeHandler}
                            removeChangeHandler={props.removeImageChangeHandler}
                            globalIdChangeHandler={props.transactionElementIdChangeHandler}
                            currentElementId={props.newElementData.id}
                        />
                    </Grid>
                </Grid>
            </Box>
        </Stack>
    );
};

export default ElementForm;
