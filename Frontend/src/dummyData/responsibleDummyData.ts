import {Company, Responsible} from "../types/responsible.types";

const dummyResponsibleListing : Array<Responsible> = [
    {
        id: '001',
        user: {
            id: '208220445',
            name: 'Andrés',
            surname: 'Montero Gamboa',
            type: 'OPERATIVE_USER',
            email: 'andresmonterog@hotmail.com',
        },
        type: 'INTERNAL',
        role: ['RESTORATION', 'INSPECTION'],
    },
    {
        id: '002',
        user: {
            id: '152669335',
            name: 'Joshua',
            surname: 'Gamboa Calvo',
            type: 'OPERATIVE_USER',
            email: 'joshgc.19@gmail.com',
        },
        type: 'CONTRACTOR',
        companyName:'Gamboa Restauraciones Ltda.',
        role: ['CONSERVATION'],
    }
]

const dummyCompanyListing : Array<Company> = [
    {
        id:'310114589653',
        name:'Volio y Trejos S.A',
        email:'info@volioytrejos.com',
    },
    {
        id:'31012522365',
        name:'Gamboa Restauraciones Ltda.',
        email:'general@gamboarestauraciones.com',
    },
]

export {
    dummyCompanyListing,
    dummyResponsibleListing,
}
