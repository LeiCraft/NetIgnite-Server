import { SharedUtils } from "@/shared/utils";
import { SimpleForm } from "@/utils/simpleForm";

interface FormModalSettings {
    header: {
        title: string;
        icon?: string; // Optional icon for the header
    }

    submitText: string;
}

const defaultSettings: FormModalSettings = {
    header: {
        title: 'Form Modal'
    },
    submitText: 'Submit'
}

export class FormModalHandler<T extends Record<string, any>> {

    private _isVisible: boolean = false;

    public settings: FormModalSettings;

    constructor(
        settings: Partial<FormModalSettings>,
        public form: SimpleForm<T>
    ) {

        this.settings = SharedUtils.deepMerge(defaultSettings, settings);

        return reactive(this) as any as FormModalHandler<T>;
    }

    public get isModalVisible() {
        return this._isVisible;
    }

    public showModal() {
        this._isVisible = true;
    }

    public hideModal() {
        this._isVisible = false;
    }

    public toggleModal() {
        this._isVisible = !this._isVisible;
    }

}
