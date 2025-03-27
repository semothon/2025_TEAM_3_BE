const express = require('express');
const cors = require("cors");
const app = express();
const userRoutes = require('./src/routes/userRoutes');
// const discoverRoutes = require('./src/routes/discoverRoutes');
// const searchRoutes = require('./src/routes/searchRoutes');
// const groupRoutes = require('./src/routes/groupRoutes');
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// 기본 라우터 예시
app.get('/', (req, res) => {
  res.send('Hello, Study Management App!');
});

app.use('/api', userRoutes);
// app.use('/api', discoverRoutes);
// app.use('/api', searchRoutes);
// app.use('/api/groups', groupRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
