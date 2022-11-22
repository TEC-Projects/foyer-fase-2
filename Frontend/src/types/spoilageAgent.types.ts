type SpoilageType = 'NATURAL' | 'CIRCUMSTANTIAL'

type SpoilageAgent = {
    id: string,
    name:string,
    type: SpoilageType,
}

type ModifySpoilageAgent = {
    hasBeenCreated: boolean,
    hasBeenUpdated: boolean,
    id: string,
    name:string,
    type: SpoilageType,
}

type CreateSpoilageAgent = {
    name:string,
    type:SpoilageType,
}

type UpdateSpoilageAgent = {
    id: string,
    name:string,
}

export type {
    SpoilageType,
    SpoilageAgent,
    ModifySpoilageAgent,
    CreateSpoilageAgent,
    UpdateSpoilageAgent,
}
