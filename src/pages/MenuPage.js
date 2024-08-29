import React, { useState, useEffect } from "react";
import MenuList from "../components/MenuList";
import SideBar from "../components/SideBar";
import TreeView from "../components/TreeView";
import api from "../services/api";
import { Bars3Icon } from "@heroicons/react/24/outline"; // Ensure this path is correct

const MenuPage = () => {
  const [treeData, setTreeData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [shouldRefetch, setShouldRefetch] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Fetch data
  const fetchTreeData = async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get("/get-collasable-menus");
      setTreeData(data);
      setError(null);
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTreeData();
  }, [shouldRefetch]);

  const handleDelete = async (menuId) => {
    try {
      await api.delete(`/menus/${menuId}`);
      setShouldRefetch((prev) => !prev);
    } catch (error) {
      console.error("Error deleting menu", error);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading data</div>;

  return (
    <div className="relative">
      <div className="container mx-auto md:p-4 lg:p-6 xl:p-8">
        {/* Button to toggle the sidebar */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="md:hidden absolute top-4 left-4 p-2 text-gray-600 hover:text-gray-900"
        >
          <Bars3Icon className="h-6 w-6" />
        </button>
        <div className="flex">
          {/* Sidebar with conditional classes based on the sidebarOpen state */}
          <SideBar
            className={`fixed top-0 left-0 z-30 h-full bg-white shadow-lg transition-transform transform ${
              sidebarOpen ? "translate-x-0" : "-translate-x-full"
            } md:translate-x-0 md:relative md:w-64 md:block`}
          />
          {/* Main content area */}
          <div className={`flex-1 p-4 ${sidebarOpen ? "md:ml-64" : "md:ml-0"}`}>
            <TreeView data={treeData} />
            <MenuList
              menus={treeData}
              onEdit={(id) => {}}
              onDelete={handleDelete}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuPage;
