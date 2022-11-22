import {Status} from "./inspection.types";
import {Responsible} from "./responsible.types";

type Stat = {
    status: Status,
    absoluteCount: number,
}

type StatWithResponsibleDetail = {
    dataset: Array<Stat>,
    responsible: Responsible,
}

export type {
    Stat,
    StatWithResponsibleDetail,
}
