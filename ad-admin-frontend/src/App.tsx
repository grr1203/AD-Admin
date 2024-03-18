import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom';
import Main from './pages/Main';
import Login from './pages/Login';
import SideNavigatioinBar from './components/SideNavigationBar';
import DashBoard from './pages/DashBoard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="login" element={<Login />} />
        <Route path="*" element={<MainLayout />}>
          <Route index element={<Main />} />
          <Route path="dashboard" element={<DashBoard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

function MainLayout() {
  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <SideNavigatioinBar />
      <Outlet />
    </div>
  );
}

export default App;
