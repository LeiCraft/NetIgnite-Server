import { type Reactive, reactive, toRaw } from "vue";

export class FormModel<T extends Record<string, any>> {
    private _values: Reactive<T>;

    constructor(
        private readonly initial: T,
        private readonly onSubmit: (values: Reactive<T>) => Promise<void> | void
    ) {
        this._values = reactive(structuredClone(initial));
    }

    public get values(): Reactive<T> {
        return this._values;
    }

    public toObject() {
        return structuredClone(toRaw(this._values));
    }

    public reset() {
        const raw = toRaw(this._values);
        for (const key in raw) {
            delete raw[key];
        }
        Object.assign(raw, structuredClone(this.initial));
    }

    public set(values: Partial<T>) {
        const raw = toRaw(this._values);
        Object.assign(raw, structuredClone(values));
    }

    public submit() {
        return this.onSubmit(this._values);
    }

}

