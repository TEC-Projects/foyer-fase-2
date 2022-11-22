import React, { FunctionComponent } from 'react';
import {Outlet, Navigate} from 'react-router-dom'
import {isSessionActive} from "../util/sessionDataUtil";
import InnerNavBar from "../components/nav/innerNavBar/InnerNavBar";
import OuterNavBar from "../components/nav/OuterNavBar";
import SnackbarMessage from "../components/SnackbarMessage";

interface OwnProps {
}

type Props = OwnProps;

const UnprotectedRoute: FunctionComponent<Props> = (props) => {
    return (
        !isSessionActive()?
            <div>
                <OuterNavBar/>
                <Outlet/>
                <SnackbarMessage/>
            </div>
        :
            <Navigate to='/' replace/>
    )
};

export default UnprotectedRoute;
