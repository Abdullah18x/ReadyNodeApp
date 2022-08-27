import express from 'express';
const cors = require('cors');
import * as YAML from 'yamljs';
import * as swaggerUi from 'swagger-ui-express';
import envConfig from './src/config/envConfig';
import {connector} from 'swagger-routes-express';
require('dotenv').config();

// Import Swagger Config
const options = require('./src/config/swaggerConfig');

// Import Controllers
const controllers = require('./src/controllers/index');

const app = express();
const port = 9090;
app.use(cors({
	credentials: true,
	origin: true,
}));
// App.set('trust proxy', 1);
app.use(express.json());
app.use(express.static('uploads'));

// Route Handling
const apiDefinition = YAML.load('api.yml');
const connect = connector(controllers, apiDefinition, options);

// Configure environment
if (process.env.NODE_ENV) {
	envConfig.loadConfig(process.env.NODE_ENV);
} else {
	throw new Error('ENV configuration name missing');
}

// Sync Models
import db, {migrateAll} from './src/models';
db.sequelize.authenticate();
(async function () {
	await migrateAll();
	// Connect App with YAML File
	app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(apiDefinition));
	connect(app);

	app.listen(port, () => console.log(`Express is listening at http://localhost:${port}`));
})();

