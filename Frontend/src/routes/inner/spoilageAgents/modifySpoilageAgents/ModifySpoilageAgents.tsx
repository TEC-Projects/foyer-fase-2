import React, {FunctionComponent, useContext, useEffect, useState} from 'react';
import {Box, Button, Grid, Typography} from "@mui/material";
import ModifySpoilageAgentsList from "./ModifySpoilageAgentsList";
import GoBackButton from "../../../../components/buttons/GoBackButton";
import {useApolloClient} from "@apollo/client";
import Context from "../../../../context/Context";
import {ModifySpoilageAgent} from "../../../../types/spoilageAgent.types";
import {getSpoilageAgentsListingForModifying, modifySpoilageAgents} from "../../../../graphQL/Functions/spoilageAgent";
import {CUDAction} from "../../../../types/common.types";
import {useNavigate} from "react-router-dom";

interface OwnProps {}

type Props = OwnProps;

const ModifySpoilageAgents: FunctionComponent<Props> = (props) => {

    const apolloClient = useApolloClient();
    const navigate = useNavigate();
    const {showSnackbar} = useContext(Context)

    const [spoilageAgents, setSpoilageAgents] = useState<Array<ModifySpoilageAgent>>([]);
    const [deletedSpoilageAgents, setDeletedSpoilageAgents] = useState<Array<string>>([]);

    const handleUpdateSpoilageAgent = (onChangeSpoilageAgent:ModifySpoilageAgent) : void => {
        spoilageAgents.forEach(((agent, index) => {
            if(agent.id === onChangeSpoilageAgent.id){
                setSpoilageAgents([
                    ...spoilageAgents.slice(0,index),
                    {
                        ...spoilageAgents[index],
                        hasBeenUpdated:onChangeSpoilageAgent.hasBeenUpdated,
                        name:onChangeSpoilageAgent.name,
                    },
                    ...spoilageAgents.slice(index+1)
                ])
            }
        }))
    }

    const handleAddSpoilageAgent = (onChangeSpoilageAgent:ModifySpoilageAgent) : void => {
        setSpoilageAgents([
            ...spoilageAgents,
            {
                hasBeenCreated:onChangeSpoilageAgent.hasBeenCreated,
                hasBeenUpdated:onChangeSpoilageAgent.hasBeenUpdated,
                id: (parseInt(spoilageAgents[spoilageAgents.length-1].id) + 1).toString(),
                name:'',
                type: onChangeSpoilageAgent.type,
            }
        ])
    }

    const handleRemoveSpoilageAgent = (onChangeSpoilageAgent:ModifySpoilageAgent) : void => {
        spoilageAgents.forEach((agent, index) => {
            if(agent.id === onChangeSpoilageAgent.id){
                setSpoilageAgents([
                    ...spoilageAgents.slice(0,index),
                    ...spoilageAgents.slice(index+1)
                ])
            }
        })
        if(!onChangeSpoilageAgent.hasBeenCreated){
            setDeletedSpoilageAgents([
                ...deletedSpoilageAgents,
                onChangeSpoilageAgent.id,
            ])
        }
    }

    const spoilageAgentReducer = (action:CUDAction, spoilageAgent:ModifySpoilageAgent) => {
        switch (action){
            case "CREATE":
                handleAddSpoilageAgent(spoilageAgent)
                break;
            case "UPDATE":
                handleUpdateSpoilageAgent(spoilageAgent)
                break;
            case "DELETE":
                handleRemoveSpoilageAgent(spoilageAgent)
                break;
        }
    }

    const handleModifySpoilageAgents = async () => {
        try {
            const createdSpoilageAgents = spoilageAgents.filter(agent => agent.hasBeenCreated).map(agent => ({name:agent.name, type:agent.type}))
            const updatedSpoilageAgents = spoilageAgents.filter(agent => agent.hasBeenUpdated).map(agent => ({id: agent.id, name:agent.name}))
            await modifySpoilageAgents(apolloClient, createdSpoilageAgents, updatedSpoilageAgents, deletedSpoilageAgents, navigate)
        }catch (e : unknown) {
            showSnackbar((e as Error).toString().replace('Error: ',  ''), 'warning')
        }
    }


    useEffect(() => {
        try {
            getSpoilageAgentsListingForModifying(apolloClient, setSpoilageAgents)
        }catch (e : unknown) {
            showSnackbar((e as Error).toString().replace('Error: ',  ''), 'warning')
        }
    }, [])

    return (
        <Box>
            <GoBackButton/>
            <Typography variant='h4' fontWeight='bold' marginBottom={4}>MODIFICAR AGENTES DE DETERIORO</Typography>
            <Grid container spacing={4}>
                <Grid item xs={6}>
                    <Typography variant='h5' fontWeight='bold' sx={{marginBottom:4}}>Agentes naturales</Typography>
                    <ModifySpoilageAgentsList type={'NATURAL'} spoilageAgents={spoilageAgents} reducer={spoilageAgentReducer}/>
                </Grid>
                <Grid item xs={6}>
                    <Typography variant='h5' fontWeight='bold' sx={{marginBottom:4}}>Agentes circunstanciales</Typography>
                    <ModifySpoilageAgentsList type={'CIRCUMSTANTIAL'} spoilageAgents={spoilageAgents} reducer={spoilageAgentReducer}/>
                </Grid>
            </Grid>
            <Grid container spacing={4}>
                <Grid item xs={3} sx={{marginTop:4}}>
                    <Button
                        variant='contained'
                        onClick={handleModifySpoilageAgents}
                        sx={{
                            width:'100%',
                            height:50
                        }}
                    >APLICAR MODIFICACIONES</Button>
                </Grid>
            </Grid>

        </Box>
    );
};

export default ModifySpoilageAgents;
