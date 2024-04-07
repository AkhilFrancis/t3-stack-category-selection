import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  const categoryPromises = [];
  
  for (let i = 0; i < 100; i++) {
    const categoryPromise = prisma.category.create({
      data: {
        name: `${faker.commerce.department()}${i}`,
      },
    });
    categoryPromises.push(categoryPromise);
  }
  
  await Promise.all(categoryPromises);
}

try {
    await main();
  } catch (e) {
    console.error(e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
  
