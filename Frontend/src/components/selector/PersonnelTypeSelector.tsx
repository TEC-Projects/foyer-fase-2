import React, { FunctionComponent } from 'react';
import GeneralTypeSelector from "./GeneralTypeSelector";
import {SelectorItem} from "../../types/common.types";
import {personnelTypeFormatter} from "../../util/formatterUtil";
import {PersonnelType} from "../../types/responsible.types";

interface OwnProps {
    value: string,
    changeHandler: (e:PersonnelType | any) => void,
}

type Props = OwnProps;

const PersonnelTypeSelector: FunctionComponent<Props> = (props) => {

    const selectorItems : Array<SelectorItem> = [
        {
            value: 'CONTRACTOR',
            label: personnelTypeFormatter('CONTRACTOR')
        },
        {
            value: 'INTERNAL',
            label: personnelTypeFormatter('INTERNAL')
        }
        ]

    return (
      <GeneralTypeSelector label={'Tipo de personal'} value={props.value} changeHandler={props.changeHandler} itemCollection={selectorItems}/>
  );
};

export default PersonnelTypeSelector;
