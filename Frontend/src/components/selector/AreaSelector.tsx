import React, {FunctionComponent, useContext, useEffect, useState} from 'react';
import GeneralTypeSelector from "./GeneralTypeSelector";
import {SelectorItem} from "../../types/common.types";
import {AreaListingItem} from "../../types/area.types";
import {getAreasListing} from "../../graphQL/Functions/area";
import {useApolloClient} from "@apollo/client";
import Context from "../../context/Context";

interface OwnProps {
    label:string,
    value: string,
    changeHandler: (e:string | any) => void,
}

type Props = OwnProps;

const AreaSelector: FunctionComponent<Props> = (props) => {

    const apolloClient = useApolloClient();
    const {showSnackbar} = useContext(Context)

    const [selectorItems, setSelectorItems] = useState<Array<SelectorItem>>([]);
    const [areas, setAreas] = useState<Array<AreaListingItem>>([]);

    useEffect(() => {
        try {
            getAreasListing(apolloClient,setAreas)
        }catch (e : unknown) {
            showSnackbar((e as Error).toString().replace('Error: ',  ''), 'warning')
        }
    }, []);

    useEffect(() => {
        let selectorAreasList:Array<SelectorItem> = []
        areas.forEach((area:AreaListingItem) => {
            selectorAreasList.push({label:area.name, value:area.id})
        })
        setSelectorItems(selectorAreasList)
    }, [areas]);

    return (
      <GeneralTypeSelector label={props.label} value={props.value} changeHandler={props.changeHandler} itemCollection={selectorItems}/>
  );
};

export default AreaSelector;
