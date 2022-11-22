import React, {FunctionComponent, useContext, useEffect, useState} from 'react';
import {Box, Button, Grid, Stack, Typography} from "@mui/material";
import GoBackButton from "../../../components/buttons/GoBackButton";
import {useApolloClient} from "@apollo/client";
import {useLocation, useNavigate} from "react-router-dom";
import Context from "../../../context/Context";
import {AddResponsible as AddResponsibleStructure, Company}  from "../../../types/responsible.types";
import {
    deleteCompany,
    deleteResponsible,
    getCompaniesListing,
    updateResponsible
} from "../../../graphQL/Functions/responsible";
import ResponsibleCheckBox from "../../../components/checkbox/ResponsibleCheckBox";
import CompanySelector from "../../../components/selector/CompanySelector";
import DeleteArea from "../../../components/DeleteArea";

interface OwnProps {}

type Props = OwnProps;

const ModifyResponsible: FunctionComponent<Props> = (props) => {

    const apolloClient = useApolloClient();
    const navigate = useNavigate();
    const {showSnackbar} = useContext(Context);
    const location = useLocation();

    const [companies, setCompanies] = useState<Array<Company>>([]);

    const [modifyResponsible, setModifyResponsible] = useState<AddResponsibleStructure>({
        userId: location.state.id,
        companyId:'',
        isInspector: location.state.role.includes('INSPECTION'),
        isCurator: location.state.role.includes('CONSERVATION'),
        isRestorer: location.state.role.includes('RESTORATION'),
    });

    const handleCompanyIdChange = (onChangeCompanyId:string) : void => {
        setModifyResponsible({
            ...modifyResponsible,
            companyId: onChangeCompanyId,
        });
    }

    const handleInspectorRoleChange = () => {
        setModifyResponsible({
            ...modifyResponsible,
            isInspector: !modifyResponsible.isInspector
        })
    }

    const handleCuratorRoleChange = () => {
        setModifyResponsible({
            ...modifyResponsible,
            isCurator: !modifyResponsible.isCurator
        })
    }

    const handleRestorerRoleChange = () => {
        setModifyResponsible({
            ...modifyResponsible,
            isRestorer: !modifyResponsible.isRestorer
        })
    }

    const handleModifyResponsible = async () : Promise<void> => {
        try {
            await updateResponsible(apolloClient, modifyResponsible, navigate)
        }catch (e : unknown) {
            showSnackbar((e as Error).toString().replace('Error: ',  ''), 'warning')
        }
    }

    const handleDeleteResponsible = async (deleteConfirmation:string) => {
        try {
            await deleteResponsible(apolloClient, modifyResponsible.userId, deleteConfirmation, navigate)
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

    useEffect(() => {
        if(companies.length){
            setModifyResponsible({
                ...modifyResponsible,
                companyId: companies.filter(company => company.name === location.state.companyName)[0].id
            })
        }
    }, [companies])



    return (
        <Box>
            <GoBackButton/>
            <Typography variant='h4' fontWeight='bold' marginBottom={4}>MODIFICAR ENCARGADO</Typography>
            <Typography fontWeight='bold'>Nombre: {location.state.fullName}</Typography>
            <Typography marginBottom={4}>Identificación: {location.state.id}</Typography>
            <Grid container spacing={12}>
                <Grid item xs={4}>
                    <Stack gap={2}>
                        <CompanySelector companiesListing={companies} label={'Empresa'} value={modifyResponsible.companyId} changeHandler={handleCompanyIdChange}/>
                        <Box
                            sx={{marginTop:2}}
                        >
                            <ResponsibleCheckBox
                                inspectorValue={modifyResponsible.isInspector}
                                inspectorChangeHandler={handleInspectorRoleChange}
                                curatorValue={modifyResponsible.isCurator}
                                curatorChangeHandler={handleCuratorRoleChange}
                                restorerValue={modifyResponsible.isRestorer}
                                restorerChangeHandler={handleRestorerRoleChange}
                            />
                        </Box>
                        <Button
                            variant='contained'
                            fullWidth
                            onClick={handleModifyResponsible}
                            sx={{
                                height:56,
                                marginTop:4,
                            }}
                        >MODIFICAR ENCARGADO</Button>
                    </Stack>

                </Grid>
                <Grid item xs={6}>
                    <DeleteArea title={'eliminar encargado'} disclaimer={'Esta acción es irreversible, tener precaución.'} confirmationText={'Eliminar encargado: ' + location.state.id} deleteHandler={handleDeleteResponsible}/>
                </Grid>
            </Grid>
        </Box>
    );
};

export default ModifyResponsible;
