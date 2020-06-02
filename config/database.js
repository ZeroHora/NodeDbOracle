require('dotenv').config()

module.exports = {
  hrPool: {
    user: process.env.HR_USER || 'edvaldo',
    password: process.env.HR_PASSWORD || 'adm1234',
    connectString: process.env.HR_CONNECTIONSTRING || 'localhost/xe',
    poolMin: 10,
    poolMax: 10,
    poolIncrement: 0
  }
};