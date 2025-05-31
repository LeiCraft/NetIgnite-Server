
export class SharedUtils {

    static deepMerge<T>(target: Partial<T>, source: Partial<T>): T {
        const result = { ...target } as any;

        for (const key in source) {
            if (source.hasOwnProperty(key)) {
                const sourceValue = source[key];
                const targetValue = target[key];

                if (
                    sourceValue &&
                    typeof sourceValue === 'object' &&
                    !Array.isArray(sourceValue) &&
                    targetValue &&
                    typeof targetValue === 'object' &&
                    !Array.isArray(targetValue)
                ) {
                    // Recursively merge nested objects
                    result[key] = SharedUtils.deepMerge(targetValue, sourceValue);
                } else {
                    // Overwrite with source value
                    result[key] = sourceValue;
                }
            }
        }

        return result;
    }

}


