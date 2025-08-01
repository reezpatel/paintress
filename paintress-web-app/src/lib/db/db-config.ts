import type { IndexedDBProps } from "react-indexed-db-hook";

export const DBConfig:IndexedDBProps = {
  name: "Paintress",
  version: 1,
  objectStoresMeta: [
    {
      store: "app_config",
      storeConfig: { keyPath: "id", autoIncrement: true },
      storeSchema: [
        { name: "is_offline", keypath: "is_offline", options: { unique: false } },
        { name: "refresh_token", keypath: "refresh_token", options: { unique: false } },
        { name: "access_token", keypath: "access_token", options: { unique: false } },
      ],
    },
  ],
};
