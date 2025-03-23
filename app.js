const express = require('express');
const cors = require(cors);
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// 기본 라우터 예시
app.get('/', (req, res) => {
  res.send('Hello, Study Management App!');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
