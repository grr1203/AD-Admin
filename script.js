const { exec } = require('child_process');

exec('forever start build/server.js', (error, stdout, stderr) => {
  if (error) {
    console.error(`server 실행 중 오류 발생: ${error}`);
    return;
  }
  console.log(`server 실행 결과: ${stdout}`);
  console.error(`server 실행 오류: ${stderr}`);

  setTimeout(() => exec(`open 'http://127.0.0.1'`), 3000);
});
