import { customRef } from 'vue';

export default function (key: string, defaultValue: any) {
    return customRef((track, trigger) => ({
        get: () => {
            track();
            const value = localStorage.getItem(key);
            return value ? JSON.parse(value) : defaultValue;
        },
        set: value => {
            value === null ? localStorage.removeItem(key) : localStorage.setItem(key, JSON.stringify(value));
            trigger();
        },
    }))
}
