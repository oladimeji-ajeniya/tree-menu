import React, { useCallback, useEffect } from "react";
import { useRecoilState, atom } from "recoil";
import MenuList from "../components/MenuList";
import SideBar from "../components/SideBar";
import TreeView from "../components/TreeView";
import api from "../services/api";
import { Bars3Icon } from "@heroicons/react/24/outline";

const treeDataState = atom({
  key: "treeDataState",
  default: [],
});

const isLoadingState = atom({
  key: "isLoadingState",
  default: true,
});

const errorState = atom({
  key: "errorState",
  default: null,
});

const shouldRefetchState = atom({
  key: "shouldRefetchState",
  default: false,
});

const sidebarOpenState = atom({
  key: "sidebarOpenState",
  default: false,
});

const MenuPage = () => {
  const [treeData, setTreeData] = useRecoilState(treeDataState);
  const [isLoading, setIsLoading] = useRecoilState(isLoadingState);
  const [error, setError] = useRecoilState(errorState);
  const [shouldRefetch, setShouldRefetch] = useRecoilState(shouldRefetchState);
  const [sidebarOpen, setSidebarOpen] = useRecoilState(sidebarOpenState);

  const fetchTreeData = useCallback(async () => {
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
  }, [setTreeData, setError, setIsLoading]);

  useEffect(() => {
    fetchTreeData();
  }, [fetchTreeData, shouldRefetch]);

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
    <div className="relative flex flex-col h-screen">
      <div className="container mx-auto md:p-4 lg:p-6 xl:p-8 flex-1">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="hidden absolute top-4 left-4 p-2 text-gray-600 hover:text-gray-900 z-40"
        >
          <Bars3Icon className="h-6 w-6" />
        </button>
        <div className="flex flex-1">
          <SideBar
            className={`fixed top-0 left-0 z-30 h-full bg-white shadow-lg transition-transform transform ${
              sidebarOpen ? "translate-x-0" : "-translate-x-full"
            } md:translate-x-0 md:relative md:w-64`}
          />
          <div className="flex-1 p-4">
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
