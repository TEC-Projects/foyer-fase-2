import React, { FunctionComponent } from 'react';
import {Box} from "@mui/material";
import SnackbarMessage from "../../../components/SnackbarMessage";
import {getSessionData} from "../../../util/sessionDataUtil";
import UsersList from "./usersList/UsersList";
import Header from "../../../components/Header";

interface OwnProps {}

type Props = OwnProps;

const Users: FunctionComponent<Props> = (props) => {

    const showButton : boolean = getSessionData()?.user.type === 'SUPER_USER';

    return (
        <Box>
            <Header
                title={'USUARIOS'}
                firstButtonLabel={'AGREGAR USUARIO'}
                firstButtonNavigationRoute={'add-user'}
                showFirstButton={showButton}
                showSecondButton={false}
            />
            <UsersList/>
            <SnackbarMessage/>
        </Box>
    );
};

export default Users;
