import { Router } from "express";
const router = Router();

// Suas rotas aqui
router.get("/dinheiro", (req, res) => {
    res.render("doacao_dinheiro");
});

router.get("/alimento", (req, res) => {
  res.render("doacao_comida");
});


router.get("/roupa", (req, res) => {
    res.render("doacao_roupa");
});

export default router;
