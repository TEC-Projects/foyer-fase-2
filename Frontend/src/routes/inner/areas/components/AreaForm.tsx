import React, { FunctionComponent } from 'react';
import {Box, Grid} from "@mui/material";
import CustomTextField from "../../../../components/fields/CustomTextField";
import {AddModifyArea, Story} from "../../../../types/area.types";
import CustomTextArea from "../../../../components/fields/CustomTextArea";
import StorySelector from "../../../../components/selector/StorySelector";
import FileUploadList from "../../../../components/fileUploadList/FileUploadList";
import {DownloadableFile, UploadableFile} from "../../../../types/common.types";

interface OwnProps {
    newAreaData:AddModifyArea,
    nameChangeHandler: (onChangeName:string) => void,
    storyChangeHandler: (onChangeStory:Story) => void,
    locationChangeHandler: (onChangeLocation:string) => void,
    descriptionChangeHandler: (onChangeDescription:string) => void,
    addImageChangeHandler: (onChangeImage: File | null) => void,
    removeImageChangeHandler: (onChangeImage: File| UploadableFile | DownloadableFile | null) => void,
}

type Props = OwnProps;

const AreaForm: FunctionComponent<Props> = (props) => {

    return (
        <Grid container spacing={4}>
            <Grid item xs={4}>
                <CustomTextField label={'Nombre del área'} value={props.newAreaData.name} changeHandler={props.nameChangeHandler}/>
            </Grid>
            <Grid item xs={4}>
                <StorySelector value={props.newAreaData.story} changeHandler={props.storyChangeHandler}/>
            </Grid>
            <Grid item xs={4}>
                <CustomTextField label={'Ubicación exacta'} value={props.newAreaData.location} changeHandler={props.locationChangeHandler}/>
            </Grid>
            <Grid item xs={4}>
                <CustomTextArea label={'Descripción'} value={props.newAreaData.description} changeHandler={props.descriptionChangeHandler}/>
            </Grid>
            <Grid item xs={4} sx={{marginTop:1}}>
                <FileUploadList
                    label={"Imágenes asociadas"}
                    uploadFileType={'image/png, image/jpg, image/jpeg'}
                    maxUploadCount={3}
                    fileList={props.newAreaData.imagesListing}
                    addChangeHandler={props.addImageChangeHandler}
                    removeChangeHandler={props.removeImageChangeHandler}/>
            </Grid>
        </Grid>
    );
};

export default AreaForm;
