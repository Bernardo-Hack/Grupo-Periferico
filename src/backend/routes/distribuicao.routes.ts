import { Router } from "express";
const router = Router();


router.get("/imigrante", (req, res) => {
    res.render("doacao.imigrante");
});

export default router;
