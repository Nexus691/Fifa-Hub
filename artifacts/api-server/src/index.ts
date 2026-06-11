import app from "./app.js";
import { logger } from "./lib/logger.js";
import cron from "node-cron";
import { runScraper } from "./services/scraper.js";

const port = Number(process.env["PORT"]) || 3001;

app.listen(port, (err) => {
  if (err) {
    logger.error({ err }, "Error listening on port");
    process.exit(1);
  }

  logger.info({ port }, "Server listening");

  // Smart background scraper:
  // - On first run or every 24h: full sync of all 48 teams (uses API-Football quota)
  // - Every other hour: only syncs teams with matches within ±4h (uses FREE OpenLigaDB schedule)
  cron.schedule("0 * * * *", () => {
    logger.info("Triggering hourly smart scrape...");
    runScraper();
  });
  
  // Initial scrape on startup
  setTimeout(() => runScraper(), 2000);
});
