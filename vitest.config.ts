import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    projects: [{
        test: {
          root: 'playground',
          include: ['../test/**/*.{test,spec}.?(c|m)[jt]s?(x)'],
          name: 'ci',
          environment: 'node',
        }
    }]
  }
})
