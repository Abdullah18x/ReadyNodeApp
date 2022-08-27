'use strict';

import * as fs from 'fs';
import * as path from 'path';
import {Sequelize, DataTypes} from 'sequelize';
import {SequelizeStorage, Umzug} from 'umzug';
import dir from '../umzug';
const basename = path.basename(__filename);

// eslint-disable-next-line no-undef
const db = {} as IDbConnection;

const config: any = {
	database: process.env.database,
	username: process.env.username,
	password: process.env.password,
	host: process.env.host,
	dialect: 'mysql',
};

const sequelize = new Sequelize(config.database, config.username, config.password, config);

fs
	.readdirSync(__dirname)
	.filter(file => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
	.forEach(file => {
		const model = require(path.join(__dirname, file))(sequelize, DataTypes);
		db[model.name] = model;
	});

Object.keys(db).forEach(modelName => {
	if (db[modelName].associate) {
		db[modelName].associate(db);
	}
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

const migrator = new Umzug({
	migrations: {
		glob: ['migrations/*.js', {cwd: dir}],
		resolve({name, path}) {
			const migration = require(path);
			return {
				// Adjust the parameters Umzug will
				// pass to migration methods when called
				name,
				up: async () => migration.up(db.sequelize.getQueryInterface(), Sequelize),
				down: async () => migration.down(db.sequelize.getQueryInterface(), Sequelize),
			};
		},
	},

	context: sequelize,
	storage: new SequelizeStorage({
		sequelize,
	}),
	logger: console,
});

async function migrateAll() {
	console.log('Migrating Data............');
	await migrator.up();
}

export default db;
export {migrateAll};
