import type { FC } from 'react';

import { Tabs } from 'antd';
import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

import { addTag, removeTag, setActiveTag } from '@/stores/systems/tagsView.store';

import TagsViewAction from './tagViewAction';
import './index.less';

const TagsView: FC = () => {
  const { tags, activeTagId } = useSelector(state => state.tagsView);
  const { menuList, locale } = useSelector(state => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // onClick tag
  const onChange = (key: string) => {
    const tag = tags.find(tag => tag.menuPath === key);

    if (tag) {
      setCurrentTag(tag.menuPath);
    }
  };

  // onRemove tag
  const onClose = (targetKey: string) => {
    dispatch(removeTag(targetKey));
  };

  const setCurrentTag = useCallback(
    (id?: string) => {
      const tag = tags.find(item => {
        if (id) {
          return item.menuPath === id;
        } else {
          return item.menuPath === location.pathname;
        }
      });

      if (tag) {
        dispatch(setActiveTag(tag.menuPath));
      }
    },
    [dispatch, location.pathname, tags],
  );

  useEffect(() => {
    navigate(activeTagId);
  }, [activeTagId]);

  useEffect(() => {
    if (menuList.length) {
      const menu = menuList.find(m => m.menuPath === location.pathname);

      if (menu) {
        dispatch(
          addTag({
            ...menu,
            closable: menu.menuPath !== 'dashboard',
          }),
        );
      }
    }
  }, [dispatch, location.pathname, menuList]);

  return (
    <div id="pageTabs" style={{ padding: '6px 4px' }}>
      <Tabs
        className='tabs-header'
        tabBarStyle={{ margin: 0 }}
        onChange={onChange}
        activeKey={activeTagId}
        type="editable-card"
        hideAdd
        onEdit={(targetKey, action) => action === 'remove' && onClose(targetKey as string)}
        tabBarExtraContent={<TagsViewAction />}
        items={tags.map(tag => {
          return {
            key: tag.menuPath,
            closable: tag.closable,
            label: tag.menuName[locale]
          };
        })}
      />
    </div>
  );
};

export default TagsView;
