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
          <span id="sidebar-trigger" style={{ marginRight: collapsed ? '33px' : '20px' }}>{collapsed ? <MenuOutlined /> : <MenuOutlined />}</span>
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
          return (menu.data.length > 0) ? {
            key: menu.menuId,
            label: getTitle(menu),
            children: menu.data.map(child => ({
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
