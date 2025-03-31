const express = require('express');
const cors = require("cors");
const app = express();
const userRoutes = require('./src/routes/userRoutes');
const discoverRoutes = require('./src/routes/discoverRoutes');
const searchRoutes = require('./src/routes/searchRoutes');
const groupRoutes = require('./src/routes/groupRoutes');
const friendRoutes = require('./src/routes/friendRoutes');
<<<<<<< HEAD
const recordRoutes = require('./src/routes/recordRoutes');
const myPageRoutes = require('./src/routes/myPageRoutes');
const homeRoutes = require('./src/routes/homeRoutes');
const scheduleRoutes = require('./src/routes/scheduleRoutes');
=======
const myPageRoutes = require('./src/routes/myPageRoutes');
>>>>>>> 13486d3 (adding my page)
const port = process.env.PORT || 3034;

app.use(cors());
app.use(express.json());

// 기본 라우터 예시
app.get('/', (req, res) => {
  res.send('Hello, Study Management App!');
});

app.use('/api', userRoutes);
app.use('/api', discoverRoutes);
app.use('/api', searchRoutes);
app.use('/api/groups', groupRoutes);
<<<<<<< HEAD
app.use('/api', homeRoutes);
app.use('/api/friends', friendRoutes);
app.use('/api/records', recordRoutes);
app.use('/api', myPageRoutes);
app.use('/api', homeRoutes);
app.use('/api', scheduleRoutes);
=======
app.use('api/friends', friendRoutes);
app.use('/api', myPageRoutes);
>>>>>>> 13486d3 (adding my page)

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
