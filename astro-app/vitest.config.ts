import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['__tests__/**/*.test.ts'],
    exclude: ['__tests__/e2e/**', '__tests__/components/**'],
    setupFiles: ['__tests__/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      include: [
        'lib/**/*.ts',
        'src/pages/api/**/*.ts',
        'src/utils/**/*.ts',
      ],
      exclude: [
        '**/*.d.ts',
        '**/index.ts',
        'lib/db/seed.ts',
        'lib/openapi/generate.ts',
        '**/__tests__/**',
        '**/__mocks__/**',
      ],
      thresholds: {
        statements: 95,
        branches: 95,
        functions: 95,
        lines: 95,
      },
    },
  },
  resolve: {
    alias: {
      '@ewill/shared': path.resolve(__dirname, '../packages/shared/src'),
      '@/lib': path.resolve(__dirname, 'lib'),
      '@/utils': path.resolve(__dirname, 'src/utils'),
    },
  },
});
