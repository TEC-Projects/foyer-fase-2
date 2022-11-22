import gql from 'graphql-tag';
import {DocumentNode} from "graphql";

let GET_EMPLOYEES: DocumentNode = gql`
    query($personnelType: String, $companyId: String, $roles: [String]!){
        retrieveEmployees(type: $personnelType, companyName: $companyId, roles: $roles){
            id
            user{
                id
                name
                surname
                type
                email
            }
            companyName
            role
            type
        }
    }

`

let ADD_EMPLOYEE: DocumentNode = gql`
    mutation($userId: String!, $companyId: String!, $roles:[String]){
        addEmployee(employeeId: $userId, companyId: $companyId, roles: $roles){
            response
            message
        }
        
    }
`

let UPDATE_EMPLOYEE: DocumentNode = gql`
    mutation($employeeId: String, $companyId: String, $isCurator: Boolean, $isInspector: Boolean, $isRestorer: Boolean){
        updateEmployee(employeeId: $employeeId, companyId: $companyId, isCurator: $isCurator, isInspector: $isInspector, isRestorer: $isRestorer){
            message
            response
        }
    }
`

let DELETE_EMPLOYEE: DocumentNode = gql`
    mutation($employeeId: String){
        deleteEmployee(employeeId: $employeeId){
            message
            response
        }
    }
`

let GET_COMPANIES: DocumentNode = gql`
    query getCompanies {
        retrieveCompanies {
            id
            name
            email
        }
    }
`

let ADD_COMPANY : DocumentNode = gql`
    mutation addCompany($id: String!, $name: String!, $email: String!){
        addCompany(id: $id, name: $name, email: $email){
            response
            message
        }
    }
`

let UPDATE_COMPANY: DocumentNode = gql`
    mutation($companyId: String, $email: String){
        updateCompany(companyId: $companyId, email: $email){
            message
            response
        }
    }
`

let DELETE_COMPANY : DocumentNode = gql`
    mutation($companyId: String){
        deleteCompany(companyId: $companyId){
            response
            message
        }
    }
`

export {
    GET_COMPANIES,
    ADD_COMPANY,
    UPDATE_COMPANY,
    DELETE_COMPANY,
    GET_EMPLOYEES,
    ADD_EMPLOYEE,
    DELETE_EMPLOYEE,
    UPDATE_EMPLOYEE,
}
