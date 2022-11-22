import React, { FunctionComponent } from 'react';
import GeneralTypeSelector from "./GeneralTypeSelector";
import {SelectorItem} from "../../types/common.types";
import {actionsTypeFormatter} from "../../util/formatterUtil";
import {Actions} from "../../types/inspection.types";

interface OwnProps {
    value: string,
    changeHandler: (e:Actions) => void,
}

type Props = OwnProps;

const SuggestedActionSelector: FunctionComponent<Props> = (props) => {

    const selectorItems : Array<SelectorItem> = [
        {
            value: 'RESTORATION',
            label: actionsTypeFormatter('RESTORATION')
        },
        {
            value: 'CONSERVATION',
            label: actionsTypeFormatter('CONSERVATION')
        },
    ]

    return (
      <GeneralTypeSelector label={'Acción resultante'} value={props.value} changeHandler={props.changeHandler} itemCollection={selectorItems}/>
  );
};

export default SuggestedActionSelector;
