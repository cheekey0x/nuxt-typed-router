import { defineNuxtConfig } from 'nuxt3';
import typedRouter from '../../..';

export default defineNuxtConfig({
  buildModules: [typedRouter],
  nuxtTypedRouter: {
    outDir: './generated',
  },
});