import { customRef } from 'vue';

export default function (key: string, defaultValue: any = null) {
    return customRef<any>((track, trigger) => ({
        get: () => {
            track();
            let value = localStorage.getItem(key);
            try {
              value = value !== null ? atob(value) : value;
            } catch {};
            return value ? value : defaultValue;
        },
        set: value => {
            value === null ? localStorage.removeItem(key) : localStorage.setItem(key, btoa(value));
            trigger();
        },
    }))
}
