type UserType = 'ADMIN_USER' | 'OPERATIVE_USER' | 'SUPER_USER' | 'DIRECTOR_USER'

type User = {
    id:string,
    name:string,
    surname:string,
    type: UserType,
    email:string,
}

type Credentials = {
    username:string,
    password:string,
}

type FirstSignInCredentials = {
    username:string,
    password:string,
    passwordConfirmation:string,
}

export type{
    User,
    UserType,
    Credentials,
    FirstSignInCredentials,
}
