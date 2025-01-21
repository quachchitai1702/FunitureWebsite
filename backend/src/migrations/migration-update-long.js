module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn('ProductImages', 'imageUrl', {
        type: Sequelize.BLOB('long'),
        allowNull: true,
      })
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn('ProductImages', 'imageUrl', {
        type: Sequelize.STRING,
        allowNull: true,
      })
    ])
  }
};