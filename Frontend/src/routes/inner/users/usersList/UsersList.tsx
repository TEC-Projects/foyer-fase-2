import React, {FunctionComponent, useContext, useEffect, useState} from 'react';
import {Grid} from "@mui/material";
import {useApolloClient} from "@apollo/client";
import Context from "../../../../context/Context";
import {getUsers} from "../../../../graphQL/Functions/user";
import {getSessionData} from "../../../../util/sessionDataUtil";
import {User, UserType} from "../../../../types/user.types";
import UsersListItem from "./UsersListItem";
import EmptyListing from "../../../../components/EmptyListing";

interface OwnProps {}

type Props = OwnProps;

const UsersList: FunctionComponent<Props> = (props) => {

    const apolloClient = useApolloClient();
    const {showSnackbar} = useContext(Context)

    const [users, setUsers] = useState<Array<User>>([]);

    const sessionData = getSessionData()
    let userType : UserType;
    if(sessionData){
        userType = sessionData.user.type;
    }

    useEffect(() => {
        getUsers(apolloClient, userType, setUsers).catch((e : unknown) => {
            showSnackbar((e as Error).toString().replace('Error: ',  ''), 'warning')
        })
    }, [])

    return (
        <Grid
            container
            spacing={4}
        >
            {
                users.length?
                    users.map((user:User) => {
                        return <UsersListItem user={user}/>
                    })
                :
                   <EmptyListing emptyListingMessage={'Al parecer no hay usuarios registrados.'}/>
            }
        </Grid>
    );
};

export default UsersList;
