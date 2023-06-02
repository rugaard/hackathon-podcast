import { inject } from 'vue';

export const spreakerKey = Symbol.for('vue-spreaker-api');

export default function (): any {
  return inject(spreakerKey);
};
