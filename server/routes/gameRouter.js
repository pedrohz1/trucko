import { Router } from "express";
const router = Router();


router.get('/', (req, res) => {
  res.render('index');
});

router.get('/truco', (req, res) => {
  res.render('truco');
});

router.get('/lobby', (req, res) => {
  res.render('lobby');
});

export { router };