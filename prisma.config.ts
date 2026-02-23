import { defineConfig } from '@prisma/sdk';

export default defineConfig({
  schema: './prisma/schema.prisma',
  datasource: {
    url: 'file:./dev.db',
  },
});
