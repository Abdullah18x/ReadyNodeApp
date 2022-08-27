import * as sequelize from 'sequelize';

declare global {
  interface IDbConnection {
    sequelize: any;
    Sequelize: any;
  }
}
