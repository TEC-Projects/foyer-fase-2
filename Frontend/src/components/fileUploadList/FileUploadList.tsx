import React, { FunctionComponent } from 'react';
import {Stack, Typography} from "@mui/material";
import FileUploadListItem from "./FileUploadListItem";
import UploadButton from "./UploadButton";
import {DownloadableFile, UploadableFile} from "../../types/common.types";

interface OwnProps {
    label:string,
    uploadFileType:string,
    maxUploadCount:number,
    fileList:Array<File | UploadableFile | DownloadableFile | null>,
    addChangeHandler: (onChangeFile: File | null, onChangeElementId?:number) => void
    removeChangeHandler: (onChangeFile: File | UploadableFile | DownloadableFile | null, onChangeElementId?:number) => void,
    globalIdChangeHandler?:Function,
    currentElementId?:number,
}

type Props = OwnProps;

const FileUploadList: FunctionComponent<Props> = (props) => {

    return (
        <Stack gap={1} mt={-1}>
            <Typography>{props.label}</Typography>
            <Stack direction='row' gap={4}>
                {
                    props.fileList.map((file ) => {
                        return (<FileUploadListItem
                            fileData={file}
                            removeChangeHandler={props.removeChangeHandler}
                            isElementField={true}
                            globalIdChangeHandler={props.globalIdChangeHandler}
                            currentId={props.currentElementId}
                            backgroundColor={props.currentElementId != null ? '#d1d1d1' : null}
                        />);
                    })
                }
                {
                    props.fileList.length < props.maxUploadCount ?
                        <UploadButton
                            fileType={props.uploadFileType}
                            addChangeHandler={props.addChangeHandler}
                            isElementField={true}
                            globalIdChangeHandler={props.globalIdChangeHandler}
                            currentId={props.currentElementId}
                        />
                        :
                        null
                }
            </Stack>
        </Stack>
    );
};

export default FileUploadList;
