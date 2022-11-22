import React, {FunctionComponent, useContext, useEffect, useState} from 'react';
import GeneralTypeSelector from "./GeneralTypeSelector";
import {SelectorItem} from "../../types/common.types";
import {Company, PersonnelType} from "../../types/responsible.types";

interface OwnProps {
    companiesListing: Array<Company>,
    value: string,
    label: string,
    changeHandler: (e:string) => void,
}

type Props = OwnProps;

const CompanySelector: FunctionComponent<Props> = (props) => {

    const [selectorItems, setSelectorItems] = useState<Array<SelectorItem>>([]);

    useEffect(() => {
        let selectorCompaniesList:Array<SelectorItem> = []
        props.companiesListing.forEach((company:Company) => {
            selectorCompaniesList.push({label:company.name, value:company.id})
        })
        setSelectorItems(selectorCompaniesList)
    }, [props.companiesListing]);

    return (
      <GeneralTypeSelector label={props.label} value={props.value} changeHandler={props.changeHandler} itemCollection={selectorItems}/>
  );
};

export default CompanySelector;
