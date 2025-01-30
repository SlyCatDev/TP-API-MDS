import sequelize from '../config/sequelize.js';
import { DataTypes } from 'sequelize';
import User from './User.js';

export const Role = sequelize.define('Role', {
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
    //options
    {
      hooks: {
        beforeCreate: async (user) => {
          if (user.password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
          }
        },
        beforeUpdate: async (user) => {
          if (user.changed('password')) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
          }
        }
      },
      tableName: 'role', // Nom exact de la table dans la BDD
      schema: 'Utilisateurs', // Nom du schéma de la table
      timestamps: false, // Désactive les colonnes `createdAt` et `updatedAt` par défaut
    });

// Définition de la relation entre Utilisateur et Role
Utilisateur.hasOne(Role, { foreignKey: 'idUtilisateur', as: 'role' });
Role.belongsTo(User, { foreignKey: 'idUtilisateur', as: 'utilisateur' });