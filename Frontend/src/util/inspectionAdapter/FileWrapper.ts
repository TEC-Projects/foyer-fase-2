import {OperatorForm} from "./OperatorForm";

class FileWrapper{

    private file: File|null|(File|null)[];
    private _form: OperatorForm|null;

    constructor(file: File|null|(File|null)[]) {
        this.file = file;
        this._form = null
    }

    public getFile(){
        return this.file;
    }

    public setFile(file: File){
        this.file = file;
    }


    get form(): OperatorForm | null {
        return this._form;
    }

    set form(value: OperatorForm | null) {
        this._form = value;
    }

    public produceFile(){
        return this.file
    }
}

export{
    FileWrapper
}
