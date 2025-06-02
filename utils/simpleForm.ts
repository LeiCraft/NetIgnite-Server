import { type Reactive, reactive, toRaw } from "vue";

export class SimpleForm<T extends Record<string, any>> {

    private _values: Reactive<T>;

    constructor(
        private readonly initial: T,
        private readonly onSubmit: (values: Reactive<T>) => Promise<void> | void
    ) {
        this._values = reactive(structuredClone(toRaw(initial)));
    }

    public get values(): Reactive<T> {
        return this._values;
    }

    public toObject() {
        return structuredClone(toRaw(this._values));
    }

    public reset() {
        for (const key in this._values) {
            if (Object.prototype.hasOwnProperty.call(this._values, key)) {
                const value = this.initial[key];
                if (value !== undefined) {
                    this._values[key] = structuredClone(value);
                } else {
                    delete this._values[key];
                }
            }
        }
    }

    public set(values: Partial<T>) {
        for (const key in values) {
            if (Object.prototype.hasOwnProperty.call(values, key)) {
                const value = values[key];
                if (value !== undefined) {
                    this._values[key] = structuredClone(value);
                } else {
                    delete this._values[key];
                }
            }
        }
    }

    public submit() {
        return this.onSubmit(this._values);
    }

}

