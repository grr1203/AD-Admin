import { SERVER_URL } from '@/constants/constants';
import { useDeviceList } from '@/hooks/useDevice';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function DashBoard() {
  const navigate = useNavigate();
  const { deviceList } = useDeviceList();

  // 로그인 체크
  useEffect(() => {
    if (!localStorage.getItem('currentId')) {
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
    }
  });

  return (
    <div className="p-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-semibold tracking-tight pb-1">Dashboard</h1>
        <p className="text-muted-foreground">등록된 클라이언트 수 : {deviceList?.length ?? 0}</p>
      </div>
    </div>
  );
}

export default DashBoard;
