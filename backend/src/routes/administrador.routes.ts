import { Router } from "express";
const router = Router();

router.get("/dashboard", (req, res) => {
    res.redirect("/adminUserDashboard");
});


export default router;