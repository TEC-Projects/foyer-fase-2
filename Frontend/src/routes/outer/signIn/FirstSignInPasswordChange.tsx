import React, {FunctionComponent, useContext, useEffect, useState} from 'react';
import { Button, Stack, Typography} from "@mui/material";
import OuterLayout from "../OuterLayout";
import CustomPasswordField from "../../../components/fields/CustomPasswordField";
import {FirstSignInCredentials} from "../../../types/user.types";
import {firstSignInChangePassword} from "../../../graphQL/Functions/user";
import {useApolloClient} from "@apollo/client";
import Context from "../../../context/Context";
import {useLocation, useNavigate} from "react-router-dom";
import {SessionData} from "../../../types/common.types";

interface OwnProps {}

type Props = OwnProps;

const FirstSignInPasswordChange: FunctionComponent<Props> = (props) => {

    const apolloClient = useApolloClient();
    const navigate = useNavigate();
    const location = useLocation();
    const {showSnackbar} = useContext(Context);


    const [passwordChange, setPasswordChange] = useState<FirstSignInCredentials>({
        username:'',
        password:'',
        passwordConfirmation:'',
    });

    const [session, setSession] = useState<SessionData>({
        user:{
            id:'',
            name:'',
            surname:'',
            type: 'OPERATIVE_USER',
            email:'',
        },
        token: ''
    });

    const handlePasswordChange = (e:string) : void => {
        setPasswordChange({
            ...passwordChange,
            password: e,
        })
    }

    const handlePasswordConfirmationChange = (e:string) : void => {
        setPasswordChange({
            ...passwordChange,
            passwordConfirmation: e,
        })
    }

    useEffect(() => {
        const user = location.state.user
        if(user.email.length){
            setSession({
                user,
                token: location.state.token
            })
            setPasswordChange({
                ...passwordChange,
                username:user.email,
            })
        }else{
            navigate('/')
            navigate(0)
        }
    }, []);


    const handleFirstSignInPasswordChangeRequest = async () : Promise<void> => {
        try {
            await firstSignInChangePassword(apolloClient, passwordChange, session, navigate)
        }catch (e : unknown) {
            showSnackbar((e as Error).toString().replace('Error: ',  ''), 'warning')
        }
    }

    return (
        <OuterLayout>
            <Stack
                gap={2}
            >
                <Typography variant='h4' fontWeight='bold'>BIENVENIDO/A A LA PLATAFORMA</Typography>
                <Typography>Te has autenticado correctamente en la plataforma por favor cambia la contraseña.</Typography>
                <CustomPasswordField label={'Contraseña'} value={passwordChange.password} changeHandler={handlePasswordChange}/>
                <CustomPasswordField label={'Confirmación de contraseña'} value={passwordChange.passwordConfirmation} changeHandler={handlePasswordConfirmationChange}/>
                <Button
                    sx={{
                        color:'white',
                        px:4,
                        minHeight:56,
                        width:'100%'
                    }}
                    onClick={handleFirstSignInPasswordChangeRequest}
                    variant='contained'
                >CAMBIAR CONTRASEÑA</Button>
            </Stack>
        </OuterLayout>
    );
};
export default FirstSignInPasswordChange;
