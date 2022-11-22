import React, { FunctionComponent } from 'react';
import {Outlet, Navigate} from 'react-router-dom'
import {getSessionData} from "../util/sessionDataUtil";
import InnerNavBar from "../components/nav/innerNavBar/InnerNavBar";
import {UserType} from "../types/user.types";
import {SessionData} from "../types/common.types";
import {Box} from "@mui/material";
import SnackbarMessage from "../components/SnackbarMessage";

interface OwnProps {
    usersWithAccess: Array<UserType>
}

type Props = OwnProps;

const ProtectedRoute: FunctionComponent<Props> = (props) => {

    const sessionData : SessionData | null = getSessionData();

    return (
        sessionData && props.usersWithAccess.includes(sessionData.user.type)?
            <div>
                <InnerNavBar/>
                <Box sx={{paddingX:8, paddingTop:25, paddingBottom:8}}>
                    <Outlet/>
                    <SnackbarMessage/>
                </Box>
            </div>
        :
            <Navigate to='/unauthorized' replace/>
    )
};

export default ProtectedRoute;
