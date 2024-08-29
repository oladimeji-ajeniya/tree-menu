import React from "react";

const MenuList = ({ menus, onEdit, onDelete }) => {
  const renderMenu = (menu) => (
    <li key={menu.id} className="mb-2">
      {menu.children && menu.children.length > 0 && (
        <ul className="ml-4">
          {menu.children.map((child) => renderMenu(child))}
        </ul>
      )}
    </li>
  );

  return <ul className="list-none">{menus.map((menu) => renderMenu(menu))}</ul>;
};

export default MenuList;
