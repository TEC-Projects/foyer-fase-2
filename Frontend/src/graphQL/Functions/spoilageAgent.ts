import {ApolloClient} from "@apollo/client";
import {
    CreateSpoilageAgent,
    ModifySpoilageAgent,
    SpoilageAgent,
    UpdateSpoilageAgent
} from "../../types/spoilageAgent.types";
import {CUD_SPOILAGE_AGENT, GET_SPOILAGE_AGENTS} from "../Queries/spoilageAgentQueries";
import {validateModifySpoilageAgents} from "../../util/validatorUtil";

/**
 * Function that retrieves spoilage agents listing.
 */
const getSpoilageAgentsListing = async (apolloClient:ApolloClient<any>, setState:Function):Promise<void> => {
    const {data} = await apolloClient.query({
        query: GET_SPOILAGE_AGENTS,
        fetchPolicy: "no-cache",
    });
    if(!data) throw new Error('Error interno, por favor intente de nuevo más tarde');
    setState(data.getSpoilageAgents)
}

/**
 * Function that retrieves spoilage agents listing for modifying.
 */
const getSpoilageAgentsListingForModifying = async (apolloClient:ApolloClient<any>, setState:Function):Promise<void> => {
    const {data} = await apolloClient.query({
        query: GET_SPOILAGE_AGENTS,
        fetchPolicy: "no-cache",
    });
    if(!data) throw new Error('Error interno, por favor intente de nuevo más tarde');
    const modifiableSpoilageAgents : Array<ModifySpoilageAgent> = [];
    data.getSpoilageAgents.forEach((agent:SpoilageAgent) => {
        modifiableSpoilageAgents.push({
            ...agent,
            hasBeenUpdated:false,
            hasBeenCreated:false,
        })
    })
    setState(modifiableSpoilageAgents)
}


/**
 * Function that modify spoilage agents.
 */
const modifySpoilageAgents = async (apolloClient:ApolloClient<any>, createdSpoilageAgents:Array<CreateSpoilageAgent>, updatedSpoilageAgents:Array<UpdateSpoilageAgent>, deletedSpoilageAgents:Array<string>, navigate:Function):Promise<void> => {
    validateModifySpoilageAgents(createdSpoilageAgents);
    validateModifySpoilageAgents(updatedSpoilageAgents);
    const {data} = await apolloClient.mutate({
        mutation: CUD_SPOILAGE_AGENT,
        variables: {
            input:{
                createdSpoilageAgents,
                updatedSpoilageAgents,
                deletedSpoilageAgents,
            }
        }
    });
    if(!data) throw new Error('Error interno, por favor intente de nuevo más tarde');

    let errors = [];

    errors.push(...data.cudSpoilageAgent.createdSaResponse);
    errors.push(...data.cudSpoilageAgent.updatedSaResponse);
    errors.push(...data.cudSpoilageAgent.deletedSaResponse);

    if(errors.length === 1){
        throw new Error(errors[0].message);
    }else if (errors.length > 1){
        throw new Error('Hubieron múltiples errores en la modificación de agentes de deterioro, por favor corrobore la información');
    }

    navigate('/spoilage-agents')
}

export{
    getSpoilageAgentsListing,
    modifySpoilageAgents,
    getSpoilageAgentsListingForModifying,
}
