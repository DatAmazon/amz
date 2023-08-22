import type { MenuList } from '../../interface/layout/menu.interface';
import type { FC } from 'react';

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
}

const MenuComponent: FC<MenuProps> = props => {
  const { menuList, openKey, onChangeOpenKey, selectedKey, onChangeSelectedKey } = props;
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
    ></Menu>
  );
};

export default MenuComponent;
