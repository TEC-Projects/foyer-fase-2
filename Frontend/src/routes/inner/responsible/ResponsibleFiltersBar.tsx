import React, { FunctionComponent } from 'react';
import {Box, Stack, useTheme} from "@mui/material";
import PersonnelTypeSelector from "../../../components/selector/PersonnelTypeSelector";
import {Company, PersonnelType, Responsible, ResponsibleFilters} from "../../../types/responsible.types";
import CompanySelector from "../../../components/selector/CompanySelector";
import ResponsibleCheckBox from "../../../components/checkbox/ResponsibleCheckBox";
import UnderlineButton from "../../../components/buttons/UnderlineButton";
import {ResponsibleReportBuilder} from "../../../util/reportBuilder/builder";
import DownloadReportButton from "../../../components/buttons/DownloadReportButton";

interface OwnProps {
    companyListing: Array<Company>,
    responsibleListing: Array<Responsible>,
    filterData:ResponsibleFilters,
    filterPersonnelTypeChangeHandler: (onChangeValue?: PersonnelType) => void,
    filterCompanyChangeHandler: (onChangeValue?: string) => void,
    filterInspectorChangeHandler: () => void,
    filterCuratorChangeHandler: () => void,
    filterConservatorChangeHandler: () => void,
    clearFiltersChangeHandler: () => void,

}

type Props = OwnProps;

const ResponsibleFiltersBar: FunctionComponent<Props> = (props) => {

    const theme = useTheme();

    const reportBuilder: ResponsibleReportBuilder = new ResponsibleReportBuilder({responsible: props.responsibleListing, companies:props.companyListing})

    return (
        <Stack
            direction='row'
            gap={4}
            sx={{
                display:'flex',
                alignItems:'center'
            }}
        >
            <Box
                sx={{
                    width:'16.66%'
                }}
            >
                <PersonnelTypeSelector
                    value={props.filterData.personnelType ? props.filterData.personnelType : ''}
                    changeHandler={props.filterPersonnelTypeChangeHandler}/>
            </Box>
            <Box
                sx={{
                    width:'16.66%'
                }}
            >
                <CompanySelector
                    value={props.filterData.companyId ? props.filterData.companyId : ''}
                    changeHandler={props.filterCompanyChangeHandler}
                    label={'Empresa'}
                    companiesListing={props.companyListing}/>
            </Box>
            <ResponsibleCheckBox inspectorValue={props.filterData.filterInspector} inspectorChangeHandler={props.filterInspectorChangeHandler} curatorValue={props.filterData.filterCurator} curatorChangeHandler={props.filterCuratorChangeHandler} restorerValue={props.filterData.filterRestorer} restorerChangeHandler={props.filterConservatorChangeHandler}/>
            <Box
                sx={{
                    display:'flex',
                    alignItems:'flex-end',
                    height:66,
                }}
            >
                <UnderlineButton label={'Limpiar filtros'} action={props.clearFiltersChangeHandler} buttonTextColor={theme.palette.primary.main} buttonBackgroundColor={'white'}/>
            </Box>
            <DownloadReportButton reportBuilder={reportBuilder}/>
        </Stack>
    );
};

export default ResponsibleFiltersBar;
