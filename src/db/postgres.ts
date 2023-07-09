import Sequelize, { Dialect } from 'sequelize';
import { config } from "../config/config";


type Environment = 'development' | 'test' | 'production';
const env: Environment = config.env as Environment;


const sequelize = new Sequelize.Sequelize(
    config.postgres[env].database,
    config.postgres[env].user,
    config.postgres[env].password,
    {
        dialect: config.postgres[env].dialect as Dialect,
        host: config.postgres[env].host,
        port: config.postgres[env].port,
    }
)

const testDbConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log("Connection has been established successfully.");
    } catch (error) {
        console.log("Unable to connect to the database", error);
    }
}

testDbConnection();

export default sequelize;