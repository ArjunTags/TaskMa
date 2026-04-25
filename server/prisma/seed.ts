import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.card.deleteMany();
  await prisma.column.deleteMany();

  const todo = await prisma.column.create({
    data: { title: "To Do", position: 0 },
  });
  const inProgress = await prisma.column.create({
    data: { title: "In Progress", position: 1 },
  });
  const done = await prisma.column.create({
    data: { title: "Done", position: 2 },
  });

  await prisma.card.createMany({
    data: [
      { title: "Set up project repo", columnId: todo.id, position: 0 },
      { title: "Design database schema", columnId: todo.id, position: 1 },
      { title: "Build API routes", columnId: inProgress.id, position: 0 },
      { title: "Initialize Prisma", columnId: done.id, position: 0 },
    ],
  });

  console.log("✅ Seeded database");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
