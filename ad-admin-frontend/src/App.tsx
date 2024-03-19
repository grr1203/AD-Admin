import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom';
import Main from './pages/Main';
import Login from './pages/Login';
import SideNavigatioinBar from './components/SideNavigationBar';
import DashBoard from './pages/DashBoard';
import User from './pages/User';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="login" element={<Login />} />
        <Route path="*" element={<MainLayout />}>
          <Route index element={<Main />} />
          <Route path="dashboard" element={<DashBoard />} />
          <Route path="user" element={<User />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

function MainLayout() {
  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw' }}>
      <SideNavigatioinBar />
      <div className="p-8 w-full">
        <Outlet />
      </div>
    </div>
  );
}

export default App;
