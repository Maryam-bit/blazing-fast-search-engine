import { Model, Sequelize, DataTypes } from 'sequelize';

interface UserAttributes {
  id: string;
  name: string;
  email: string;
}

class User extends Model<UserAttributes> {
  public id!: string;
  public name!: string;
  public email!: string;

  // Other model methods or associations can be defined here
}

export default (sequelize: Sequelize) => {
  User.init(
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'Users',
      underscored: true,
    },
  );
  return User;
};
