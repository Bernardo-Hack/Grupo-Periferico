import { AppDataSource } from "./config/data-source";
import usuarioRoutes from "./routes/usuario.routes";
import doacaoRoutes from "./routes/doacao.routes";
import distribuicaoRoutes from "./routes/distribuicao.routes";
import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Rotas
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/doacoes", doacaoRoutes);
app.use("/api/distribuicoes", distribuicaoRoutes);

// Inicialização do banco de dados e servidor
AppDataSource.initialize()
    .then(() => {
        console.log("Banco de dados conectado");
        app.listen(PORT, () => {
            console.log(`Servidor rodando na porta ${PORT}`);
        });
    })
    .catch(error => console.log("Erro ao conectar ao banco de dados:", error));

export default app;