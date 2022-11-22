import React, {FunctionComponent, useContext, useState} from 'react';
import {Typography, Stack, Button} from "@mui/material";
import GoBackButton from "../../../components/buttons/GoBackButton";
import OuterLayout from "../OuterLayout";
import {forgotPasswordFirstStep} from "../../../graphQL/Functions/user";
import {useApolloClient} from "@apollo/client";
import {useNavigate} from "react-router-dom";
import Context from "../../../context/Context";
import CustomTextField from "../../../components/fields/CustomTextField";

interface OwnProps {}

type Props = OwnProps;

const ForgotPassword: FunctionComponent<Props> = (props) => {

    const apolloClient = useApolloClient();
    const navigate = useNavigate();

    const {showSnackbar} = useContext(Context);

    const [email, setEmail] = useState('');

    const handleRequestRecovery = async () : Promise<void> => {
        try {
            await forgotPasswordFirstStep(apolloClient, email, navigate)
        }catch (e : unknown) {
            showSnackbar((e as Error).toString().replace('Error: ',  ''), 'warning')
        }
    }


    return(
        <OuterLayout>
            <Stack
                gap={2}
            >
                <GoBackButton/>
                <Typography variant='h4' fontWeight='bold'>¿HAS OLVIDADO TU CONTRASEÑA?</Typography>
                <Typography>No te preocupes, ingresa el correo electrónico asociado a tu cuenta y te haremos llegar un código de recuperación.</Typography>
                <CustomTextField label={"Correo electrónico"} value={email} changeHandler={setEmail}/>
                <Button
                    sx={{
                        color:'white',
                        px:4,
                        minHeight:56,
                        width:'100%'
                    }}
                    onClick={handleRequestRecovery}
                    variant='contained'
                >ENVIAR CORREO DE RECUPERACIÓN</Button>
            </Stack>
        </OuterLayout>
    );
};

export default ForgotPassword;
