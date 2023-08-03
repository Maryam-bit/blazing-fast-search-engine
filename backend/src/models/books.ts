import { Model, Sequelize, DataTypes, IntegerDataType } from 'sequelize';

interface BookAttributes {
  isbn: string;
  book_title: string;
  book_author: string;
  year_of_publication: number;
  publisher: string;
  image_url_s: string;
  image_url_m: string;
  image_url_l: string;
}

class Book extends Model<BookAttributes> {
  public isbn!: string;
  public book_title!: string;
  public book_author!: string;
  public year_of_publication!: number;
  public publisher!: string;
  public image_url_s!: string;
  public image_url_m!: string;
  public image_url_l!: string;
  // Other model methods or associations can be defined here
}

export default (sequelize: Sequelize) => {
  Book.init(
    {
      isbn: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      book_title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      book_author: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      year_of_publication: {
        type: DataTypes.INTEGER,
      },
      publisher: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      image_url_s: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      image_url_m: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      image_url_l: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Book',
      tableName: 'Books',
      underscored: true,
    },
  );
  return Book;
};