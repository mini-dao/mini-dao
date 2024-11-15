import { server } from "./api/server";
import { config } from "./config";

server.listen(config.port || 3000, () => {
  console.log(`listening on :${config.port}`);
});
