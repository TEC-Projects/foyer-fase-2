import {ToBeInspectedReference} from "../../types/area.types";
import {SpoilageAgent} from "../../types/spoilageAgent.types";
import {OperativeCloseInspection} from "../../types/inspection.types";

class OperatorForm{
    private _data:{
        data: OperativeCloseInspection,
        toBeInspected: ToBeInspectedReference|undefined,
        spoilageAgents: Array<SpoilageAgent>
    }
    constructor(data: { data: OperativeCloseInspection; toBeInspected: ToBeInspectedReference|undefined; spoilageAgents: SpoilageAgent[]; }) {
        this._data = data;
    }

    get data(): { data: OperativeCloseInspection; toBeInspected: ToBeInspectedReference|undefined; spoilageAgents: Array<SpoilageAgent> } {
        return this._data;
    }

    set data(value: { data: OperativeCloseInspection; toBeInspected: ToBeInspectedReference|undefined; spoilageAgents: Array<SpoilageAgent> }) {
        this._data = value;
    }
}

export{
    OperatorForm
}
