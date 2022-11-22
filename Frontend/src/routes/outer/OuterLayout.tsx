import React, {FunctionComponent, useContext, useState} from 'react';
import {Box} from "@mui/material";


interface OwnProps {
    children:JSX.Element
}

type Props = OwnProps;

const SignIn: FunctionComponent<Props> = (props) => {
    return(
    <Box
        sx={{
            display:'flex',
            justifyContent:'center'
        }}
        >
        <Box
            sx={{
                width: '25%',
                height:'70vh',
                display:'flex',
                alignItems:'center'
            }}
        >
            {props.children}
        </Box>
    </Box>
    );
};

export default SignIn;
