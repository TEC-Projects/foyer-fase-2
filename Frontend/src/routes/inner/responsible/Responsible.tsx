import React, {FunctionComponent, useContext, useEffect, useState} from 'react';
import {Box, Grid, Typography} from "@mui/material";
import Header from "../../../components/Header";
import {Company, PersonnelType, ResponsibleFilters} from "../../../types/responsible.types";
import ResponsibleFiltersBar from "./ResponsibleFiltersBar";
import {getCompaniesListing, getResponsibleListing} from "../../../graphQL/Functions/responsible";
import {useApolloClient} from "@apollo/client";
import Context from "../../../context/Context";
import {Responsible as ResponsibleStructure} from "../../../types/responsible.types";
import ResponsibleList from "./responsibleList/ResponsibleList";
import CompaniesList from "./companiesList/CompaniesList";
import {getSessionData} from "../../../util/sessionDataUtil";


interface OwnProps {}

type Props = OwnProps;

const Responsible: FunctionComponent<Props> = (props) => {

    const apolloClient = useApolloClient();
    const {showSnackbar} = useContext(Context);

    const [companies, setCompanies] = useState<Array<Company>>([]);

    const [responsible, setResponsible] = useState<Array<ResponsibleStructure>>([]);

    const [filters, setFilters] = useState<ResponsibleFilters>({
        personnelType: '',
        companyId: '',
        filterInspector:false,
        filterCurator:false,
        filterRestorer:false,
    });

    const handlePersonnelTypeFilterChange = (onChangePersonnelType:PersonnelType | undefined) => {
        setFilters({
            ...filters,
            personnelType: onChangePersonnelType as PersonnelType
        })
    }

    const handleCompanyFilterChange = (onChangeCompanyId:string | undefined) => {
        setFilters({
            ...filters,
            companyId: onChangeCompanyId
        })
    }

    const handleFilterInspectorFilterChange = () => {
        setFilters({
            ...filters,
            filterInspector: !filters.filterInspector
        })
    }

    const handleFilterCuratorFilterChange = () => {
        setFilters({
            ...filters,
            filterCurator: !filters.filterCurator
        })
    }

    const handleFilterRestorerFilterChange = () => {
        setFilters({
            ...filters,
            filterRestorer: !filters.filterRestorer
        })
    }

    const handleClearFilters = () => {
        setFilters({
            personnelType: '',
            companyId: '',
            filterInspector:false,
            filterCurator:false,
            filterRestorer:false,
        })
    }

    const showButtons : boolean = getSessionData()?.user.type === 'ADMIN_USER';

    useEffect(() => {
        getResponsibleListing(apolloClient, setResponsible, filters).catch((e : unknown) => {
            showSnackbar((e as Error).toString().replace('Error: ',  ''), 'warning')
        })
    }, [filters])

    useEffect(() => {
        getCompaniesListing(apolloClient, setCompanies).catch((e : unknown) => {
            showSnackbar((e as Error).toString().replace('Error: ',  ''), 'warning')
        })
    }, [])


    return (
        <Box>
            <Header
                title={'ENCARGADOS'}
                showFirstButton={showButtons}
                firstButtonLabel={'AGREGAR ENCARGADO'}
                firstButtonNavigationRoute={'add-responsible'}
                showSecondButton={showButtons}
                secondButtonNavigationRoute={'add-company'}
                secondButtonLabel={'AGREGAR EMPRESA'}
            />
            <ResponsibleFiltersBar
                companyListing={companies}
                responsibleListing={responsible}
                filterData={filters}
                filterPersonnelTypeChangeHandler={handlePersonnelTypeFilterChange}
                filterCompanyChangeHandler={handleCompanyFilterChange}
                filterInspectorChangeHandler={handleFilterInspectorFilterChange}
                filterCuratorChangeHandler={handleFilterCuratorFilterChange}
                filterConservatorChangeHandler={handleFilterRestorerFilterChange}
                clearFiltersChangeHandler={handleClearFilters}
            />
            <Grid container spacing={4} sx={{marginTop:4}}>
                <Grid item xs={8}>
                    <ResponsibleList responsibleList={responsible}/>
                </Grid>
                <Grid item xs={4}>
                    <Typography variant='h5' fontWeight='bold' marginBottom={2}>Empresas</Typography>
                    <CompaniesList companiesList={companies}/>
                </Grid>
            </Grid>
        </Box>

    );
};

export default Responsible;
