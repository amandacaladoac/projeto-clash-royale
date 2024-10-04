import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import router from "./routes";

const app = express();

// Conectar ao MongoDB
mongoose
  .connect(
    "mongodb+srv://admin:admin@clashroyale.w34ki.mongodb.net/clashroyale?retryWrites=true&w=majority",
    {
      // useUnifiedTopology: true,
    }
  )
  .then(() => console.log("Conectado ao MongoDB"))
  .catch((err) => console.error("Erro ao conectar ao MongoDB", err));

// Configurações do Express
app.use(cors());
app.use(express.json());

// Importa e usar as rotas
app.use("/api", router);

// Inicia o servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
