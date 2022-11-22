import {FileWrapper} from "./FileWrapper";
import {Builder, OperativeCloseInspectionReport} from "../reportBuilder/builder";
import {getAndOpenReport} from "../pdfCreatorUtil";
import {OperatorForm} from "./OperatorForm";

class OperatorFormAdapter extends FileWrapper{
    private _form: OperatorForm|null;

    constructor(form: any) {
        super(null);
        this._form = form;
    }


    get form(): any {
        return this._form;
    }

    set form(value: any) {
        this._form = value;
    }

    // @ts-ignore
    public async produceFile(){
        let operativeFormBuilder: Builder = new OperativeCloseInspectionReport(this._form?.data);
        return getAndOpenReport(operativeFormBuilder);
    }
}

export{
    OperatorFormAdapter
}
