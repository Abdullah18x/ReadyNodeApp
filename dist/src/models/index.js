'use strict';
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.migrateAll = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const sequelize_1 = require("sequelize");
const umzug_1 = require("umzug");
const umzug_2 = __importDefault(require("../umzug"));
const basename = path.basename(__filename);
// eslint-disable-next-line no-undef
const db = {};
const config = {
    database: process.env.database,
    username: process.env.username,
    password: process.env.password,
    host: process.env.host,
    dialect: 'mysql',
};
const sequelize = new sequelize_1.Sequelize(config.database, config.username, config.password, config);
fs
    .readdirSync(__dirname)
    .filter(file => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
    .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, sequelize_1.DataTypes);
    db[model.name] = model;
});
Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});
db.sequelize = sequelize;
db.Sequelize = sequelize_1.Sequelize;
const migrator = new umzug_1.Umzug({
    migrations: {
        glob: ['migrations/*.js', { cwd: umzug_2.default }],
        resolve({ name, path }) {
            const migration = require(path);
            return {
                // Adjust the parameters Umzug will
                // pass to migration methods when called
                name,
                up: () => __awaiter(this, void 0, void 0, function* () { return migration.up(db.sequelize.getQueryInterface(), sequelize_1.Sequelize); }),
                down: () => __awaiter(this, void 0, void 0, function* () { return migration.down(db.sequelize.getQueryInterface(), sequelize_1.Sequelize); }),
            };
        },
    },
    context: sequelize,
    storage: new umzug_1.SequelizeStorage({
        sequelize,
    }),
    logger: console,
});
function migrateAll() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Migrating Data............');
        yield migrator.up();
    });
}
exports.migrateAll = migrateAll;
exports.default = db;
//# sourceMappingURL=index.js.map