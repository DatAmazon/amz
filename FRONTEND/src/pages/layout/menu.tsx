// import React, { useState } from 'react';
// import {
//   AppstoreOutlined,
//   ContainerOutlined,
//   DesktopOutlined,
//   MailOutlined,
//   MenuFoldOutlined,
//   MenuUnfoldOutlined,
//   PieChartOutlined,
// } from '@ant-design/icons';
// import type { MenuProps } from 'antd';
// import { Button, Menu } from 'antd';

// type MenuItem = Required<MenuProps>['items'][number];

// function getItem(
//   label: React.ReactNode,
//   key: React.Key,
//   icon?: React.ReactNode,
//   children?: MenuItem[],
//   type?: 'group',
// ): MenuItem {
//   return {
//     key,
//     icon,
//     children,
//     label,
//     type,
//   } as MenuItem;
// }

// const items: MenuItem[] = [
//   getItem('Option 1', '1', <PieChartOutlined />),
//   getItem('Option 2', '2', <DesktopOutlined />),
//   getItem('Option 3', '3', <ContainerOutlined />),

//   getItem('Navigation One', 'sub1', <MailOutlined />, [
//     getItem('Option 5', '5'),
//     getItem('Option 6', '6'),
//     getItem('Option 7', '7'),
//     getItem('Option 8', '8'),
//   ]),

//   getItem('Navigation Two', 'sub2', <AppstoreOutlined />, [
//     getItem('Option 9', '9'),
//     getItem('Option 10', '10'),

//     getItem('Submenu', 'sub3', null, [getItem('Option 11', '11'), getItem('Option 12', '12')]),
//   ]),
// ];

// const App: React.FC = () => {
//   const [collapsed, setCollapsed] = useState(false);

//   const toggleCollapsed = () => {
//     setCollapsed(!collapsed);
//   };

//   return (
//     <div style={{ width: 256 }}>
//       <Button type="primary" onClick={toggleCollapsed} style={{ marginBottom: 16 }}>
//         {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
//       </Button>
//       <Menu
//         defaultSelectedKeys={['1']}
//         defaultOpenKeys={['sub1']}
//         mode="inline"
//         theme="dark"
//         inlineCollapsed={collapsed}
//         items={items}
//       />
//     </div>
//   );
// };

// export default App;




import type { MenuList } from '../../interface/layout/menu.interface';
import type { FC } from 'react';

import MinvoiceLogo from '@/assets/logo/minvoice_horizontal.svg';
import { MenuOutlined } from '@ant-design/icons';

import { Menu } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { setUserItem } from '@/stores/users/user.store';
import { CustomIcon } from './customIcon';

interface MenuProps {
  menuList: MenuList;
  openKey?: string;
  onChangeOpenKey: (key?: string) => void;
  selectedKey: string;
  onChangeSelectedKey: (key: string) => void;
  collapsed: boolean;
  toggle: () => void;
}

const MenuComponent: FC<MenuProps> = props => {
  const { menuList, openKey, onChangeOpenKey, selectedKey, onChangeSelectedKey, collapsed, toggle } = props;
  const { device, locale } = useSelector(state => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const getTitle = (menu: MenuList[0]) => {
    return (
      <span style={{ display: 'flex', alignItems: 'center' }}>
        <CustomIcon type={menu.menuIcon!} />
        <span>{menu.menuName[locale]}</span>
      </span>
    );
  };

  const onMenuClick = (path: string) => {
    onChangeSelectedKey(path);
    navigate(path);

    if (device !== 'DESKTOP') {
      dispatch(setUserItem({ collapsed: true }));
    }
  };


  const onOpenChange = (keys: string[]) => {
    const key = keys.pop();
    onChangeOpenKey(key);
  };

  return (
    <>
      <div className='layout-page-menu-header'>
        {device !== 'MOBILE' && (
          <div className="logo" style={{ width: collapsed ? 80 : 200 }}>
            <img src={MinvoiceLogo} hidden={collapsed} alt="" style={{ marginRight: collapsed ? '2px' : '20px' }} />
          </div>
        )}
        <div className='sidebar' onClick={toggle}>
          <a id="sidebar-trigger" style={{ marginRight: collapsed ? '33px' : '20px' }}>{collapsed ? <MenuOutlined /> : <MenuOutlined />}</a>
        </div>
      </div>
      <Menu
        mode="inline"
        selectedKeys={[selectedKey]}
        openKeys={openKey ? [openKey] : []}
        onOpenChange={onOpenChange}
        onSelect={k => onMenuClick(k.key)}
        className="layout-page-sider-menu text-2"
        items={menuList.map(menu => {
          return (menu.data?.length > 0) ? {
            key: menu.menuId,
            label: getTitle(menu),
            children: menu.data?.map(child => ({
              key: child.menuPath,
              label: child.menuName[locale],
            })),
          } : {
            key: menu.menuPath,
            label: getTitle(menu),
          };
        })}
      >

      </Menu>
    </>
  );
};

export default MenuComponent;
