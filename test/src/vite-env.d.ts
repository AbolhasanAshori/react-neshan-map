/// <reference types="vite/client" />

type EnvFields =
  | 'VITE_MAP_KEY'
  | 'VITE_MAP_LATITUDE'
  | 'VITE_MAP_LONGITUDE'
  | 'VITE_MAP_ZOOM'
  | 'VITE_MAP_TYPE';

type EnvBuilder<T> = {
  readonly [P in T]: string;
};
interface ImportMetaEnv extends EnvBuilder<EnvFields> {}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
