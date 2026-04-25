import express from "express";
import cors from "cors";
import columnsRouter from "./routes/columns";
import cardsRouter from "./routes/cards";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

app.use("/api/columns", columnsRouter);
app.use("/api/cards", cardsRouter);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
