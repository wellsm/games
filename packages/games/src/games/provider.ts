import type { Environment } from "@ez4/common"
import type { Http } from '@ez4/gateway';
import type { Db } from "@/database/config"

export declare class GameProvider implements Http.Provider {
    services: {
        variables: Environment.ServiceVariables;
        db: Environment.Service<Db>
    }
}