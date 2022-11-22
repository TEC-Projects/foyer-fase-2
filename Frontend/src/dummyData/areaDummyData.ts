import {Area, AreaListingItem, Element} from "../types/area.types";

const dummyAreaListing : Array<AreaListingItem> = [
    {
        id:'1025',
        name:'Palco derecho',
        story: 'THIRD',
        elementCount:12,
    },
    {
        id:'905',
        name:'Vestíbulo principal',
        story: 'FIRST',
        elementCount:24,
    },
    {
        id:'921',
        name:'Foso',
        story: 'BASEMENT',
        elementCount:5,
    },
    {
        id:'909',
        name:'Escenario',
        story: 'FIRST',
        elementCount:36,
    }
]

const dummyArea : Area = {
    elementListing: [
        {
            id: '1025-1',
            name: 'Cortina',
            location: 'Entrada',
        },
        {
            id: '1025-2',
            name: 'Cornisa',
            location: 'Límite exterior',
        }
    ],
    id: '1025',
    imagesListing: [
        {
            id:'001',
            name: 'Vista lateral.jpg',
            source: 'https://res.cloudinary.com/dwzhqvxaz/image/upload/v1654604280/Venues/Wimbledon/NewWimbledonTheatre_Internal5.jpg',
        },
        {
            id:'001',
            name: 'Vista desde el escenario.jpg',
            source: 'https://res.cloudinary.com/dwzhqvxaz/image/upload/v1654604280/Venues/Wimbledon/NewWimbledonTheatre_Internal5.jpg',
        },
        {
            id:'001',
            name: 'Vista interna.jpg',
            source: 'https://res.cloudinary.com/dwzhqvxaz/image/upload/v1654604280/Venues/Wimbledon/NewWimbledonTheatre_Internal5.jpg',
        }
    ],
    description: 'Esta zona se encuenta un nivel por encima del escenario. Decorado con detalles de oro y estatuas renacentistas en la cornisa. Cortina roja separa el pasillo interno del palco. Cuenta con butacas individuales.',
    location: "Al lado derecho del escenario, en lo alto colindante con el palco intermedio",
    name: "Palco derecho",
    story: "THIRD"
}

const dummyElement : Element = {
    description: "Este elemento tiene como objetivo separar el pasillo interno y el palco, esta cortina es de color rojo y cuenta con boradados dorados. Argollas metálicas la sostienen.",
    id: "1025-1",
    imagesListing: [
        {
            id:'001',
            name: 'tela.jpg',
            source: 'https://media.istockphoto.com/photos/velvet-curtains-picture-id172980128?k=20&m=172980128&s=612x612&w=0&h=noGTVliqeNjh4fPt-mLbUgsizLY5B3-8bNrTa80ovKw=',
        },
        {
            id:'002',
            name: 'detalles bordados.jpg',
            source: 'https://media.istockphoto.com/photos/velvet-curtains-picture-id172980128?k=20&m=172980128&s=612x612&w=0&h=noGTVliqeNjh4fPt-mLbUgsizLY5B3-8bNrTa80ovKw=',
        },
    ],
    location: "Entrada",
    name: "Cortina",
    parentArea: "Palco derecho"

}

export{
    dummyAreaListing,
    dummyElement,
    dummyArea,
}
