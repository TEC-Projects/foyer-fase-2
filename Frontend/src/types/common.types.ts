import {User, UserType} from "./user.types";
import {Story} from "./area.types";
import {Actions, Status} from "./inspection.types";
import {Company, PersonnelType, Role} from "./responsible.types";
import {SpoilageAgent} from "./spoilageAgent.types";

type CUDAction = 'CREATE' | 'UPDATE' | 'DELETE';

type DownloadableFile = {
    id:string,
    name: string,
    source: string,
}

type UploadableFile = {
    name: string,
    type:string,
}

type SessionData = {
    user: User,
    token: String,
}

type NavMenuItem = {
    label:string,
    action: () => void,
}

type SelectorItem = {
    label: string,
    value: UserType | Story | Status | Actions | PersonnelType | string,
}

export type{
    DownloadableFile,
    SessionData,
    NavMenuItem,
    SelectorItem,
    CUDAction,
    UploadableFile,
}
