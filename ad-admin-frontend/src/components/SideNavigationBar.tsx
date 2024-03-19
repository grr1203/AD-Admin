import { Sidebar, Menu, MenuItem, sidebarClasses } from 'react-pro-sidebar';
import { Link } from 'react-router-dom';
import { MdPermMedia, MdSpaceDashboard } from 'react-icons/md';
import { RiAdminFill, RiComputerFill } from 'react-icons/ri';

const SideNavigatioinBar = () => {
  return (
    <Sidebar
      className="sidebar"
      rootStyles={{
        [`.${sidebarClasses.container}`]: {
          backgroundColor: '#222831',
          color: '#fff',
        },
      }}
    >
      <div className="title">AD</div>
      <div className="menu">Menu</div>
      <Menu
        menuItemStyles={{
          button: {
            [`&:hover`]: {
              backgroundColor: '#31363F',
              color: '#fff',
            },
          },
        }}
      >
        <MenuItem icon={<MdSpaceDashboard size="1.3em" />} component={<Link to="/dashboard" />}>
          대시보드
        </MenuItem>
        <MenuItem icon={<MdPermMedia size="1.1em" />} component={<Link to="/main" />}>
          컨텐츠 관리
        </MenuItem>
        <MenuItem icon={<RiComputerFill size="1.2em" />} component={<Link to="/device" />}>
          장치 관리
        </MenuItem>
        <MenuItem icon={<RiAdminFill size="1.2em" />} component={<Link to="/user" />}>
          관리자
        </MenuItem>
      </Menu>
    </Sidebar>
  );
};

export default SideNavigatioinBar;
