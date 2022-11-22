import {TextField} from "@mui/material";
import {FunctionComponent} from "react";
import {ModifySpoilageAgent, SpoilageAgent} from "../../types/spoilageAgent.types";
import {CUDAction} from "../../types/common.types";

interface OwnProps {
    data:ModifySpoilageAgent,
    changeHandler: (action:CUDAction, onChangeSpoilageAgent:ModifySpoilageAgent) => void,
}

type Props = OwnProps;

const SpoilageAgentTextField: FunctionComponent<Props> = (props) => {

    return (
        <TextField
            variant='outlined'
            value={props.data.name}
            onChange={(e) => props.changeHandler(
                'UPDATE',
                {hasBeenCreated:props.data.hasBeenCreated, hasBeenUpdated: !props.data.hasBeenCreated, id:props.data.id, name:e.target.value, type: props.data.type}
            )}
            sx={{
                width:'100%',
                '& label.Mui-focused': {
                    color: '#f1f1f1',
                },
                '& .MuiInput-underline:after': {
                    borderBottomColor: '#f1f1f1',
                },
                '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                        borderColor: '#f1f1f1',
                    },
                    '&:hover fieldset': {
                        borderColor: '#f1f1f1',
                    },
                    '&.Mui-focused fieldset': {
                        borderColor: '#f1f1f1',
                    },
                },
            }}
        ></TextField>
    );
};

export default SpoilageAgentTextField;
