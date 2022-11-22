import gql from 'graphql-tag';
import {DocumentNode} from "graphql";

let LOGIN : DocumentNode = gql`
    mutation login($username: String!, $password: String!){
        login(email: $username, password: $password){
            token
            user{
                userId
                id
                name
                surname
                email
                type
            }
            newUser
            response
            message
        }
    }
`

let FIRST_LOGIN: DocumentNode = gql`
    mutation firstLogin($username: String!, $password: String!, $passwordConfirmation: String! ){
        firstLogin(email: $username, newPassword: $password, passwordConfirmation: $passwordConfirmation){
            response
            message
        }
    }
`

let SEND_CODE: DocumentNode = gql`
    mutation sendCode($accountEmail: String!) {
        recoveryCode(email: $accountEmail){
            response
            message
        }
    }
`

let RECOVERY_CODE: DocumentNode = gql`
    mutation recoveryPassword($email: String!, $password:String!, $passwordConfirmation: String!, $code: String!){
        passwordRecovery(email: $email, newPassword: $password, passwordConfirmation: $passwordConfirmation, recoveryCode: $code){
            response
            message
        }
    }
`

let ADD_USER: DocumentNode = gql`
    mutation addUser($id: String!, $name: String!, $surname: String!, $email: String!, $type: String!){
        registerUser(idNumber: $id, name: $name, surname: $surname, email: $email, type: $type){
            response
            message
        }
    }
`

let GET_USERS: DocumentNode = gql`
    query getUsers($userType: String!){
        retrieveUsers(userType: $userType){
            id
            name
            surname
            email
            type
        }
    }
`

export {
    LOGIN,
    FIRST_LOGIN,
    SEND_CODE,
    RECOVERY_CODE,
    ADD_USER,
    GET_USERS,
}
