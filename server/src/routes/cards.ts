import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

// POST /api/cards — create a card in a column
router.post("/", async (req, res) => {
  const { title, description, columnId } = req.body;
  if (!title || !columnId)
    return res.status(400).json({ error: "title and columnId are required" });

  try {
    const count = await prisma.card.count({ where: { columnId } });
    const card = await prisma.card.create({
      data: { title, description, columnId, position: count },
    });
    res.status(201).json(card);
  } catch (err) {
    res.status(500).json({ error: "Failed to create card" });
  }
});

// PATCH /api/cards/:id — update card (move to column, edit title/desc, reorder)
router.patch("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const { title, description, columnId, position } = req.body;

  try {
    const card = await prisma.card.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(columnId !== undefined && { columnId }),
        ...(position !== undefined && { position }),
      },
    });
    res.json(card);
  } catch (err) {
    res.status(500).json({ error: "Failed to update card" });
  }
});

// DELETE /api/cards/:id
router.delete("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    await prisma.card.delete({ where: { id } });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: "Failed to delete card" });
  }
});

export default router;
