import {User} from "./user.types";

type PersonnelType = 'INTERNAL' | 'CONTRACTOR'
type Role = 'INSPECTION' | 'RESTORATION' | 'CONSERVATION'

type Company = {
    id:string,
    name:string,
    email:string,
}

type Responsible = {
    id:string,
    user: User,
    role: Array<Role>,
    type: PersonnelType,
    companyName?: string,
}

type AddResponsible = {
    userId:string,
    companyId:string,
    isInspector:boolean
    isCurator:boolean
    isRestorer:boolean
}

type ResponsibleFilters = {
    personnelType: PersonnelType | string | undefined,
    companyId: string | undefined,
    filterInspector:boolean
    filterCurator:boolean
    filterRestorer:boolean
}

export type {
    Company,
    Responsible,
    PersonnelType,
    Role,
    AddResponsible,
    ResponsibleFilters,
}
