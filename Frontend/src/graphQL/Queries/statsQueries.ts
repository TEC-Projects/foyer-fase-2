import gql from 'graphql-tag';
import {DocumentNode} from "graphql";

let GET_ALL_STATS: DocumentNode = gql`
    query{
        getSupervisionsStatistics{
            status
            absoluteCount
        }
    }
`

let GET_STATS_BY_RESPONSIBLE: DocumentNode = gql`
    query($responsibleId: ID!){
        getSupervisionsStatisticsFromResponsible(responsibleId: $responsibleId){
            dataset{
                status
                absoluteCount
            }
            responsible{
                id
                user{
                    userId
                    name
                    surname
                    email
                    type
                }
                role
                type
                companyName
            }
            response
            message
        }
    }
`

export {
    GET_ALL_STATS,
    GET_STATS_BY_RESPONSIBLE,
}
