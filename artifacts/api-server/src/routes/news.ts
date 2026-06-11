import { Router, type IRouter } from "express";
import { fetchNews } from "../services/newsApi";

const router: IRouter = Router();

router.get("/news", async (req, res) => {
  try {
    const { team, page } = req.query as Record<string, string | undefined>;
    const pageNum = page ? parseInt(page, 10) : 1;
    const result = await fetchNews(team, pageNum);
    res.json(result);
  } catch (_err) {
    res.status(500).json({ error: "Failed to fetch news" });
  }
});

export default router;
