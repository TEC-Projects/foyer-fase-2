import React, {FunctionComponent, useContext, useEffect, useState} from 'react';
import GeneralTypeSelector from "./GeneralTypeSelector";
import {SelectorItem} from "../../types/common.types";
import {AreaListingItem, ElementListingItem} from "../../types/area.types";
import {getAreasListing, getElementsListing} from "../../graphQL/Functions/area";
import {useApolloClient} from "@apollo/client";
import Context from "../../context/Context";

interface OwnProps {
    value: string,
    parentAreaId:string,
    changeHandler: (e:string | any) => void,
}

type Props = OwnProps;

const ElementSelector: FunctionComponent<Props> = (props) => {

    const apolloClient = useApolloClient();
    const {showSnackbar} = useContext(Context)

    const [selectorItems, setSelectorItems] = useState<Array<SelectorItem>>([]);
    const [elements, setElements] = useState<Array<ElementListingItem>>([]);

    useEffect(() => {
        try {
            getElementsListing(apolloClient, props.parentAreaId, setElements)
        }catch (e : unknown) {
            showSnackbar((e as Error).toString().replace('Error: ',  ''), 'warning')
        }
    }, [props.parentAreaId]);

    useEffect(() => {
        let selectorElementsList:Array<SelectorItem> = []
        selectorElementsList.push({label:'Estructural', value:'-1'})
        elements.forEach((element:ElementListingItem) => {
            selectorElementsList.push({label:element.name, value:element.id})
        })
        setSelectorItems(selectorElementsList)
    }, [elements]);

    return (
      <GeneralTypeSelector label={'Elemento de inspección'} value={props.value} changeHandler={props.changeHandler} itemCollection={selectorItems}/>
  );
};

export default ElementSelector;
