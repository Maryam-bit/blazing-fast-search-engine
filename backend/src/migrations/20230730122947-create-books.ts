'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface: any, Sequelize: any) {
    await queryInterface.createTable('Books', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      isbn: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      book_title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      book_author: {
        type: Sequelize.STRING,
        allowNull: false
      },
      year_of_publication: {
        type: Sequelize.INTEGER
      },
      publisher: {
        type: Sequelize.STRING,
        allowNull: false
      },
      image_url_s: {
        type: Sequelize.STRING,
        allowNull: false
      },
      image_url_m: {
        type: Sequelize.STRING,
        allowNull: false
      },
      image_url_l: {
        type: Sequelize.STRING,
        allowNull: false
      },
      created_at: {
				allowNull: false,
				type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
			},
			updated_at: {
				allowNull: false,
				type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      }
    });

    // add indexes
    await queryInterface.addIndex('Books', ['book_author']);
    await queryInterface.addIndex('Books', ['book_title']);
  },
  async down(queryInterface: any, Sequelize: any) {
    await queryInterface.removeIndex('Books', ['book_author']);
    await queryInterface.removeIndex('Books', ['book_title']);
    await queryInterface.dropTable('Books');
  }
};