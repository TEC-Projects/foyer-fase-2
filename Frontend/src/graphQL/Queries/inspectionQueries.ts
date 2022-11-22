import gql from 'graphql-tag';
import {DocumentNode} from "graphql";


let GET_INSPECTIONS: DocumentNode = gql`
    query($input: FilteredSupervisionInput!){
        getFilteredSupervisions(input: $input){
            id
            toBeInspected{
                id
                name 
                type
            }
            responsible{
                id
                name
            }
            status
            startDate
            endDate
        }
    }
`

let GET_INSPECTION_DETAIL: DocumentNode = gql`
    query($inspectionId: ID!){
        getSupervision(supervisionId: $inspectionId){
            id
            toBeInspected{
                id
                name
                type
            }
            responsible{
                id
                name
            }
            status
            startDate
            endDate
            executionDate
            action
            documentsListing{
                name
                source
            }
            updateLog{
                authorName
                description
                date
            }
        }
    }
`

let CONCLUDE_SUPERVISION: DocumentNode = gql`
    mutation($input: ConcludeSupervisionInput!){
        concludeSupervision(input: $input){
            message
            response
        }
    }
`

let CREATE_SUPERVISION: DocumentNode = gql`
    mutation($input: NewSupervisionInput!){
        createSupervision(input: $input){
            id
            response
            message
        }
    }
`

let MODIFY_SUPERVISION: DocumentNode = gql`
    mutation($input: UpdateSupervisionInput){
        updateSupervision(input: $input){
            response
            message
            id
        }
    }
`

let GET_INSPECTION_DRAFT: DocumentNode = gql`
    query($id: ID!){
        retrieveSupervisionDraft(id: $id){
            id
            suggestedAction
            damageListing{
                id
                spoilageAgentId
                observations
                recommendations
                image{
                    source
                    name
                }
            },
            hasDraftBeenFound
        }
    }
`

let SAVE_SUPERVISION_DRAFT: DocumentNode = gql`
    mutation($input: SupervisionDraftInput!){
        saveSupervisionDraft(input: $input){
            message
            response
        }
    }
`

export {
    GET_INSPECTIONS,
    GET_INSPECTION_DETAIL,
    CONCLUDE_SUPERVISION,
    CREATE_SUPERVISION,
    MODIFY_SUPERVISION,
    GET_INSPECTION_DRAFT,
    SAVE_SUPERVISION_DRAFT
}
