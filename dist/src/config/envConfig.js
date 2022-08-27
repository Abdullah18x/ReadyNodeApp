"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const YAML = __importStar(require("js-yaml"));
class envConfig {
    static loadConfig(env) {
        if (env === 'production') {
            process.env.username = process.env.PROD_USERNAME;
            process.env.password = process.env.PROD_PASSWORD;
            process.env.database = process.env.PROD_DATABASE;
            process.env.host = process.env.PROD_HOST;
        }
        else {
            const configFile = path.join(__dirname, 'env', `${env}.yml`);
            const envConfig = YAML.load(fs.readFileSync(configFile, 'utf-8'));
            process.env.password = envConfig.db.password;
            process.env.username = envConfig.db.username;
            process.env.database = envConfig.db.database;
            process.env.host = envConfig.db.host;
        }
    }
}
exports.default = envConfig;
//# sourceMappingURL=envConfig.js.map