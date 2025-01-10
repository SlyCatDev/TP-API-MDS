import { Sequelize } from "sequelize";

const sequelize = new Sequelize('boutique_info','api_admin','admin',{
    host: 'localhost',
    dialect: 'mssql',
    port: 1433,
  dialectOptions: {
    options: {
      trustServerCertificate: true, // Nécessaire si vous utilisez des certificats locaux non validés
    },
  },
});

export default sequelize;