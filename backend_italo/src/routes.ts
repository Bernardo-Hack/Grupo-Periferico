import { Router } from 'express';
import path from 'path';

const router = Router();


// rota de login/registro
router.get('/login', (req, res) => {
  res.render('views/user_register.ejs');
});

// outras páginas convertidas
router.get('/doacoes/monetaria', (req, res) => {
  res.render('views/monetary.ejs');
});

router.get('/doacoes/roupas', (req, res) => {
  res.render('views/clothes.ejs');
});

router.get('/doacoes/alimentos', (req, res) => {
  res.render('views/foods.ejs');
});

export default router;
