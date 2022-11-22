import {SpoilageAgent} from "../types/spoilageAgent.types";

const dummySpoilageAgentListing : Array<SpoilageAgent> = [
    {
        id: '001',
        name:'Temperatura',
        type: 'NATURAL',
    },
    {
        id: '002',
        name:'Sismos',
        type: 'NATURAL',
    },
    {
        id: '003',
        name:'Inundaciones',
        type: 'NATURAL',
    },
    {
        id: '004',
        name:'Organismos',
        type: 'NATURAL',
    },
    {
        id: '005',
        name:'Smog',
        type: 'CIRCUMSTANTIAL',
    },
    {
        id: '006',
        name:'Manipulación de piezas',
        type: 'CIRCUMSTANTIAL',
    },
    {
        id: '007',
        name:'Vandalismo',
        type: 'CIRCUMSTANTIAL',
    },
    {
        id: '008',
        name:'Tránsito de visitantes',
        type: 'CIRCUMSTANTIAL',
    },
]

export {
    dummySpoilageAgentListing
}
