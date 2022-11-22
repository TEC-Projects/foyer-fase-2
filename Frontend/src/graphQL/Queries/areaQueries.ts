import gql from 'graphql-tag';
import {DocumentNode} from "graphql";

let GET_STORIES: DocumentNode = gql`
    query{
        getStories{
            id
            value
        }
    }
`

let GET_AREAS_LISTING: DocumentNode = gql`
    query{
        getAreasListing{
            id
            name
            story
            elementCount
        }
    }
`

let GET_ELEMENTS_LISTING: DocumentNode = gql`
    query($areaId: ID!){
        getElementsListing(areaId: $areaId){
            id
            name
        }
    }
`

let GET_AREA_DETAIL: DocumentNode = gql`
    query($areaId: ID!){
        getAreaDetail(areaId:$areaId){
            id
            name
            description
            location
            imagesListing{
                id
                source
                name
            }
            elementListing{
                id
                name
                location
            }
            story
            response
            message
        }
    }
`

let GET_ELEMENT_DETAIL: DocumentNode = gql`
    query($elementId: ID!){
        getElementDetail(elementId:$elementId){
            id
            name
            description
            location
            imagesListing{
                id
                source
                name
            }
            parentArea
            message
            response
        }
    }
`

let GET_REPORT_AREAS: DocumentNode = gql`
    query{
        getFullAreas{
            id
            name
            description
            location
            imagesListing{
                source
                name
            }
            elementListing{
                id
                name
                description
                location
                imagesListing{
                    source
                    name
                }
            }
            story
        }
    }
`

let TRANSFER_ELEMENT: DocumentNode = gql`
    mutation($elementId: ID!, $destinationAreaId: ID!){
        transferElement(elementId: $elementId, destinationAreaId: $destinationAreaId){
            elementId
            response
            message
        }
    }
`

let NEW_AREA: DocumentNode = gql`
    mutation($input: NewAreaInput!){
        newArea(input: $input){
            areaId
            response
            message
        }
    }
`

let DELETE_AREA: DocumentNode = gql`
    mutation($areaId: ID!){
        deleteArea(areaId: $areaId){
            response
            message
        }
    }
`

let GET_FULL_AREA: DocumentNode = gql`
    query($areaId: ID!){
        getFullArea(areaId: $areaId){
            id
            name
            description
            location
            story
            elementListing{
                id
                name
                description
                location
                imagesListing{
                    id
                    name
                    source
                }
            }
            imagesListing{
                id
                source
                name
            }
        }
    }
`

let MODIFY_AREA = gql`
    mutation($input: ModifyAreaInput){
        modifyArea(input: $input){
            response
            message
            areaId
        }
    }
`

export {
    GET_STORIES,
    GET_AREAS_LISTING,
    GET_AREA_DETAIL,
    GET_ELEMENT_DETAIL,
    GET_ELEMENTS_LISTING,
    GET_REPORT_AREAS,
    TRANSFER_ELEMENT,
    DELETE_AREA,
    NEW_AREA,
    GET_FULL_AREA,
    MODIFY_AREA
}
