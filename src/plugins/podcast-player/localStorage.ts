import { customRef } from 'vue'

export function useLocalStorage<T>(key: string, defaultValue: any = null) {
    return customRef<T>((track, trigger) => ({
        get: () => {
            track()
            const value = localStorage.getItem(key)
            return value ? JSON.parse(value) : defaultValue
        },
        set: value => {
            if (value === null) {
                localStorage.removeItem(key)
            } else {
                localStorage.setItem(key, JSON.stringify(value))
            }
            trigger()
        },
    }))
}
