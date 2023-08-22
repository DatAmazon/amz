export type TagItem = {
  menuId: string;
  menuName: {
    zh_CN: string;
    en_US: string;
  };
  /** tag's route path */
  menuPath: string;
  /** can be closed ? */
  closable: boolean;
};

export interface TagState {
  /** tagsView list */
  tags: TagItem[];
  /**current tagView id */
  activeTagId: TagItem['menuPath'];
}
