import { defineConfig } from 'tsup';
import type { Options } from 'tsup';

export default defineConfig((options: Options) => ({
  banner: {
    js: '"use client";',
  },
  format: ['cjs', 'esm'],
  dts: true,
  external: ['react'],
  ...options,
}));
