import React, { FunctionComponent } from 'react';
import {DownloadableFile} from "../../types/common.types";
import {Stack} from "@mui/material";
import DownloadableFileListItem from "./DownloadableFileListItem";
import EmptyListing from "../EmptyListing";

interface OwnProps {
    downloadableFileList:Array<DownloadableFile>
}

type Props = OwnProps;

const DownloadableFileList: FunctionComponent<Props> = (props) => {

    return (
        <Stack gap={2} sx={{marginTop:4}}>
            {
                props.downloadableFileList.length > 0 ?
                    props.downloadableFileList.map((document:DownloadableFile) => {
                        return (<DownloadableFileListItem downloadable={document}/>);
                    })
                    :
                    <EmptyListing emptyListingMessage={'Al parecer no hay documentos aportados.'}/>
            }
        </Stack>
    );
};

export default DownloadableFileList;
