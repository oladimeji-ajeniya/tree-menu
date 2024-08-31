import React from "react";
import { atom } from "recoil";
import { useRecoilState } from "recoil";
import {
  FaCog,
  FaUsers,
  FaCode,
  FaSlidersH,
  FaList,
  FaCloud,
} from "react-icons/fa";
import { Collapse } from "react-collapse";

export const sidebarState = atom({
  key: "sidebarState",
  default: {
    systemManagement: true,
    usersGroups: false,
  },
});

const SideBar = () => {
  const [open, setOpen] = useRecoilState(sidebarState);

  const toggle = (section) => {
    setOpen((prevOpen) => ({
      ...prevOpen,
      [section]: !prevOpen[section],
    }));
  };

  return (
    <div className="w-64 hidden lg:block h-screen mb-12 bg-gray-800 text-white p-4 rounded-lg flex flex-col">
      <h2 className="text-xl font-semibold mb-4">Systems</h2>
      <div
        className={`mb-4 ${
          open.systemManagement ? "bg-gray-700" : ""
        } rounded-lg`}
      >
        <div
          className={`flex items-center justify-between cursor-pointer p-2 rounded-lg hover:bg-green-600 hover:text-white transition-colors ${
            open.systemManagement ? "bg-gray-700 text-white" : ""
          }`}
          onClick={() => toggle("systemManagement")}
        >
          <div className="flex items-center space-x-2">
            <FaCog />
            <span className="text-sm font-normal">System Management</span>
          </div>
        </div>
        <Collapse isOpened={open.systemManagement}>
          <ul className="space-y-1">
            <li className="flex text-sm items-center space-x-2 hover:bg-green-400 hover:text-white p-2 rounded-lg cursor-pointer transition-colors">
              <FaCode />
              <span>System Code</span>
            </li>
            <li className="flex text-sm items-center space-x-2 hover:bg-green-400 hover:text-white p-2 rounded-lg cursor-pointer transition-colors">
              <FaSlidersH />
              <span>Properties</span>
            </li>
            <li className="flex text-sm items-center space-x-2 hover:bg-green-400 hover:text-white p-2 rounded-lg cursor-pointer transition-colors">
              <FaList />
              <span>Menus</span>
            </li>
            <li className="flex text-sm items-center space-x-2 hover:bg-green-400 hover:text-white p-2 rounded-lg cursor-pointer transition-colors">
              <FaCloud />
              <span>API List</span>
            </li>
          </ul>
        </Collapse>
      </div>
      <div
        className={`mb-4 ${open.usersGroups ? "bg-gray-700" : ""} rounded-lg`}
      >
        <div
          className={`flex items-center justify-between cursor-pointer p-2 rounded-lg hover:bg-green-600 hover:text-white transition-colors ${
            open.usersGroups ? "bg-gray-700 text-white" : ""
          }`}
          onClick={() => toggle("usersGroups")}
        >
          <div className="flex items-center space-x-2">
            <FaUsers />
            <span className="text-sm font-normal">Users & Groups</span>
          </div>
        </div>
        <Collapse isOpened={open.usersGroups}>
          <ul className="">
            <li className="flex text-sm items-center space-x-2 hover:bg-green-600 hover:text-white p-2 rounded-lg cursor-pointer transition-colors">
              <FaUsers />
              <span>Users</span>
            </li>
            <li className="flex text-sm items-center space-x-2 hover:bg-green-600 hover:text-white p-2 rounded-lg cursor-pointer transition-colors">
              <FaUsers />
              <span>Groups</span>
            </li>
          </ul>
        </Collapse>
      </div>
    </div>
  );
};

export default SideBar;
