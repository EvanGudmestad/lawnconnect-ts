import express from "express";
import { providersRouter } from "./routes/providers.js";

const app = express();

const PORT = 3000;

app.use(express.json());
app.use("/providers", providersRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
