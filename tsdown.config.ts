import { readFileSync } from 'node:fs';
import { defineConfig } from 'tsdown';
import { bannerFor } from './banner.ts';

const { version } = JSON.parse(readFileSync('./package.json', 'utf-8'));

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  sourcemap: true,
  splitting: false,
  treeshake: true,
  minify: false,
  outDir: 'dist',
  target: 'node14',
  banner: bannerFor(import.meta.url),
  define: {
    __PKG_VERSION__: JSON.stringify(version),
  },
});
