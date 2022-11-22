import { createContext } from 'react';
import {AlertColor} from "@mui/material";
import {ContextStructure} from "../types/context.types";

const Context = createContext<ContextStructure>({
    snackbarSignal:{
        message:'',
        show:false,
        status:'success',
    },

    showSnackbar: (message:string, status:AlertColor) => {},
    hideSnackbar: () => {},

})

export default Context
