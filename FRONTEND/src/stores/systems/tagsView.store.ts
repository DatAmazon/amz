import type { TagItem, TagState } from '@/interface/layout/tagsView.interface';
import type { PayloadAction } from '@reduxjs/toolkit';

import { createSlice } from '@reduxjs/toolkit';

const initialState: TagState = {
  activeTagId: location.pathname,
  tags: [],
};

const tagsViewSlice = createSlice({
  name: 'tagsView',
  initialState,
  reducers: {
    setActiveTag(state, action: PayloadAction<string>) {
      state.activeTagId = action.payload;
    },
    addTag(state, action: PayloadAction<TagItem>) {
      if (!state.tags.find(tag => tag.menuPath === action.payload.menuPath)) {
        state.tags.push(action.payload);
      }

      state.activeTagId = action.payload.menuPath;
    },
    removeTag(state, action: PayloadAction<string>) {
      const targetKey = action.payload;
      // dashboard cloud't be closed
      if (targetKey === state.tags[0].menuPath) {
        return;
      }

      const activeTagId = state.activeTagId;
      let lastIndex = 0;

      state.tags.forEach((tag, i) => {
        if (tag.menuPath === targetKey) {
          state.tags.splice(i, 1);
          lastIndex = i - 1;
        }
      });
      const tagList = state.tags.filter(tag => tag.menuPath !== targetKey);

      if (tagList.length && activeTagId === targetKey) {
        if (lastIndex >= 0) {
          state.activeTagId = tagList[lastIndex].menuPath;
        } else {
          state.activeTagId = tagList[0].menuPath;
        }
      }
    },
    removeAllTag(state) {
      state.activeTagId = state.tags[0].menuPath;
      state.tags = [state.tags[0]];
    },
    removeOtherTag(state) {
      const activeTag = state.tags.find(tag => tag.menuPath === state.activeTagId);
      const activeIsDashboard = activeTag!.menuPath === state.tags[0].menuPath;

      state.tags = activeIsDashboard ? [state.tags[0]] : [state.tags[0], activeTag!];
    },
  },
});

export const { setActiveTag, addTag, removeTag, removeAllTag, removeOtherTag } = tagsViewSlice.actions;

export default tagsViewSlice.reducer;
