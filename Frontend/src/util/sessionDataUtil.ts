import {SessionData} from "../types/common.types";
import {UserType} from "../types/user.types";

const setSessionData = (sessionData : SessionData) => {
    window.localStorage.setItem('userId', sessionData.user.id as string)
    window.localStorage.setItem('name', sessionData.user.name as string)
    window.localStorage.setItem('surname', sessionData.user.surname as string)
    window.localStorage.setItem('type', sessionData.user.type as string)
    window.localStorage.setItem('email', sessionData.user.email as string)
    window.localStorage.setItem('token', sessionData.token as string)
};

const clearSession = () =>{
    window.localStorage.clear();
};

const getSessionData = () =>{
    if (isSessionActive()){
        const sessionData : SessionData = {
            user:{
                id: window.localStorage.getItem('userId') as string,
                name:window.localStorage.getItem('name') as string,
                surname:window.localStorage.getItem('surname') as string,
                type: window.localStorage.getItem('type') as UserType,
                email:window.localStorage.getItem('email') as string,
            },
            token: window.localStorage.getItem('token') as string
        };
        return sessionData;
    }
    return null;
};

const isSessionActive = () => {
    return  (window.localStorage.getItem('userId') &&
        window.localStorage.getItem('name') &&
        window.localStorage.getItem('surname') &&
        window.localStorage.getItem('surname') &&
        window.localStorage.getItem('type') &&
        window.localStorage.getItem('email'));
};

export {
    setSessionData,
    clearSession,
    getSessionData,
    isSessionActive,
}
