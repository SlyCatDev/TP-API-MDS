import sequelize from '../config/sequelize.js';
import { DataTypes } from 'sequelize';


export const User = sequelize.define('Utilisateur', 
  {
    idUtilisateur: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nom: {
      type: DataTypes.STRING(100),
      allowNull: true, 
    },
    prenom: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    adresse_mail: {
      type: DataTypes.STRING(50),
      allowNull: false, 
      validate: {
        isEmail: true, 
      },
    },
    telephone: {
      type: DataTypes.INTEGER,
      allowNull: true, 
      validate: {
        isNumeric: true, 
      },
    },
    password: {
      type: DataTypes.STRING(50), 
      allowNull: false,
    },
    plaque_immatriculation: {
      type: DataTypes.STRING(10), 
      allowNull: true, 
    },
  },
  //options
  {
    tableName: 'utilisateur', // Nom exact de la table dans la BDD
    schema: 'Utilisateurs', // Nom du schéma de la table
    timestamps: false, // Désactive les colonnes `createdAt` et `updatedAt` par défaut
  });