import {ApolloClient} from "@apollo/client";
import {
    validateAddUser,
    validateForgotPasswordFirstStep,
    validateForgotPasswordSecondStep, validatePasswordAndConfirmation,
    validateSignIn
} from "../../util/validatorUtil";
import {setSessionData} from "../../util/sessionDataUtil";
import {User, UserType, Credentials, FirstSignInCredentials} from "../../types/user.types";
import {PasswordRecovery} from "../../types/context.types";
import {ADD_USER, FIRST_LOGIN, GET_USERS, LOGIN, RECOVERY_CODE, SEND_CODE} from "../Queries/userQueries";
import {SessionData} from "../../types/common.types";

let dummyIsFirstSignIn:boolean = true;

/**
 * Function to authenticate a user.
 */
const signIn = async (apolloClient:ApolloClient<any>, credentials:Credentials, navigate:Function):Promise<void> => {
    validateSignIn(credentials)
    const {data} = await apolloClient.mutate({
        mutation: LOGIN,
        variables: {
            ...credentials
        },
        fetchPolicy: "no-cache",
    });
    if(!data) throw new Error('Error interno, por favor intente de nuevo más tarde');

    if(data.login.response){
        throw new Error(data.login.message);
    }
    if(data.login.newUser){
        navigate('/change-password', {state: {user: data.login.user, token: data.login.token}});
    }else{
        setSessionData({
            user: data.login.user,
            token: data.login.token
        });
        navigate('/');
        navigate(0);
    }
};

/**
 * Function that adds a new user.
 */
const addUser = async (apolloClient:ApolloClient<any>, userData:User, navigate:Function):Promise<void> => {
    validateAddUser(userData)
    const {data} = await apolloClient.mutate({
        mutation: ADD_USER,
        variables: userData
    });
    if(!data) throw new Error('Error interno, por favor intente de nuevo más tarde');
    if(data.registerUser.response){
        throw new Error(data.registerUser.message)
    }
    navigate('/users')
};

/**
 * Function retrieves users filtered in dependence of the observer permissions.
 */
const getUsers = async (apolloClient:ApolloClient<any>, userType: UserType, setState:Function):Promise<void> => {
    const {data} = await apolloClient.query({
        query: GET_USERS,
        variables: {
            userType
        },
        fetchPolicy: "no-cache",
    });
    if(!data) throw new Error('Error interno, por favor intente de nuevo más tarde');
    // setState(dummyUserListing);
    setState(data.retrieveUsers)
}

/**
 * Function that starts password recovery process
 */
const forgotPasswordFirstStep = async (apolloClient:ApolloClient<any>, accountEmail:string, navigate:Function):Promise<void> => {
    validateForgotPasswordFirstStep(accountEmail)
    const {data} = await apolloClient.mutate({
        mutation: SEND_CODE,
        variables: {
            accountEmail
        }
    });
    if(!data) throw new Error('Error interno, por favor intente de nuevo más tarde');
    if(data.recoveryCode.response){
        throw new Error(data.recoveryCode.message)
    }
    navigate('/forgot-password-code', {state: {email:accountEmail}})

};

/**
 * Function that manage password recovery process
 */
const forgotPasswordSecondStep = async (apolloClient:ApolloClient<any>, recoveryInfo:PasswordRecovery, navigate:Function):Promise<void> => {
    validateForgotPasswordSecondStep(recoveryInfo)
    const {data} = await apolloClient.mutate({
        mutation: RECOVERY_CODE,
        variables: recoveryInfo
    });
    if(!data) throw new Error('Error interno, por favor intente de nuevo más tarde');
    if(data.passwordRecovery.response){
        throw new Error(data.passwordRecovery.message)
    }
    navigate('/')
};

/**
 * Function that manage first sign in change password process
 */
const firstSignInChangePassword = async (apolloClient:ApolloClient<any>, info:FirstSignInCredentials, sessionData: SessionData, navigate:Function):Promise<void> => {
    validatePasswordAndConfirmation(info.password, info.passwordConfirmation)
    const {data} = await apolloClient.mutate({
        mutation: FIRST_LOGIN,
        variables: info,
    });
    if(!data) throw new Error('Error interno, por favor intente de nuevo más tarde');
    if(data.firstLogin.response){
        throw new Error(data.firstLogin.message)
    }
    setSessionData(sessionData);
    navigate('/');
    navigate(0);
};

export {
    signIn,
    addUser,
    firstSignInChangePassword,
    forgotPasswordFirstStep,
    forgotPasswordSecondStep,
    getUsers,
}
