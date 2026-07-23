import { defineConfig } from "cypress";

export default defineConfig({
  projectId: 'nknd4u',
  e2e: {
    baseUrl: "http://localhost:3000",
    // Rotas do Next.js em modo dev podem levar mais que o padrão (4s)
    // para compilar sob demanda na primeira visita. Timeouts maiores
    // evitam falso-negativo por lentidão de compilação, sem mascarar
    // uma navegação que realmente não aconteceu.
    defaultCommandTimeout: 10000,
    pageLoadTimeout: 30000,
    requestTimeout: 15000,
    // Reexecuta o teste automaticamente em caso de flake no modo `run`
    // (CI), mas não no `open` (dev interativo), onde queremos ver a
    // falha real imediatamente.
    retries: {
      runMode: 2,
      openMode: 0,
    },
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
