import React, {FunctionComponent, useEffect} from 'react';
import {FormControl, InputLabel, MenuItem, Select} from "@mui/material";
import {SelectorItem} from "../../types/common.types";

interface OwnProps {
    label: string,
    value: string,
    itemCollection: Array<SelectorItem>
    changeHandler: (e:any) => void,
    isElementField?:Boolean,
    globalIdChangeHandler?:Function,
    currentId?:number | string,
}

type Props = OwnProps;

const GeneralTypeSelector: FunctionComponent<Props> = (props) => {

    const handleElementIdChange = () => {
        if(props.isElementField && props.globalIdChangeHandler){
            props.globalIdChangeHandler(props.currentId)
        }
    }

    return (
        <FormControl fullWidth sx={{marginTop:1}}>
            <InputLabel id="demo-simple-select-label">{props.label}</InputLabel>
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={props.value}
                label={props.label}
                onOpen={handleElementIdChange}
                onChange={(e) => props.changeHandler(e.target.value)}
            >
                {
                    props.itemCollection.map((item: SelectorItem) => {
                        return(
                            <MenuItem value={item.value}>{item.label}</MenuItem>
                        );
                    })
                }
            </Select>
        </FormControl>
    );
};

export default GeneralTypeSelector;
