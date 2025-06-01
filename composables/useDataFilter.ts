
interface FilterSetting {
    search?: {
        query: Ref<string>;
        props: string[];
    };
    match?: Array<{
        query: Ref<string>;
        prop: string;
    }>;
}

export function useDataFilter<T extends Record<string, any>>(data: T[], setting: FilterSetting) {

    return computed(() => {
        let filtered = data;

        if (setting.search && setting.search?.query.value) {

            const query = setting.search.query.value.toLowerCase()
            
            filtered = filtered.filter(item => {

                for (const prop of (setting.search as any).props as string[]) {
                    const device = item;
                    if (device[prop] && device[prop].toLowerCase().includes(query)) {
                        return true;
                    }
                }
            });
        }

        if (setting.match) {

            for (const match of setting.match) {
                if (match.query.value) {
                    filtered = filtered.filter(item => item[match.prop] === match.query.value);
                }
            }

        }

        return filtered;
    });

}