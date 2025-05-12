import { Router } from "express";
const router = Router();

router.get("/dashboard", (req, res) => {
    res.redirect("/admin_dashboard");
});

router.get("/dashboard", (req, res) => {
    res.redirect("/admin_doacoes");
});


export default router;