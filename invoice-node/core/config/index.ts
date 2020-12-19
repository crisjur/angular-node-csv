import Toml from "toml";
import fs from "fs";
import { chirp } from "@server/utilities";
import { ServerError } from "@server/errors";

export type Configurations = {
  [index: string]: any;
};

const NODE_ENV = process.env.NODE_ENV || "development";

const load_config = (filename: string) => {
  const config_path = `${config.__config_folder}/${filename}.toml`;
  try {
    chirp(`loading config "${config_path}"`);
    const toml = Toml.parse(fs.readFileSync(config_path, "utf8"));
    if (toml.__configure)
      throw new ServerError("__configure is a reserved keyword in the configs");
    if (toml.__config_folder)
      throw new ServerError("__config_folder is a reserved keyword in the configs");
    return toml;
  } catch (e) {
    chirp(`config "${config_path}" cannot be read`);
  }
};

const configure = (config_folder: string) => {
  chirp(`configuring environment ${NODE_ENV}`);
  config.__config_folder = config_folder;

  const base_config = load_config("development");
  Object.assign(config, base_config);

  if (NODE_ENV !== "development") {
    const env_config = load_config(NODE_ENV);
    Object.assign(config, env_config);
  }

  const local_config = load_config("local");
  if (local_config)
    Object.assign(config, local_config);
};

const config: any = { __configure: configure };

export default config;
