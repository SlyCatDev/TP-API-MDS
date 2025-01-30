import sequelize from '../config/sequelize.js';
import { DataTypes } from 'sequelize';
import bcrypt from 'bcrypt';


export const User = sequelize.define('Utilisateur', {
    idUtilisateur: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true, // La colonne est en auto-incrément
      allowNull: false, // Ne peut pas être NULL
    },
    nom: {
      type: DataTypes.STRING(100), // Correspond au type VARCHAR(100)
      allowNull: true, // Peut être NULL
    },
    prenom: {
      type: DataTypes.STRING(50), // Correspond au type VARCHAR(50)
      allowNull: true, // Peut être NULL
    },
    adresse_mail: {
      type: DataTypes.STRING(50), // Correspond au type VARCHAR(50)
      allowNull: false, // Ne peut pas être NULL
      validate: {
        isEmail: true, // Validation d'email intégrée
      },
    },
    telephone: {
      type: DataTypes.INTEGER, // Correspond au type INT
      allowNull: true, // Peut être NULL
      validate: {
        isNumeric: true, // Vérifie que la valeur est numérique
      },
    },
    password: {
      type: DataTypes.STRING(50), // Correspond au type VARCHAR(50)
      allowNull: true, // Peut être NULL
    },
    plaque_immatriculation: {
      type: DataTypes.STRING(10), // Correspond au type VARCHAR(50)
      allowNull: true, // Peut être NULL
    },
    role: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
  },
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
    }
  },
   {
    tableName: 'utilisateur', // Nom exact de la table dans la BDD
    schema: 'Utilisateurs', // Nom du schéma de la table
    timestamps: false, // Désactive les colonnes `createdAt` et `updatedAt` par défaut
});