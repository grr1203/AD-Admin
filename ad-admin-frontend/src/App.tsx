import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import SideNavigatioinBar from './components/SideNavigationBar';
import DashBoard from './pages/DashBoard';
import DeviceScreen from './pages/DeviceScreen';
import User from './pages/User';
import ContentManage from './pages/ContentManage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="login" element={<Login />} />
        <Route path="*" element={<MainLayout />}>
          <Route index element={<DashBoard />} />
          <Route path="dashboard" element={<DashBoard />} />
          <Route path="content" element={<ContentManage />} />
          <Route path="device" element={<DeviceScreen />} />
          <Route path="user" element={<User />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

function MainLayout() {
  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', backgroundColor: '#F9FBFC' }}>
      <SideNavigatioinBar />
      <div className="w-full">
        <Outlet />
      </div>
    </div>
  );
}

export default App;
