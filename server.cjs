const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 8080;

// 리액트가 빌드한 파일들(dist 폴더)을 손님에게 서빙합니다.
app.use(express.static(path.join(__dirname, 'dist')));

// 어떤 주소로 들어오든 무조건 index.html을 보여줍니다 (SPA 방식)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
