import * as fs from 'fs';
import * as path from 'path';
import * as YAML from 'js-yaml';

export default class envConfig {
	public static loadConfig(env) {
		if (env === 'production') {
			process.env.username = process.env.PROD_USERNAME;
			process.env.password = process.env.PROD_PASSWORD;
			process.env.database = process.env.PROD_DATABASE;
			process.env.host = process.env.PROD_HOST;
		} else {
			const configFile = path.join(__dirname, 'env', `${env}.yml`);
			const envConfig = YAML.load(fs.readFileSync(configFile, 'utf-8'));
			process.env.password = envConfig.db.password;
			process.env.username = envConfig.db.username;
			process.env.database = envConfig.db.database;
			process.env.host = envConfig.db.host;
		}
	}
}

