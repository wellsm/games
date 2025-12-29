const { APPS_DEBUG, APPS_STAGE = "dev" } = process.env;

/**
 * @type {import('@ez4/project').ProjectOptions}
 */
export default {
  projectName: "common",
  debugMode: APPS_DEBUG === "true",
  sourceFiles: [],
  stateFile: {
    path: `${APPS_STAGE}-deploy`,
  },
  variables: {
    APPS_STAGE,
    APPS_DEBUG,
  },
};
