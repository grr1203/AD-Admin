import React, { useState } from 'react';
import { SERVER_URL } from '../constants/constants';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const Login: React.FC = () => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [autoLogin, setAutoLogin] = useState(false);
  const [openFailDialog, setOpenFailDialog] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log('id:', id, 'Password:', password, 'autoLogin:', autoLogin);

    const res = await fetch(`${SERVER_URL}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, password }),
    });

    if (res.status === 200) {
      if (autoLogin) {
        localStorage.setItem('id', id);
        localStorage.setItem('password', password);
      }
      navigate('/');
    } else setOpenFailDialog(await res.text());
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit}>
        <div className="logo">AD</div>
        <div>
          <input type="id" value={id} onChange={(e) => setId(e.target.value)} placeholder="ID" required />
        </div>
        <div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
        </div>
        <div className="form-footer">
          <input type="checkbox" id="loginCheckbox" onChange={() => setAutoLogin(!autoLogin)} />
          <label className="login-checkbox" htmlFor="loginCheckbox"></label>
          <label htmlFor="loginCheckbox">자동 로그인</label>
        </div>
        <button type="submit">Login</button>
      </form>
      <Dialog open={openFailDialog !== ''} onOpenChange={(open) => !open && setOpenFailDialog('')}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle style={{ marginBottom: '12px' }}>로그인 실패</DialogTitle>
            <DialogDescription style={{ marginBottom: '20px' }}>{openFailDialog}</DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-end">
            <DialogClose asChild>
              <Button>Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Login;
