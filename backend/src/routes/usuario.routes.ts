import { Router } from "express";
const router = Router();

// Suas rotas aqui
router.get("/perfil", (req, res) => {
    res.render("usuario.perfil");
});

router.get("/registro", (req, res) => {
    res.render("usuario.registro");
});

router.get("/voluntario", (req, res) => {
    res.render("usuario.voluntario");
});


export default router;
