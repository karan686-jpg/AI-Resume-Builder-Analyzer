const axios = require('axios');
axios.post('http://localhost:3000/api/auth/register', {
  username: 'testuser' + Date.now(),
  email: 'test' + Date.now() + '@test.com',
  password: 'password123'
}).then(res => console.log(res.data)).catch(err => console.log(err.response?.data || err.message));
