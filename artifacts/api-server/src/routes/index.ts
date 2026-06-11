import { Router, type IRouter } from "express";
import healthRouter from "./health";
import fixturesRouter from "./fixtures";
import teamsRouter from "./teams";
import standingsRouter from "./standings";
import newsRouter from "./news";

const router: IRouter = Router();

router.use(healthRouter);
router.use(fixturesRouter);
router.use(teamsRouter);
router.use(standingsRouter);
router.use(newsRouter);

export default router;
