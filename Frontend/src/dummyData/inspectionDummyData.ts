import {Inspection, InspectionListingItem, OperativeCloseInspection} from "../types/inspection.types";
import CloseInspection from "../routes/inner/inspections/closeInspection/CloseInspection";

const dummyInspectionListing : Array<InspectionListingItem> = [
    {
        id:'425125',
        toBeInspected: {
            id: '1025',
            name: 'Palco derecho',
            type: 'AREA'
        },
        responsible:{
            name: 'Andrés Montero Gamboa',
            id: '2074558669'
        },
        status: 'TO_PROCEED',
        startDate: new Date(),
        endDate: new Date(),
    },
    {
        id:'402256',
        toBeInspected: {
            id: '1025',
            name: 'Foso',
            type: 'AREA'
        },
        responsible:{
            name: 'José Arce Morales',
            id: '2074558669'
        },
        status: 'EXECUTED_LATE',
        startDate: new Date(),
        endDate: new Date(),
    },
    {
        id:'415233',
        toBeInspected: {
            id: '1025',
            name: 'Cortina',
            type: 'ELEMENT'
        },
        responsible:{
            name: 'Joshua Gamboa Calvo',
            id: '2074558669'
        },
        status: 'IN_PROGRESS',
        startDate: new Date(),
        endDate: new Date(),
    },
    {
        id:'400012',
        toBeInspected: {
            id: '1025',
            name: 'Cornisa',
            type: 'ELEMENT'
        },
        responsible:{
            name: 'Esteban Vargas Quirós',
            id: '100442586'
        },
        status: 'EXECUTED',
        startDate: new Date(),
        endDate: new Date(),
    }
]

const dummyInspection : Inspection = {
    documentsListing: [
        {
            id:'001',
            name: 'Reporte de inspección 402256.pdf',
            source: 'http://www.javier8a.com/itc/bd1/articulo.pdf',
        },
    ],
    id: "402256",
    responsible: {
        name:"José Arce Morales",
        id: "208220445"
    },
    startDate: new Date('2022-10-22'),
    endDate: new Date('2022-10-31'),
    closeDate: null,
    status: 'EXECUTED_LATE',
    action: null,
    toBeInspected: {
        id: '1025',
        name: 'Palco derecho',
        type: 'AREA'
    },
    updateLog: [
        {
            authorName: 'Jose Arce Morales',
            description:'Cierre',
            date: new Date(),
        },
        {
            authorName: 'Andrés Montero Gamboa',
            description:'Cierre',
            date: new Date(),
        }
    ]
}

const dummyCloseInspectionDraft : OperativeCloseInspection = {
    id: "5",
    suggestedAction: "CONSERVATION",
    damageListing:[
        {
            id:"D05-0",
            spoilageAgentId:"4",
            observations:"Grietas en la pintura",
            recommendations:"Aplicar deshumidificador",
            image:[{
                id:"1",
                name: "moho.jpg",
                source: "http://moho.com/picture.jpg"}],
        },
        {
            id:"D05-1",
            spoilageAgentId:"2",
            observations:"Roptura de tubo principal y daño en madera del piso",
            recommendations:"Remplazar piezas",
            image:[{
                id:"1",
                name: "piezas_dañadas.jpg",
                source: "http://moho.com/picture.jpg"}],
        },
        {
            id:"D05-2",
            spoilageAgentId:"6",
            observations:"Grafiti en pared exterior lateral del teatro",
            recommendations:"Aplicar nueva pintura",
            image:[],
        },
    ],
    hasDraftBeenFound:true,
}

export {
    dummyInspection,
    dummyInspectionListing,
    dummyCloseInspectionDraft,
}
