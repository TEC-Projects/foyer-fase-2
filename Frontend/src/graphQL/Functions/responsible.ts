import {ApolloClient} from "@apollo/client";

import {
    validateAddCompany,
    validateAddResponsible,
    validateDeleteCompany, validateDeleteResponsible,
    validateUpdateCompany, validateUpdateResponsible
} from "../../util/validatorUtil";
import {
    AddResponsible as AddResponsibleStructure,
    AddResponsible,
    Company,
    ResponsibleFilters,
    Role
} from "../../types/responsible.types";
import {
    ADD_COMPANY,
    ADD_EMPLOYEE, DELETE_COMPANY, DELETE_EMPLOYEE,
    GET_COMPANIES,
    GET_EMPLOYEES,
    UPDATE_COMPANY, UPDATE_EMPLOYEE
} from "../Queries/responsibleQueries";



/**
 * Function that adds a new responsible.
 */
const addResponsible = async (apolloClient:ApolloClient<any>, responsibleData:AddResponsible, navigate:Function):Promise<void> => {
    let roles: Array<Role> = [];

    if(responsibleData.isCurator) roles.push('CONSERVATION')
    if(responsibleData.isInspector) roles.push('INSPECTION')
    if(responsibleData.isRestorer) roles.push('RESTORATION')

    validateAddResponsible(responsibleData, roles)

    const {data} = await apolloClient.mutate({
        mutation: ADD_EMPLOYEE,
        variables: {
            userId: responsibleData.userId,
            companyId: responsibleData.companyId,
            roles
        }
    });
    if(!data) throw new Error('Error interno, por favor intente de nuevo más tarde');
    if(data.addEmployee.response){
        throw new Error(data.addEmployee.message)
    }
    navigate('/responsible')
};


/**
 * Function that updates a responsible.
 */
const updateResponsible = async (apolloClient:ApolloClient<any>, responsibleData:AddResponsibleStructure, navigate:Function):Promise<void> => {

    let roles: Array<Role> = [];

    if(responsibleData.isCurator) roles.push('CONSERVATION')
    if(responsibleData.isInspector) roles.push('INSPECTION')
    if(responsibleData.isRestorer) roles.push('RESTORATION')

    validateUpdateResponsible(roles)

    const {data} = await apolloClient.mutate({
        mutation: UPDATE_EMPLOYEE,
        variables: {
            employeeId: responsibleData.userId,
            companyId: responsibleData.companyId,
            isCurator: responsibleData.isCurator,
            isInspector: responsibleData.isInspector,
            isRestorer: responsibleData.isRestorer,
        }
    });
    if(!data) throw new Error('Error interno, por favor intente de nuevo más tarde');
    if(data.updateEmployee.response){
        throw new Error(data.updateEmployee.message);
    }
    navigate('/responsible')
}


/**
 * Function that deletes a responsible.
 */
const deleteResponsible = async (apolloClient:ApolloClient<any>, responsibleId:string, deleteConfirmation:string, navigate:Function):Promise<void> => {
    validateDeleteResponsible(responsibleId, deleteConfirmation)
    const {data} = await apolloClient.mutate({
        mutation: DELETE_EMPLOYEE,
        variables: {
            employeeId: responsibleId,
        }
    });
    if(!data) throw new Error('Error interno, por favor intente de nuevo más tarde');
    if(data.deleteEmployee.response){
        throw new Error(data.deleteEmployee.message);
    }
    navigate('/responsible')
}


/**
 * Function that adds a new company.
 */
const addCompany = async (apolloClient:ApolloClient<any>, companyData:Company, navigate:Function):Promise<void> => {
    validateAddCompany(companyData)
    const {data} = await apolloClient.mutate({
        mutation: ADD_COMPANY,
        variables: companyData,
    });
    if(!data) throw new Error('Error interno, por favor intente de nuevo más tarde');
    if(data.addCompany.response){
        throw new Error(data.addCompany.message);
    }
    navigate('/responsible')
};

/**
 * Function that retrieves responsible listing with filters.
 */
const getResponsibleListing = async (apolloClient:ApolloClient<any>, setState:Function, filters:ResponsibleFilters):Promise<void> => {
    let roles = [];

    if(filters.filterCurator) roles.push('CONSERVATION')
    if(filters.filterInspector) roles.push('INSPECTION')
    if(filters.filterRestorer) roles.push('RESTORATION')

    const {data} = await apolloClient.query({
        query: GET_EMPLOYEES,
        variables: {
            roles,
            personnelType: filters.personnelType? filters.personnelType: null,
            companyId: filters.companyId? filters.companyId: null
        },
        fetchPolicy: "no-cache",
    });

    if(!data) throw new Error('Error interno, por favor intente de nuevo más tarde');

    setState(data.retrieveEmployees)
}

/**
 * Function that retrieves companies listing.
 */
const getCompaniesListing = async (apolloClient:ApolloClient<any>, setState:Function):Promise<void> => {
    const {data} = await apolloClient.query({
        query: GET_COMPANIES,
        fetchPolicy: "no-cache",
    });
    if(!data) throw new Error('Error interno, por favor intente de nuevo más tarde');
    setState(data.retrieveCompanies)
}

/**
 * Function that updates a company.
 */
const updateCompany = async (apolloClient:ApolloClient<any>, companyId:string, email:string, navigate:Function):Promise<void> => {
    validateUpdateCompany(email)
    const {data} = await apolloClient.mutate({
        mutation: UPDATE_COMPANY,
        variables: {
            companyId,
            email,
        }
    });
    if(!data) throw new Error('Error interno, por favor intente de nuevo más tarde');
    if(data.updateCompany.response){
        throw new Error(data.updateCompany.message);
    }
    navigate('/responsible')
}


/**
 * Function that deletes a company.
 */
const deleteCompany = async (apolloClient:ApolloClient<any>, companyId:string, deleteConfirmation:string, navigate:Function):Promise<void> => {
    validateDeleteCompany(companyId, deleteConfirmation)
    const {data} = await apolloClient.mutate({
        mutation: DELETE_COMPANY,
        variables: {
            companyId,
        },
    });
    if(!data) throw new Error('Error interno, por favor intente de nuevo más tarde');
    if(data.deleteCompany.response){
        throw new Error(data.deleteCompany.message);
    }
    navigate('/responsible')
}

export {
    addResponsible,
    updateResponsible,
    deleteResponsible,
    getResponsibleListing,
    addCompany,
    updateCompany,
    deleteCompany,
    getCompaniesListing,
}
