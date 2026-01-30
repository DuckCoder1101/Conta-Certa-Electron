import React from 'react';

export type MenuOption = MenuLink | Submenu;
export interface MenuLink {
  name: string;
  link?: string;
  action?: () => void;
  icon: React.JSX.Element;
}

export interface Submenu {
  name: string;
  icon: React.JSX.Element;
  items: MenuLink[];
}