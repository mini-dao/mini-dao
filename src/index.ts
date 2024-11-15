import { server } from "./api/server";
import { config } from "./config";
import bot from "./tg/bot";

server.listen(config.port || 3000, () => {
  console.log(`listening on :${config.port}`);

  bot.launch();
});
