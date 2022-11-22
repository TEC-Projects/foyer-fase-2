import React, { FunctionComponent } from 'react';
import GeneralTypeSelector from "./GeneralTypeSelector";
import {SelectorItem} from "../../types/common.types";
import {statusTypeFormatter} from "../../util/formatterUtil";
import {Status} from "../../types/inspection.types";

interface OwnProps {
    value: Status,
    changeHandler: (e:Status) => void,
}

type Props = OwnProps;

const StatusSelector: FunctionComponent<Props> = (props) => {

    const selectorItems : Array<SelectorItem> = [
        {
            value: 'EXECUTED',
            label: statusTypeFormatter('EXECUTED')
        },
        {
            value: 'EXECUTED_LATE',
            label: statusTypeFormatter('EXECUTED_LATE')
        },
        {
            value: 'LATE',
            label: statusTypeFormatter('LATE')
        },
        {
            value: 'IN_PROGRESS',
            label: statusTypeFormatter('IN_PROGRESS')
        },
        {
            value: 'TO_PROCEED',
            label: statusTypeFormatter('TO_PROCEED')
        }
        ]

    return (
      <GeneralTypeSelector label={'Estado'} value={props.value} changeHandler={props.changeHandler} itemCollection={selectorItems}/>
  );
};

export default StatusSelector;
