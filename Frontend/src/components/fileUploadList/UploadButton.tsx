import React, {FunctionComponent, useEffect} from 'react';
import {Box, IconButton, useTheme} from "@mui/material";
import {Add} from "@mui/icons-material";

interface OwnProps {
    fileType:string,
    addChangeHandler: (onChangeFile: File | null) => void,
    isElementField?:Boolean,
    globalIdChangeHandler?:Function,
    currentId?:number,
}

type Props = OwnProps;

const UploadButton: FunctionComponent<Props> = (props) => {

    const theme = useTheme();

    const handleElementIdChange = () => {
        if(props.isElementField && props.globalIdChangeHandler){
            props.globalIdChangeHandler(props.currentId)
        }
    }

    return (
        <Box
            sx={{
                width:100,
                height:100,
                display:'flex',
                justifyContent:'center',
                alignItems:'center',
                borderRadius:1,
                backgroundColor:theme.palette.primary.main,
            }}
        >
            <IconButton sx={{color:'white'}} onClick={handleElementIdChange} aria-label="upload picture" component="label">
                <input hidden accept={props.fileType} type="file" onChange={event => props.addChangeHandler(event.target.files ? event.target.files[0] : null)}/>
                <Add/>
            </IconButton>
        </Box>
    );
};

export default UploadButton;
