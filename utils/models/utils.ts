

export namespace ModelUtils {


    export class OnlineStatus {

        private static readonly typeList: Record<OnlineStatus.Type, OnlineStatus.Type.Data> = {
            online: {
                label: 'Online',
                icon: 'bi bi-check-circle-fill',
                class: 'bg-success'
            },
            offline: {
                label: 'Offline',
                icon: 'bi bi-x-circle-fill',
                class: 'bg-danger'
            },
            unknown: {
                label: 'Unknown',
                icon: 'bi bi-question-circle-fill',
                class: 'bg-secondary'
            }
        };

        static getStatusBadgeClass(status: OnlineStatus.Type) {
            return (this.typeList as any)[status]?.class || 'bg-secondary';
        }

        static getStatusIcon(status: OnlineStatus.Type) {
            return (this.typeList as any)[status]?.icon || 'bi bi-question-circle-fill';
        }

        static getStatusLabel(status: OnlineStatus.Type) {
            return (this.typeList as any)[status]?.label || 'Unknown';
        }

        static getAllTypes(): OnlineStatus.Type.FullData[] {
            return Object.entries(this.typeList).map(([name, data]) => ({
                name: name as OnlineStatus.Type,
                ...data
            }));
        }

    }

    export namespace OnlineStatus {
        export type Type = 'online' | 'offline' | 'unknown';
        export namespace Type {

            export interface Data {
                label: string;
                icon: string;
                class: string;
            }

            export interface FullData extends Data {
                name: Type;
            }
        }
    }

}