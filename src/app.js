const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// 기본 라우터 예시
app.get('/', (req, res) => {
  res.send('Hello, Study Management App!');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
