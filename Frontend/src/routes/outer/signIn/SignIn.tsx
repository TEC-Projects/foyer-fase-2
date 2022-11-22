import React, {FunctionComponent, useContext, useState} from 'react';
import {Box, Button, Stack, Typography} from "@mui/material";
import {signIn} from "../../../graphQL/Functions/user";
import {useApolloClient} from "@apollo/client";
import Context from "../../../context/Context";
import {useNavigate} from "react-router-dom";
import {Credentials} from "../../../types/user.types";
import CustomTextField from "../../../components/fields/CustomTextField";
import CustomPasswordField from "../../../components/fields/CustomPasswordField";
import OuterNavBar from "../../../components/nav/OuterNavBar";
import SnackbarMessage from "../../../components/SnackbarMessage";
import OuterLayout from "../OuterLayout";

interface OwnProps {}

type Props = OwnProps;

const SignIn: FunctionComponent<Props> = (props) => {

    const apolloClient =  useApolloClient();
    const navigate = useNavigate();

    const {showSnackbar} = useContext(Context);

    const [credentials, setCredentials] = useState<Credentials>({
        username:'',
        password:'',
    });

    const handleUsernameChange = (e:string) : void => {
        setCredentials({
            ...credentials,
            username: e,
        })
    }

    const handlePasswordChange = (e:string) : void => {
        setCredentials({
            ...credentials,
            password: e,
        })
    }

    const handleSignIn = async () : Promise<void> => {
        try {
            await signIn(apolloClient, credentials, navigate)
        }catch (e : unknown) {
            showSnackbar((e as Error).toString().replace('Error: ',  ''), 'warning')
        }
    }


    return(
        <Box>
            <OuterNavBar/>
            <OuterLayout>
                <Stack sx={{gap:2}}>
                    <Typography variant='h4' fontWeight='bold'>INICIO DE SESIÓN</Typography>
                    <Box>
                        <CustomTextField label={"Correo electrónico"} value={credentials.username} changeHandler={handleUsernameChange}/>
                        <CustomPasswordField label={'Contraseña'} value={credentials.password} changeHandler={handlePasswordChange}/>
                    </Box>
                    <Button
                        sx={{
                            color:'white',
                            px:4,
                            minHeight:56,
                            width:'100%'
                        }}
                        onClick={handleSignIn}
                        variant='contained'
                    >INICIAR SESIÓN</Button>
                    <Button
                        variant='text'
                        disableRipple
                        onClick={ () => navigate('/forgot-password')}
                        sx={{
                            textTransform:'none',
                            textDecoration:'underline',
                            color:'black',
                            fontWeight:400,
                        }}
                    >¿Olvidaste tu contraseña?</Button>
                </Stack>
            </OuterLayout>
            <SnackbarMessage/>
        </Box>
    );
};

export default SignIn;
