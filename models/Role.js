import sequelize from '../config/sequelize.js';
import { DataTypes } from 'sequelize';
import { User } from '../models/User.js';

export const Role = sequelize.define('Role', 
    {
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
            model: User,
            key: 'idUtilisateur',
        },
    },
}, {
    tableName: 'role',
    schema: 'Utilisateurs',
    timestamps: false,
});

// Définition des relations (sans `onDelete: 'CASCADE'`, car déjà géré en SQL)
User.hasOne(Role, { foreignKey: 'idUtilisateur', as: 'role' });
Role.belongsTo(User, { foreignKey: 'idUtilisateur', as: 'utilisateur' });