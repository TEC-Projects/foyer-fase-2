import React, { FunctionComponent } from 'react';
import GeneralTypeSelector from "./GeneralTypeSelector";
import {UserType} from "../../types/user.types";
import {SelectorItem} from "../../types/common.types";
import {userTypeFormatter} from "../../util/formatterUtil";

interface OwnProps {
    value: string,
    changeHandler: (e:UserType) => void,
}

type Props = OwnProps;

const UserTypeSelector: FunctionComponent<Props> = (props) => {

    const selectorItems : Array<SelectorItem> = [
        {
            value: 'ADMIN_USER',
            label: userTypeFormatter('ADMIN_USER')
        },
        {
            value: 'OPERATIVE_USER',
            label: userTypeFormatter('OPERATIVE_USER')
        },
        {
            value: 'DIRECTOR_USER',
            label: userTypeFormatter('DIRECTOR_USER')
        }
    ]

    return (
      <GeneralTypeSelector label={'Tipo de usuario'} value={props.value} changeHandler={props.changeHandler} itemCollection={selectorItems}/>
  );
};

export default UserTypeSelector;
