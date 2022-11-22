import React, {useState} from 'react';
import Context from './Context'
import {AlertColor} from "@mui/material";
import {SnackbarSignalStructure} from "../types/context.types";

type Props = {
    children?: React.ReactNode
};

const Provider: React.FC<Props> = ({ children }) => {

    const [snackbarSignal, setSnackbarSignal] = useState<SnackbarSignalStructure>({
        message:'',
        show:false,
        status:'success',
    },);

    const showSnackbar = (message:string, status:AlertColor) =>{
        setSnackbarSignal({
            message,
            show:true,
            status,
        })
    };

    const hideSnackbar = () =>{
        setSnackbarSignal({
            ...snackbarSignal,
            show:false,
        })
    };

    return (
        <Context.Provider
            value={{
                snackbarSignal,
                showSnackbar,
                hideSnackbar,
            }}
        >
            {children}
        </Context.Provider>
    );

}

export default Provider;
