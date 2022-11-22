import React, {FunctionComponent} from 'react';
import {Box, Stack} from "@mui/material";
import {ModifySpoilageAgent, SpoilageType} from "../../../../types/spoilageAgent.types";
import EmptyListing from "../../../../components/EmptyListing";
import ModifySpoilageAgentsListItem from "./ModifySpoilageAgentsListItem";
import {CUDAction} from "../../../../types/common.types";
import UnderlineButton from "../../../../components/buttons/UnderlineButton";

interface OwnProps {
    type: SpoilageType,
    spoilageAgents: Array<ModifySpoilageAgent>,
    reducer: (action:CUDAction, onChangeSpoilageAgent:ModifySpoilageAgent) => void
}

type Props = OwnProps;

const ModifySpoilageAgentsList: FunctionComponent<Props> = (props) => {

    return (
        <Stack gap={2}>
            {
                props.spoilageAgents.length?
                    props.spoilageAgents.filter(item => item.type === props.type).map((spoilageAgent:ModifySpoilageAgent) => {
                        return (
                            <ModifySpoilageAgentsListItem onChangeSpoilageAgent={spoilageAgent} reducer={props.reducer}/>
                        );
                    })
                    :
                    <EmptyListing emptyListingMessage={'Al parecer no hay agentes de deterioro registrados.'}/>
            }
            <Box
                sx={{
                    display:'flex',
                    justifyContent:'start-flex'
                }}
            >
                <UnderlineButton
                    action={() => props.reducer('CREATE', {hasBeenCreated:true, hasBeenUpdated:false, id:'', name:'', type:props.type})}
                    buttonBackgroundColor={'white'}
                    buttonTextColor={'black'}
                    label={'+ agregar agente de deterioro'}/>
            </Box>
        </Stack>
    );
};

export default ModifySpoilageAgentsList;
