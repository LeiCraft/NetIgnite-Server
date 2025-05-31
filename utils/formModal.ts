
export class FormModal {

    

    private _isVisible: boolean = false;

    public get isVisible() {
        return this._isVisible;
    }

    public show() {
        this._isVisible = true;
    }

    public hide() {
        this._isVisible = false;
    }

    public toggle() {
        this._isVisible = !this._isVisible;
    }




}
