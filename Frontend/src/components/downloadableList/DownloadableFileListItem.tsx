import React, { FunctionComponent } from 'react';
import {Box, Icon, Typography, useTheme} from "@mui/material";
import {Download} from "@mui/icons-material";
import {DownloadableFile} from "../../types/common.types";
import {fileNameFormatter} from "../../util/formatterUtil";

interface OwnProps {
    downloadable:DownloadableFile
}

type Props = OwnProps;

const DownloadableFileListItem: FunctionComponent<Props> = (props) => {

    const theme = useTheme();
    const adjustedFileName = fileNameFormatter(props.downloadable.name, 35)

    return (
        <Box
            sx={{
                display:'flex',
                backgroundColor:'#f1f1f1',
                padding:2,
                borderRadius:1,
        }}
        >
            <Download sx={{color:theme.palette.primary.main, marginRight:1}}/>
            <a href={props.downloadable.source} target="_blank" style={{textDecoration:'none', color:theme.palette.primary.main}}>
                <Typography sx={{'&:hover':{textDecoration:'underline'}}}>{adjustedFileName}</Typography>
            </a>
          </Box>
    );
};

export default DownloadableFileListItem;

