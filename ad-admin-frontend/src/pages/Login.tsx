import React, { useState } from 'react';

const Login: React.FC = () => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [autoLogin, setAutoLogin] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log('id:', id, 'Password:', password, 'autoLogin:', autoLogin);
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
    </div>
  );
};

export default Login;
