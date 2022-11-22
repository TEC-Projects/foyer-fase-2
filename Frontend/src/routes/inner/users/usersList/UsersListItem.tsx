import React, { FunctionComponent } from 'react';
import {Box, Grid, Typography, useTheme} from "@mui/material";
import {User} from "../../../../types/user.types";
import {userTypeFormatter} from "../../../../util/formatterUtil";

interface OwnProps {
    user: User,
}

type Props = OwnProps;

const UsersListItem: FunctionComponent<Props> = (props) => {

    const theme = useTheme();

    return (
        <Grid
            item
            xs={6}
        >
            <Box
                sx={{
                    backgroundColor:'#f1f1f1',
                    padding: 4,
                    borderRadius: 1,
                }}
            >
                <Typography variant='h5' fontWeight='bold' sx={{marginBottom:1}}>{props.user.name + " " + props.user.surname}</Typography>
                <Typography fontWeight='bold' color={theme.palette.primary.main}>{userTypeFormatter(props.user.type)}</Typography>
                <Typography>Identificación: {props.user.id}</Typography>
                <Typography>Correo electrónico: {props.user.email}</Typography>
            </Box>

        </Grid>
    );
};

export default UsersListItem;
