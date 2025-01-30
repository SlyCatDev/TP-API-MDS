import sequelize from '../config/sequelize.js';
import { DataTypes } from 'sequelize';
import User from './User.js';

const Role = sequelize.define('Role', {
    idRole: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    nom: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    idUtilisateur: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Utilisateur,
        key: 'idUtilisateur',
      },
      onDelete: 'CASCADE',
    },
  },
  {
    tableName: 'role',
    timestamps: false,
});

// Définition de la relation entre Utilisateur et Role
Utilisateur.hasOne(Role, { foreignKey: 'idUtilisateur', as: 'role' });
Role.belongsTo(User, { foreignKey: 'idUtilisateur', as: 'utilisateur' });

export default Role;