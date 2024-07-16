import { defineConfig } from 'tsup';
import type { Options } from 'tsup';

export default defineConfig((options: Options) => ({
  entry: ['src/index.ts'],
  banner: {
    js: '"use client";',
  },
  outDir: 'build',
  clean: true,
  splitting: true,
  sourcemap: true,
  format: ['cjs', 'esm'],
  dts: true,
  treeshake: true,
  silent: true,
  cjsInterop: true,
  external: ['react'],
  ...options,
}));
