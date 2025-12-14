const { APPS_DEBUG, APPS_STAGE = 'dev' } = process.env;

/**
 * @type {import('@ez4/project').ProjectOptions}
 */
export default {
    prefix: APPS_STAGE,
    projectName: 'sequence-words',
    debugMode: APPS_DEBUG === 'true',
    sourceFiles: [
        './src/api.ts'
    ],
    stateFile: {
        path: `${APPS_STAGE}-deploy`,
        remote: true
    },
    variables: {
        APPS_STAGE,
        APPS_DEBUG
    },
    tags: {
        Project: 'Sequence Words',
        Owner: 'Well'
    },
    serveOptions: {
        localPort: 3735,
    }
};
