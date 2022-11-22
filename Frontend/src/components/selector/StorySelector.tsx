import React, { FunctionComponent } from 'react';
import GeneralTypeSelector from "./GeneralTypeSelector";
import {SelectorItem} from "../../types/common.types";
import {storyTypeFormatter} from "../../util/formatterUtil";
import {Story} from "../../types/area.types";

interface OwnProps {
    value: string,
    changeHandler: (e:Story) => void,
}

type Props = OwnProps;

const StorySelector: FunctionComponent<Props> = (props) => {

    const selectorItems : Array<SelectorItem> = [
        {
            value: 'FIRST',
            label: storyTypeFormatter('FIRST')
        },
        {
            value: 'SECOND',
            label: storyTypeFormatter('SECOND')
        },
        {
            value: 'THIRD',
            label: storyTypeFormatter('THIRD')
        },
        {
            value: 'BASEMENT',
            label: storyTypeFormatter('BASEMENT')
        },
        {
            value: 'OUTSIDE',
            label: storyTypeFormatter('OUTSIDE')
        }
        ]

    return (
      <GeneralTypeSelector label={'Localización'} value={props.value} changeHandler={props.changeHandler} itemCollection={selectorItems}/>
  );
};

export default StorySelector;
