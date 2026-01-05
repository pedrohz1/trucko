import { Router } from "express";
const router = Router();


router.get('/', (req, res) => {
  res.render('index');
});

router.get('/truco', (req, res) => {
  res.render('truco');
});

export { router };