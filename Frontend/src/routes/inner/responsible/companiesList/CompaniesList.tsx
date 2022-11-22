import React, { FunctionComponent } from 'react';
import {Stack} from "@mui/material";
import {Company} from "../../../../types/responsible.types";
import CompaniesListItem from "./CompaniesListItem";
import EmptyListing from "../../../../components/EmptyListing";

interface OwnProps {
    companiesList:Array<Company>
}

type Props = OwnProps;

const CompaniesList: FunctionComponent<Props> = (props) => {

    return (
        <Stack
            gap={4}
        >
            {
                props.companiesList.length ?
                    props.companiesList.map((company:Company) => {
                        return(<CompaniesListItem companyData={company}/>);
                    })
                :
                    <EmptyListing emptyListingMessage={'Al parecer no hay empresas registradas'}/>
            }
        </Stack>
    );
};

export default CompaniesList;
