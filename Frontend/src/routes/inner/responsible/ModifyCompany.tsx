import React, {FunctionComponent, useContext, useState} from 'react';
import {Box, Button, Grid, Stack, Typography} from "@mui/material";
import GoBackButton from "../../../components/buttons/GoBackButton";
import {Company} from "../../../types/responsible.types";
import CustomTextField from "../../../components/fields/CustomTextField";
import {useApolloClient} from "@apollo/client";
import {useLocation, useNavigate} from "react-router-dom";
import Context from "../../../context/Context";
import {addCompany, deleteCompany, updateCompany} from "../../../graphQL/Functions/responsible";
import CompanySelector from "../../../components/selector/CompanySelector";
import ResponsibleCheckBox from "../../../components/checkbox/ResponsibleCheckBox";
import DeleteArea from "../../../components/DeleteArea";

interface OwnProps {}

type Props = OwnProps;

const AddCompany: FunctionComponent<Props> = (props) => {

    const apolloClient = useApolloClient();
    const navigate = useNavigate();
    const {showSnackbar} = useContext(Context);
    const location = useLocation();

    const [modifyCompany, setModifyCompany] = useState<Company>({
        id: location.state.id,
        name: location.state.name,
        email: location.state.email
    });

    const handleEmailChange = (onChangeEmail:string) : void => {
        setModifyCompany({
            ...modifyCompany,
            email: onChangeEmail,
        });
    }

    const handleModifyCompany = async () : Promise<void> => {
        try {
            await updateCompany(apolloClient, modifyCompany.id, modifyCompany.email, navigate)
        }catch (e : unknown) {
            showSnackbar((e as Error).toString().replace('Error: ',  ''), 'warning')
        }
    }

    const handleDeleteCompany = async (deleteConfirmation:string) : Promise<void> => {
        try {
            await deleteCompany(apolloClient, modifyCompany.id, deleteConfirmation, navigate)
        }catch (e : unknown) {
            showSnackbar((e as Error).toString().replace('Error: ',  ''), 'warning')
        }
    }

    return (
        <Box>
            <GoBackButton/>
            <Typography variant='h4' fontWeight='bold' marginBottom={4}>MODIFICAR EMPRESA</Typography>
            <Typography fontWeight='bold'>Raz??n social: {modifyCompany.name}</Typography>
            <Typography marginBottom={4}>Identificaci??n: {modifyCompany.id}</Typography>
            <Grid container spacing={12}>
                <Grid item xs={4}>
                    <Stack gap={2}>
                        <CustomTextField label={'Correo electr??nico'} value={modifyCompany.email} changeHandler={handleEmailChange}/>
                        <Button
                            variant='contained'
                            fullWidth
                            onClick={handleModifyCompany}
                            sx={{
                                height:56,
                                marginTop:4,
                            }}
                        >MODIFICAR EMPRESA</Button>
                    </Stack>

                </Grid>
                <Grid item xs={6}>
                    <DeleteArea title={'eliminar empresa'} disclaimer={'Esta acci??n es irreversible, tener precauci??n.'} confirmationText={'Eliminar empresa: ' + location.state.id} deleteHandler={handleDeleteCompany}/>
                </Grid>
            </Grid>
        </Box>
    );
};

export default AddCompany;
