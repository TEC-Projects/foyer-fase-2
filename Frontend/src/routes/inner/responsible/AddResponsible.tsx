import React, {FunctionComponent, useContext, useEffect, useState} from 'react';
import {Box, Button, Grid, Stack, Typography} from "@mui/material";
import GoBackButton from "../../../components/buttons/GoBackButton";
import CustomTextField from "../../../components/fields/CustomTextField";
import {useApolloClient} from "@apollo/client";
import {useNavigate} from "react-router-dom";
import Context from "../../../context/Context";
import {AddResponsible as AddResponsibleStructure, Company}  from "../../../types/responsible.types";
import {
    addResponsible,
    getCompaniesListing,
} from "../../../graphQL/Functions/responsible";
import ResponsibleCheckBox from "../../../components/checkbox/ResponsibleCheckBox";
import CompanySelector from "../../../components/selector/CompanySelector";

interface OwnProps {}

type Props = OwnProps;

const AddResponsible: FunctionComponent<Props> = (props) => {

    const apolloClient = useApolloClient();
    const navigate = useNavigate();
    const {showSnackbar} = useContext(Context);

    const [companies, setCompanies] = useState<Array<Company>>([]);

    const [newResponsible, setNewResponsible] = useState<AddResponsibleStructure>({
        userId: '',
        companyId: '',
        isInspector:false,
        isCurator:false,
        isRestorer:false,
    });

    const handleUserIdChange = (onChangeUserId:string) : void => {
        setNewResponsible({
            ...newResponsible,
            userId: onChangeUserId,
        });
    }

    const handleCompanyIdChange = (onChangeCompanyId:string) : void => {
        setNewResponsible({
            ...newResponsible,
            companyId: onChangeCompanyId,
        });
    }

    const handleInspectorRoleChange = () => {
        setNewResponsible({
            ...newResponsible,
            isInspector: !newResponsible.isInspector
        })
    }

    const handleCuratorRoleChange = () => {
        setNewResponsible({
            ...newResponsible,
            isCurator: !newResponsible.isCurator
        })
    }

    const handleRestorerRoleChange = () => {
        setNewResponsible({
            ...newResponsible,
            isRestorer: !newResponsible.isRestorer
        })
    }


    const handleAddResponsible = async () : Promise<void> => {
        try {
            await addResponsible(apolloClient, newResponsible, navigate)
        }catch (e : unknown) {
            showSnackbar((e as Error).toString().replace('Error: ',  ''), 'warning')
        }
    }

    useEffect(() => {
        try {
            getCompaniesListing(apolloClient, setCompanies)
        }catch (e : unknown) {
            showSnackbar((e as Error).toString().replace('Error: ',  ''), 'warning')
        }
    }, [])


    return (
        <Grid container >
            <Grid xs={4}>
                <GoBackButton/>
                <Typography variant='h4' fontWeight='bold' marginBottom={4}>AGREGAR ENCARGADO</Typography>
                <Stack gap={2}>
                    <CustomTextField label={'Identificación del usuario'} value={newResponsible.userId} changeHandler={handleUserIdChange}/>
                    <CompanySelector companiesListing={companies} label={'Empresa'} value={newResponsible.companyId} changeHandler={handleCompanyIdChange}/>
                    <Box
                        sx={{marginTop:2}}
                    >
                        <ResponsibleCheckBox inspectorValue={newResponsible.isInspector} inspectorChangeHandler={handleInspectorRoleChange} curatorValue={newResponsible.isCurator} curatorChangeHandler={handleCuratorRoleChange} restorerValue={newResponsible.isRestorer} restorerChangeHandler={handleRestorerRoleChange}/>
                    </Box>
                </Stack>
                <Button
                    variant='contained'
                    fullWidth
                    onClick={handleAddResponsible}
                    sx={{
                        height:56,
                        marginTop:4,
                    }}
                >AGREGAR ENCARGADO</Button>
            </Grid>
        </Grid>
    );
};

export default AddResponsible;
