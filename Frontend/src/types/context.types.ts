import {AlertColor} from "@mui/material";

type SnackbarSignalStructure = {
    message:string,
    show:boolean,
    status: AlertColor | undefined,
}

type ContextStructure = {
    snackbarSignal:SnackbarSignalStructure,
    showSnackbar: (message:string, status:AlertColor) => void,
    hideSnackbar: () => void,
}

type PasswordRecovery = {
    email:string,
    code:string,
    password:string,
    passwordConfirmation:string
}

export type {
    ContextStructure,
    SnackbarSignalStructure,
    PasswordRecovery,
}
