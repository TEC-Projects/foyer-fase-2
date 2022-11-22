import React, { FunctionComponent } from 'react';
import {Box, Typography} from "@mui/material";

interface OwnProps {
    emptyListingMessage:string,
}

type Props = OwnProps;

const EmptyListing: FunctionComponent<Props> = (props) => {

    return (
        <Box
            sx={{
                display:'flex',
                justifyContent:'center',
                alignItems:'center',
                height:'25vh'
            }}
        >
            <Typography>{props.emptyListingMessage}</Typography>
        </Box>
    );
};

export default EmptyListing;
