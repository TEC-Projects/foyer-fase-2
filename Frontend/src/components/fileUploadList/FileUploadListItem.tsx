import React, {FunctionComponent, useEffect, useState} from 'react';
import {Box, Stack, IconButton, Typography} from "@mui/material";
import {InsertDriveFile, Image, Close} from "@mui/icons-material";
import {fileNameFormatter} from "../../util/formatterUtil";
import {DownloadableFile, UploadableFile} from "../../types/common.types";

interface OwnProps {
    fileData:File | UploadableFile | DownloadableFile | null
    removeChangeHandler: (onChangeFile: File | UploadableFile | DownloadableFile | null) => void,
    isElementField?:Boolean,
    globalIdChangeHandler?:Function,
    currentId?:number,
    backgroundColor?:string | null,
}

type Props = OwnProps;

const FileUploadListItem: FunctionComponent<Props> = (props) => {

    const [changeTrigger, setChangeTrigger] = useState<number>(0);

    const fileIcon = (props.fileData as File)?.type === 'application/pdf' ? <InsertDriveFile/> : <Image/>
    const buttonBackgroundColor = props.backgroundColor ? props.backgroundColor : '#f1f1f1'

    const handleDeleteUploadedFile = () => {
        if(props.isElementField && props.globalIdChangeHandler){
            props.globalIdChangeHandler(props.currentId)
        }
        setChangeTrigger(Math.random())
    }

    useEffect(() => {
        if(changeTrigger != 0){
            props.removeChangeHandler(props.fileData)
        }
    }, [changeTrigger]);


    return (
        <Stack
            sx={{
                width:100,
                height:100,
                borderRadius:1,
                backgroundColor:buttonBackgroundColor,
                display:'flex',
                padding:1,
            }}
        >
            <IconButton
                sx={{alignSelf:'flex-end', width:25, height:25}}
                aria-label="upload picture"
                component="label"
                onClick={handleDeleteUploadedFile}
                >
                <Close/>
            </IconButton>
            <Stack
                sx={{display:'flex', alignItems:'center', justifyContent:'center'}}
            >
                {fileIcon}
                <Typography>{fileNameFormatter(props.fileData?.name as string, 10)}</Typography>
            </Stack>
        </Stack>
    );
};

export default FileUploadListItem;
