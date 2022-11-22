import React, {FunctionComponent, useContext, useState} from 'react';
import {Box, Button, Grid, Typography} from "@mui/material";
import GoBackButton from "../../../components/buttons/GoBackButton";
import CustomTextField from "../../../components/fields/CustomTextField";
import {User, UserType} from "../../../types/user.types";
import UserTypeSelector from "../../../components/selector/UserTypeSelector";
import {addUser} from "../../../graphQL/Functions/user";
import {useApolloClient} from "@apollo/client";
import {useNavigate} from "react-router-dom";
import Context from "../../../context/Context";
import Header from "../../../components/Header";

interface OwnProps {}

type Props = OwnProps;

const AddUser: FunctionComponent<Props> = (props) => {

    const apolloClient = useApolloClient();
    const navigate = useNavigate();
    const {showSnackbar} = useContext(Context);

    const [newUser, setNewUser] = useState<User>({
        id:'',
        name:'',
        surname:'',
        type: 'ADMIN_USER',
        email:'',
    });

    const handleIdChange = (e:string) : void => {
        setNewUser({
            ...newUser,
            id: e,
        })
    }

    const handleNameChange = (e:string) : void => {
        setNewUser({
            ...newUser,
            name: e,
        })
    }

    const handleUsertypeChange = (e:UserType) : void => {
        console.log(e);
        setNewUser({
            ...newUser,
            type: e,
        })
    }

    const handleSurnameChange = (e:string) : void => {
        setNewUser({
            ...newUser,
            surname: e,
        })
    }

    const handleEmailChange = (e:string) : void => {
        setNewUser({
            ...newUser,
            email: e,
        })
    }

    const handleAddUser = async () : Promise<void> => {
        try {
            await addUser(apolloClient, newUser, navigate)
        }catch (e : unknown) {
            showSnackbar((e as Error).toString().replace('Error: ',  ''), 'warning')
        }
    }

    return (
        <Box>
            <GoBackButton/>
            <Typography variant='h4' fontWeight='bold' marginBottom={4}>AGREGAR USUARIO</Typography>
            <Grid
                container
                spacing={4}
            >
                <Grid item xs={4}>
                    <CustomTextField label={'Identificación'} value={newUser.id} changeHandler={handleIdChange}/>
                </Grid>
                <Grid item xs={4}>
                    <CustomTextField label={'Nombre'} value={newUser.name} changeHandler={handleNameChange}/>
                </Grid>
                <Grid item xs={4}>
                    <CustomTextField label={'Apellidos'} value={newUser.surname} changeHandler={handleSurnameChange}/>
                </Grid>
                <Grid item xs={4}>
                    <CustomTextField label={'Correo electrónico'} value={newUser.email} changeHandler={handleEmailChange}/>
                </Grid>
                <Grid item xs={4}>
                    <UserTypeSelector value={newUser.type} changeHandler={handleUsertypeChange}/>
                </Grid>
            </Grid>
            <Grid container columnSpacing={4} sx={{marginY:8}}>
                <Grid item xs={4}>
                    <Button
                        onClick={handleAddUser}
                        variant='contained'
                        sx={{
                            width:'100%',
                            paddingY: 2,
                        }}
                    >AGREGAR USUARIO</Button>
                </Grid>
            </Grid>
        </Box>
    );
};

export default AddUser;
