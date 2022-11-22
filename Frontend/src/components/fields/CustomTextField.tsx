import {TextField} from "@mui/material";
import {FunctionComponent, useEffect} from "react";

interface OwnProps {
    label:string,
    value:string,
    changeHandler:Function,
    isElementField?:Boolean,
    elementIdChangeHandler?:Function,
    currentElementId?:number | string,
}

type Props = OwnProps;

const CustomTextField: FunctionComponent<Props> = (props) => {

    const handleElementIdChange = () => {
        if(props.isElementField && props.elementIdChangeHandler){
            props.elementIdChangeHandler(props.currentElementId)
        }
    }

    return (
        <TextField
            variant='outlined'
            label={props.label}
            value={props.value}
            onClick={handleElementIdChange}
            onChange={(e) => props.changeHandler(e.target.value)}
            sx={{
                my:1,
                width:'100%',
                '& label.Mui-focused': {
                    color: '#606060',
                },
                '& .MuiInput-underline:after': {
                    borderBottomColor: '#606060',
                },
                '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                        borderColor: '#b4b4b4',
                    },
                    '&:hover fieldset': {
                        borderColor: '#b4b4b4',
                    },
                    '&.Mui-focused fieldset': {
                        borderColor: '#b4b4b4',
                    },
                },
            }}
        />
    );
};

export default CustomTextField;
