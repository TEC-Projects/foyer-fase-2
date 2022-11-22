import React, {FunctionComponent, useContext, useEffect, useState} from 'react';
import {Box, Typography, Stack, Button} from "@mui/material";
import OuterLayout from "../OuterLayout";
import {forgotPasswordSecondStep} from "../../../graphQL/Functions/user";
import {useApolloClient} from "@apollo/client";
import {useLocation, useNavigate} from "react-router-dom";
import Context from "../../../context/Context";
import CustomTextField from "../../../components/fields/CustomTextField";
import {PasswordRecovery} from "../../../types/context.types";
import CustomPasswordField from "../../../components/fields/CustomPasswordField";

interface OwnProps {}

type Props = OwnProps;

const ForgotPasswordConfirmationCode: FunctionComponent<Props> = (props) => {

    const apolloClient = useApolloClient();
    const navigate = useNavigate();
    const location = useLocation();
    const {showSnackbar} = useContext(Context);

    const [passwordRecovery, setPasswordRecovery] = useState<PasswordRecovery>({
        email:'',
        code: '',
        password: '',
        passwordConfirmation:'',
    });

    const handlePasswordChange = (e:string) : void => {
        setPasswordRecovery({
            ...passwordRecovery,
            password: e,
        })
    }

    const handlePasswordConfirmationChange = (e:string) : void => {
        setPasswordRecovery({
            ...passwordRecovery,
            passwordConfirmation: e,
        })
    }

    const handleCodeChange = (e:string) : void => {
        setPasswordRecovery({
            ...passwordRecovery,
            code: e,
        })
    }

    const handlePasswordChangeRequest = async () : Promise<void> => {
        try {
            await forgotPasswordSecondStep(apolloClient, passwordRecovery, navigate)
        }catch (e : unknown) {
            showSnackbar((e as Error).toString().replace('Error: ',  ''), 'warning')
        }
    }

    useEffect(() => {
        const email = location.state.email
        if(email.length){
            setPasswordRecovery({
                ...passwordRecovery,
                email
            })
        }else{
            navigate('/')
            navigate(0)
        }
    }, []);


    return(
        <OuterLayout>
            <Stack
                gap={2}
            >
                <Typography variant='h4' fontWeight='bold'>INGRESA LA NUEVA CONTRASEÑA</Typography>
                <Typography>A continuación ingresa la nueva contraseña y el código de verificación enviado a tu correo electrónico.</Typography>
                <CustomPasswordField label={'Contraseña'} value={passwordRecovery.password} changeHandler={handlePasswordChange}/>
                <CustomPasswordField label={'Confirmación de contraseña'} value={passwordRecovery.passwordConfirmation} changeHandler={handlePasswordConfirmationChange}/>
                <CustomTextField label={"Código de verificación (6 dígitos)"} value={passwordRecovery.code} changeHandler={handleCodeChange}/>
                <Button
                    sx={{
                        color:'white',
                        px:4,
                        minHeight:56,
                        width:'100%'
                    }}
                    onClick={handlePasswordChangeRequest}
                    variant='contained'
                >CAMBIAR CONTRASEÑA</Button>
            </Stack>
        </OuterLayout>
    );
};

export default ForgotPasswordConfirmationCode;
