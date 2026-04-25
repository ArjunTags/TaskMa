import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

// GET /api/columns — fetch all columns with their cards
router.get("/", async (_req, res) => {
  try {
    const columns = await prisma.column.findMany({
      orderBy: { position: "asc" },
      include: {
        cards: { orderBy: { position: "asc" } },
      },
    });
    res.json(columns);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch columns" });
  }
});

// POST /api/columns — create a new column
router.post("/", async (req, res) => {
  const { title } = req.body;
  if (!title) return res.status(400).json({ error: "Title is required" });

  try {
    const count = await prisma.column.count();
    const column = await prisma.column.create({
      data: { title, position: count },
      include: { cards: true },
    });
    res.status(201).json(column);
  } catch (err) {
    res.status(500).json({ error: "Failed to create column" });
  }
});

// PATCH /api/columns/:id — rename a column
router.patch("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const { title } = req.body;

  try {
    const column = await prisma.column.update({
      where: { id },
      data: { title },
    });
    res.json(column);
  } catch (err) {
    res.status(500).json({ error: "Failed to update column" });
  }
});

// DELETE /api/columns/:id — delete a column (cascades to cards)
router.delete("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    await prisma.column.delete({ where: { id } });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: "Failed to delete column" });
  }
});

export default router;
