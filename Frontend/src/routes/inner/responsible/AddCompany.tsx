import React, {FunctionComponent, useContext, useState} from 'react';
import {Button, Grid, Stack, Typography} from "@mui/material";
import GoBackButton from "../../../components/buttons/GoBackButton";
import {Company} from "../../../types/responsible.types";
import CustomTextField from "../../../components/fields/CustomTextField";
import {useApolloClient} from "@apollo/client";
import {useNavigate} from "react-router-dom";
import Context from "../../../context/Context";
import {addCompany} from "../../../graphQL/Functions/responsible";

interface OwnProps {}

type Props = OwnProps;

const AddCompany: FunctionComponent<Props> = (props) => {

    const apolloClient = useApolloClient();
    const navigate = useNavigate();
    const {showSnackbar} = useContext(Context);

    const [newCompany, setNewCompany] = useState<Company>({
        id: '',
        name:'',
        email:''
    });

    const handleIdChange = (onChangeId:string) : void => {
        setNewCompany({
            ...newCompany,
            id: onChangeId,
        });
    }

    const handleNameChange = (onChangeName:string) : void => {
        setNewCompany({
            ...newCompany,
            name: onChangeName,
        });
    }

    const handleEmailChange = (onChangeEmail:string) : void => {
        setNewCompany({
            ...newCompany,
            email: onChangeEmail,
        });
    }

    const handleAddCompany = async () : Promise<void> => {
        try {
            await addCompany(apolloClient, newCompany, navigate)
        }catch (e : unknown) {
            showSnackbar((e as Error).toString().replace('Error: ',  ''), 'warning')
        }
    }

    return (
        <Grid container >
            <Grid xs={4}>
                <GoBackButton/>
                <Typography variant='h4' fontWeight='bold' marginBottom={4}>AGREGAR EMPRESA</Typography>
                <Stack gap={2}>
                    <CustomTextField label={'Razón social'} value={newCompany.name} changeHandler={handleNameChange}/>
                    <CustomTextField label={'Identificación'} value={newCompany.id} changeHandler={handleIdChange}/>
                    <CustomTextField label={'Correo electrónico'} value={newCompany.email} changeHandler={handleEmailChange}/>
                </Stack>
                <Button
                    variant='contained'
                    fullWidth
                    onClick={handleAddCompany}
                    sx={{
                        height:56,
                        marginTop:4,
                    }}
                >AGREGAR EMPRESA</Button>
            </Grid>
        </Grid>
    );
};

export default AddCompany;
