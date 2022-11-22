import gql from 'graphql-tag';
import {DocumentNode} from "graphql";

let GET_SPOILAGE_AGENTS: DocumentNode = gql`
    query{
        getSpoilageAgents{
            id
            name
            type
        }
    }
`

let CUD_SPOILAGE_AGENT: DocumentNode = gql`
    mutation($input: CUDSpoilageAgentInput!){
        cudSpoilageAgent(input:$input){
            createdSaResponse{
                response
                message
            }
            updatedSaResponse{
                response
                message
            }
            deletedSaResponse{
                response
                message
            }
        }
    }
`

export {
    GET_SPOILAGE_AGENTS,
    CUD_SPOILAGE_AGENT
}