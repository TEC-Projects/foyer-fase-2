import React, { FunctionComponent } from 'react';
import {Stack} from "@mui/material";
import {ModifySpoilageAgent} from "../../../../types/spoilageAgent.types";
import {CUDAction} from "../../../../types/common.types";
import SpoilageAgentTextField from "../../../../components/fields/SpoilageAgentTextField";
import RemoveButton from "../../../../components/buttons/RemoveButton";

interface OwnProps {
    onChangeSpoilageAgent:ModifySpoilageAgent,
    reducer: (action:CUDAction, onChangeSpoilageAgent:ModifySpoilageAgent) => void,
}


type Props = OwnProps;

const ModifySpoilageAgentsListItem: FunctionComponent<Props> = (props) => {

    return (
        <Stack
            direction='row'
            gap={2}
            sx={{
                borderRadius:1,
                backgroundColor:'#f1f1f1',
                display:'flex',
                alignItems:'flex-end',
                paddingX:2,
            }}
        >
            <RemoveButton handleClick={() => props.reducer('DELETE', props.onChangeSpoilageAgent)} backgroundColor={'#f1f1f1'}/>
            <SpoilageAgentTextField data={props.onChangeSpoilageAgent} changeHandler={props.reducer}/>
        </Stack>
    );
};

export default ModifySpoilageAgentsListItem;
