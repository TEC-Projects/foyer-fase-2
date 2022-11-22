import React, {FunctionComponent} from 'react';
import {SpoilageAgent, SpoilageType} from "../../../../types/spoilageAgent.types";
import {Stack} from "@mui/material";
import EmptyListing from "../../../../components/EmptyListing";
import SpoilageAgentsListItem from "./SpoilageAgentsListItem";


interface OwnProps {
    type: SpoilageType,
    spoilageAgents: Array<SpoilageAgent>,
}

type Props = OwnProps;

const SpoilageAgentsList: FunctionComponent<Props> = (props) => {
    return (
        <Stack gap={2}>
            {
                props.spoilageAgents.length?
                    props.spoilageAgents.filter(item => item.type === props.type).map((spoilageAgent:SpoilageAgent) => {
                        return (
                            <SpoilageAgentsListItem spoilageAgentName={spoilageAgent.name}/>
                        );
                    })
                    :
                    <EmptyListing emptyListingMessage={'Al parecer no hay agentes de deterioro registrados.'}/>
            }
        </Stack>
  );
};

export default SpoilageAgentsList;
