const {
  APPS_DEBUG,
  APPS_STAGE = "dev",
  CLERK_HEADER_SECRET,
  CLERK_SECRET_KEY,
} = process.env;

/**
 * @type {import('@ez4/project').ProjectOptions}
 */
export default {
  prefix: APPS_STAGE,
  projectName: "games",
  debugMode: true,
  sourceFiles: [
    "./src/api.ts",
    "./src/database/postgres.ts",
    "./src/wss.ts",
    "./src/database/dynamo.ts",
  ],
  stateFile: {
    path: `${APPS_STAGE}-deploy`,
    remote: true,
  },
  variables: {
    APPS_STAGE,
    APPS_DEBUG,
    CLERK_HEADER_SECRET,
    CLERK_SECRET_KEY,
  },
  tags: {
    Project: "Sequence Words",
    Owner: "Well",
  },
  serveOptions: {
    localPort: 3734,
  },
  localOptions: {
    db: {
      user: "postgres",
      password: "postgres",
      port: 54_321,
    },
    dynamo: {
      host: "127.0.0.1",
      port: 54_323,
    },
  },
  localMode: APPS_STAGE === "dev",
};
