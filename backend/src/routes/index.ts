import usuarioRoutes from "./usuario.routes";
import doacaoRoutes from "./doacao.routes";
import distribuicaoRoutes from "./distribuicao.routes";
import administradorRoutes from "./administrador.routes";
import { Router } from "express";

const router = Router();

router.use("/usuarios", usuarioRoutes);
router.use("/doacoes", doacaoRoutes);
router.use("/distribuicoes", distribuicaoRoutes);
router.use("/administrador", administradorRoutes);

export default router;
