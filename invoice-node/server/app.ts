require("@server/utilities");
require("@server/config").default.__configure(`./config`);
require("@server/models");

import config from "@server/config";
import { allow_cors } from "@server/middlewares";
import { chirp, print_endpoints } from "@server/utilities";
import body_parser from "body-parser";
import express from "express";
import fileupload from "express-fileupload";

const DEFAULT_HTTP_PORT = 5000;

const app = express();

app.use(express.static("public"));
app.use("/static-media", express.static(".gen/static"));

(async () => {

  app.use(allow_cors());

  app.use(fileupload());

  app.use(body_parser.json());
  app.use(body_parser.urlencoded({ extended: true }));

  app.use("/api/v1", require("./routes").default);

  const http_port = config.app.port || DEFAULT_HTTP_PORT;

  app.listen(http_port, () => {
    print_endpoints(app);
    chirp(`Ready on http://localhost:${http_port}`);
  });
})();
