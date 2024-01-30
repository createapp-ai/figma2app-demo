import axios, { AxiosStatic } from 'axios';

export function createAxios(basePath: string) {
  const trimSlash = (str: string) => str.replace(/^\/+|\/+$/g, '');

  const handler: ProxyHandler<AxiosStatic> = {
    get(target, propKey: keyof AxiosStatic, receiver) {
      const origMethod = target[propKey];
      if (typeof origMethod === 'function') {
        return function (...args: unknown[]) {
          const path = [basePath, args[0]]
            .map((p: unknown) => trimSlash(p as string))
            .join('/');
          args[0] = `/${trimSlash(path)}`;
          // @ts-expect-error unhandled this type
          return origMethod.apply(this, args);
        };
      }
      return Reflect.get(target, propKey, receiver);
    },
  };

  return new Proxy(axios, handler) as typeof axios;
}
