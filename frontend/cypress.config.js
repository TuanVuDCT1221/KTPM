
import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {

        baseUrl: 'http://localhost:5173',
        specPattern: 'cypress/e2e/**/*.spec.js',  
    setupNodeEvents(on, config) {
      
    },
  },

  video: true,
  screenshotOnRunFailure: true
});