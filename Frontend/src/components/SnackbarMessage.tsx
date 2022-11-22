import React, {useContext} from 'react';
import {Alert, Snackbar} from "@mui/material";
import Context from "../context/Context";

const SnackbarMessage: React.FC = () => {
    const {snackbarSignal, hideSnackbar} = useContext(Context);

    return (
        <Snackbar open={snackbarSignal.show} autoHideDuration={5000} onClose={hideSnackbar}>
            <Alert onClose={hideSnackbar} severity={snackbarSignal.status} sx={{ width: '100%' }}>
                {snackbarSignal.message}
            </Alert>
        </Snackbar>
    );
};

export default SnackbarMessage;
