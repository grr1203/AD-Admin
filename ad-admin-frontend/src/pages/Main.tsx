import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SERVER_URL = 'http://localhost:4001';

function Main() {
  const [file, setFile] = useState<File | null>(null);
  const navigate = useNavigate();

  // 자동 로그인 체크
  useEffect(() => {
    (async () => {
      const id = localStorage.getItem('id');
      const password = localStorage.getItem('password');

      if (id && password) {
        const res = await fetch(`${SERVER_URL}/api/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, password }),
        });

        if (res.status !== 200) navigate('/login');
      } else navigate('/login');
    })();
  }, []);

  const handleUpload = async () => {
    if (!file) {
      alert('Please select a file');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch(`${SERVER_URL}/ad`, {
      method: 'POST',
      body: formData,
    });
    if (res.ok) {
      const result = await res.json();
      console.log(result);
      alert('업로드 성공!');
    } else {
      alert('업로드 중 오류가 발생했습니다.');
    }
  };

  const handleAdList = async () => {
    const res = await fetch(`${SERVER_URL}/ad/list`);
    const result = await res.json();
    console.log('get ad list response:', result);
  };

  const updateAdMain = async () => {
    const res = await fetch(`${SERVER_URL}/ad/main`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fileName: '지지직지지직거리는옛날갬성티비.mp4' }),
    });
    const result = await res.json();
    console.log('update ad main response:', result);
  };

  return (
    <>
      <input
        type="file"
        accept="video/*,image/*"
        onChange={(event) => event.target.files && setFile(event.target.files[0])}
      />
      <button onClick={handleUpload}>POST ad</button>
      <button onClick={handleAdList}>GET ad/list</button>
      <button onClick={updateAdMain}>PUT ad/main</button>
    </>
  );
}

export default Main;
