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
    await queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS pg_trgm;');

    // Create the trigram (case insensitive) index 
    await queryInterface.sequelize.query('CREATE INDEX idx_books_author_trgm_unique ON "Books" USING gin (book_author gin_trgm_ops);');
    await queryInterface.sequelize.query('CREATE INDEX idx_books_title_trgm_unique ON "Books" USING gin (book_title gin_trgm_ops);');
  },
  async down(queryInterface: any, Sequelize: any) {
    await queryInterface.sequelize.query('DROP INDEX IF EXISTS idx_books_author_trgm_unique;');
    await queryInterface.sequelize.query('DROP INDEX IF EXISTS idx_books_title_trgm_unique;');
    await queryInterface.dropTable('Books');
  }
};