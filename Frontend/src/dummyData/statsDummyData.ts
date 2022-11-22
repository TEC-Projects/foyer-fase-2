import {Stat, StatWithResponsibleDetail} from "../types/stats.types";

const allInspectionsStatsByStatus : Array<Stat> = [
    {
        status: "EXECUTED",
        absoluteCount: 15,
    },
    {
        status: "EXECUTED_LATE",
        absoluteCount: 2,
    },
    {
        status: "LATE",
        absoluteCount: 3,
    },
    {
        status: "TO_PROCEED",
        absoluteCount: 8,
    },
    {
        status: "IN_PROGRESS",
        absoluteCount: 4,
    },
]

const responsibleInspectionsStatsByStatus : StatWithResponsibleDetail = {
    dataset: [
        {
            status: "EXECUTED",
            absoluteCount: 4,
        },
        {
            status: "EXECUTED_LATE",
            absoluteCount: 0,
        },
        {
            status: "LATE",
            absoluteCount: 1,
        },
        {
            status: "TO_PROCEED",
            absoluteCount: 6,
        },
        {
            status: "IN_PROGRESS",
            absoluteCount: 1,
        },
    ],
    responsible: {
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

}

export {
    allInspectionsStatsByStatus,
    responsibleInspectionsStatsByStatus,
}
