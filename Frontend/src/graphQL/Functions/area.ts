import {ApolloClient} from "@apollo/client";
import {validateAddModifyArea, validateDeleteArea, validateTransferElement} from "../../util/validatorUtil";
import {AddModifyArea, AddModifyElement} from "../../types/area.types";
import {
    DELETE_AREA,
    GET_AREA_DETAIL,
    GET_AREAS_LISTING,
    GET_ELEMENT_DETAIL, GET_ELEMENTS_LISTING, GET_FULL_AREA, GET_REPORT_AREAS,
    NEW_AREA,
    TRANSFER_ELEMENT,
    MODIFY_AREA
} from "../Queries/areaQueries";
import {DownloadableFile} from "../../types/common.types";

/**
 * Function that adds a new area.
 */
const addArea = async (apolloClient:ApolloClient<any>, areaData:AddModifyArea, navigate:Function):Promise<void> => {
    validateAddModifyArea(areaData)

    const {data} = await apolloClient.mutate({
        mutation: NEW_AREA,
        variables: {
            input: {
                ...areaData,
                elementListing: areaData.elementListing.map((element) => ({
                    name: element.name,
                    location: element.location,
                    description: element.description,
                    imagesListing: element.imagesListing
                }))
            }
        }
    });
    if(!data) throw new Error('Error interno, por favor intente de nuevo más tarde');
    if(data.newArea.response){
        throw new Error(data.newArea.message)
    }
    // data.newArea.areaId //NEW AREA ID
    navigate('/areas')
};

/**
 * Function that modifies an area.
 */
const modifyArea = async (apolloClient:ApolloClient<any>, areaData:AddModifyArea, createdElements:Array<AddModifyElement>, modifiedElements:Array<AddModifyElement>, navigate:Function):Promise<void> => {

    validateAddModifyArea(areaData)

    const serverCreatedElements = createdElements.map(element => ({
        name: element.name,
        location: element.location,
        description: element.description,
        imagesListing: element.imagesListing,
    }))

    const serverModifiedElements = modifiedElements.map(element => ({
        id: element.serverId,
        name: element.name,
        location: element.location,
        description: element.description,
        deletedImages:element.deletedImages,
        createdImages:element.createdImages,
    }))


    const {data} = await apolloClient.mutate({
        mutation: MODIFY_AREA,
        variables: {
            input: {
                id:areaData.id,
                name:areaData.name,
                story:areaData.story,
                location:areaData.location,
                description:areaData.description,
                deletedImages:areaData.deletedImages,
                createdImages:areaData.createdImages,
                createdElements:serverCreatedElements,
                modifiedElements:serverModifiedElements,
                deletedElements:areaData.deletedElements,
            }
        }
    });
    if(!data) throw new Error('Error interno, por favor intente de nuevo más tarde');
    if(data.modifyArea.response){
        throw new Error(data.modifyArea.message)
    }
    navigate('/areas/' + areaData.id)
};

/**
 * Function that deletes an area.
 */
const deleteArea = async (apolloClient:ApolloClient<any>, areaId:string, deleteConfirmation:string, navigate:Function):Promise<void> => {
    validateDeleteArea(areaId, deleteConfirmation);
    const {data} = await apolloClient.mutate({
        mutation: DELETE_AREA,
        variables: {
            areaId
        }
    });
    if(!data) throw new Error('Error interno, por favor intente de nuevo más tarde');
    if(data.deleteArea.response){
        throw new Error(data.deleteArea.message)
    }
    navigate('/areas')
};

/**
 * Function that deletes an area.
 */
const transferElement = async (apolloClient:ApolloClient<any>, currentAreaId:string, destinationAreaId:string, elementId:string, navigate:Function):Promise<void> => {
    validateTransferElement(currentAreaId, destinationAreaId);
    const {data} = await apolloClient.mutate({
        mutation: TRANSFER_ELEMENT,
        variables: {
            destinationAreaId,
            elementId
        }
    });
    if(!data) throw new Error('Error interno, por favor intente de nuevo más tarde');
    if(data.transferElement.response){
        throw new Error(data.transferElement.message)
    }
    navigate('/areas/' + destinationAreaId)
};

/**
 * Function that retrieves areas listing.
 */
const getAreasListing = async (apolloClient:ApolloClient<any>, setState:Function):Promise<void> => {
    const {data} = await apolloClient.query({
        query: GET_AREAS_LISTING,
        fetchPolicy: "no-cache",
    });
    if(!data) throw new Error('Error interno, por favor intente de nuevo más tarde');
    setState(data.getAreasListing)
}

/**
 * Function that retrieves elements listing.
 */
const getElementsListing = async (apolloClient:ApolloClient<any>, areaId: string, setState:Function):Promise<void> => {
    const {data} = await apolloClient.query({
        query: GET_ELEMENTS_LISTING,
        fetchPolicy: "no-cache",
        variables: {
            areaId
        }
    });
    if(!data) throw new Error('Error interno, por favor intente de nuevo más tarde');
    setState(data.getElementsListing)
}

/**
 * Function that retrieves an area detail.
 */
const getAreaDetail = async (apolloClient:ApolloClient<any>, setState:Function, areaId:string):Promise<void> => {
    const {data} = await apolloClient.query({
        query: GET_AREA_DETAIL,
        variables: {
            areaId,
        },
        fetchPolicy: "no-cache",
    });
    if(!data) throw new Error('Error interno, por favor intente de nuevo más tarde');
    if(data.getAreaDetail.response){
        throw new Error(data.getAreaDetail.message)
    }
    setState(data.getAreaDetail)
}

/**
 * Function that retrieves an element detail.
 */
const getAreaElementDetail = async (apolloClient:ApolloClient<any>, setState:Function, elementId:string):Promise<void> => {
    const {data} = await apolloClient.query({
        query: GET_ELEMENT_DETAIL,
        variables: {
            elementId
        },
        fetchPolicy: "no-cache",
    });
    if(!data) throw new Error('Error interno, por favor intente de nuevo más tarde');
    if(data.getElementDetail.response){
        throw new Error(data.getElementDetail.message)
    }
    setState(data.getElementDetail)
}

/**
 * Function that retrieves areas listing.
 */
const getAreasForReport = async (apolloClient:ApolloClient<any>):Promise<Array<any>> => {
    const {data} = await apolloClient.query({
        query: GET_REPORT_AREAS,
        fetchPolicy: "no-cache",
    });
    if(!data) throw new Error('Error interno, por favor intente de nuevo más tarde');
    return data.getFullAreas
}

/**
 * Function that retrieves areas listing.
 */
const getAreasForModify = async (apolloClient:ApolloClient<any>, areaId: string, setState: Function):Promise<void> => {
    const {data} = await apolloClient.query({
        query: GET_FULL_AREA,
        variables: {
            areaId
        },
        fetchPolicy: "no-cache",
    });
    if(!data) throw new Error('Error interno, por favor intente de nuevo más tarde');
    const extendedElements = data.getFullArea.elementListing.map((element:AddModifyElement, index:number) => ({
        ...element,
        id: index,
        serverId: element.id,
        hasBeenCreated: false,
        hasBeenUpdated: false,
        createdImages:[],
        deletedImages:[],
    }))

    setState({
        ...data.getFullArea,
        createdElements:[],
        updatedElements:[],
        deletedElements:[],
        createdImages:[],
        deletedImages:[],
        elementListing: extendedElements,
    })
}

export {
    addArea,
    modifyArea,
    deleteArea,
    getAreasListing,
    getAreaDetail,
    getAreaElementDetail,
    getElementsListing,
    getAreasForReport,
    getAreasForModify,
    transferElement,
}
