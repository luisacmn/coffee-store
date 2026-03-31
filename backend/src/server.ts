import { createApp } from './app.js';
import { seedProductsIfEmpty } from './repositories/productRepository.js';

const app = createApp();
const port = Number(process.env.PORT ?? 3333);

async function startServer() {
  await seedProductsIfEmpty();

  app.listen(port, () => {
    console.log(`Backend running on http://localhost:${port}`);
  });
}

startServer().catch((error) => {
  console.error('Failed to start backend:', error);
  process.exit(1);
});
