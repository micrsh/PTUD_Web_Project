const model = require('./models');
model.sequelize.sync().then(() => {
    console.log("tables created");
});