import {User} from "../types/user.types";

const dummyUserListing : Array<User> = [
    {
        id:'001',
        name:'Andrés',
        surname:'Montero Gamboa',
        type: 'ADMIN_USER',
        email: 'andresmonterog@hotmail.com',
    },
    {
        id:'002',
        name:'Joshua',
        surname:'Gamboa Calvo',
        type: 'ADMIN_USER',
        email: 'joshgc.19@gmail.com',
    },
    {
        id:'003',
        name:'Jose',
        surname:'Arce Morales',
        type: 'OPERATIVE_USER',
        email: 'josea@gmail.com',
    },
    {
        id:'004',
        name:'Esteban',
        surname:'Vargas Quiros',
        type: 'OPERATIVE_USER',
        email: 'evargas@gmail.com',
    },
]

const dummyAdminUser : User = {
    id:'001',
    name:'Andrés',
    surname:'Montero Gamboa',
    type: 'ADMIN_USER',
    email: 'andresmonterog@hotmail.com',
}

const dummyOperativeUser : User = {
    id:'003',
    name:'Jose',
    surname:'Arce Morales',
    type: 'OPERATIVE_USER',
    email: 'josea@gmail.com',
}

const dummySuperUser : User = {
    id:'004',
    name:'Esteban',
    surname:'Vargas Quiros',
    type: 'SUPER_USER',
    email: 'evargas@gmail.com',
}

const dummyDirectorUser : User = {
    id:'004',
    name:'Andrés',
    surname:'Montero Gamboa',
    type: 'DIRECTOR_USER',
    email: 'amonterog@gmail.com',
}

export{
    dummyUserListing,
    dummyOperativeUser,
    dummyAdminUser,
    dummySuperUser,
    dummyDirectorUser,
}
