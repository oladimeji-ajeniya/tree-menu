import React, { useEffect } from "react";
import { useRecoilState } from "recoil";
import api from "../services/api";

import { atom } from "recoil";

export const nameState = atom({
  key: "nameState",
  default: "",
});

export const parentIdState = atom({
  key: "parentIdState",
  default: "",
});

export const orderState = atom({
  key: "orderState",
  default: 0,
});

export const menusState = atom({
  key: "menusState",
  default: [],
});

export const successMessageState = atom({
  key: "successMessageState",
  default: "",
});

export const errorMessageState = atom({
  key: "errorMessageState",
  default: "",
});

export const loadingState = atom({
  key: "loadingState",
  default: false,
});

const AddMenu = ({ onAdd }) => {
  const [name, setName] = useRecoilState(nameState);
  const [parentId, setParentId] = useRecoilState(parentIdState);
  const [order, setOrder] = useRecoilState(orderState);
  const [menus, setMenus] = useRecoilState(menusState);
  const [successAddMenuMessage, setSuccessMessage] =
    useRecoilState(successMessageState);
  const [errorMessage, setErrorMessage] = useRecoilState(errorMessageState);
  const [loading, setLoading] = useRecoilState(loadingState);

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const response = await api.get("/menus");
        setMenus(response.data);
      } catch (error) {
        console.error("Error fetching menus", error);
        setErrorMessage("Failed to fetch menus.");
      }
    };

    fetchMenus();
  }, [setMenus, setErrorMessage]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const newMenu = { name, parent_id: parentId, order };
      await api.post("/menus", newMenu);
      setSuccessMessage("Menu added successfully!");
      setErrorMessage("");
      if (onAdd) onAdd();
    } catch (error) {
      console.error("Error adding menu", error);
      setSuccessMessage("");
      setErrorMessage("Failed to add menu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto w-full">
      <form onSubmit={handleSubmit} className="bg-white lg:p-4 xl:p-4">
        <div className="mb-4">
          <label className="block text-gray-700">Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 bg-gray-100 rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Parent Menu</label>
          <select
            value={parentId}
            onChange={(e) => setParentId(e.target.value)}
            className="w-full px-3 py-2 bg-gray-100 rounded"
          >
            <option value="">None</option>
            {menus.map((menu) => (
              <option key={menu.id} value={menu.id}>
                {menu.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Order</label>
          <input
            type="number"
            value={order}
            onChange={(e) => setOrder(parseInt(e.target.value, 10))}
            className="w-full px-3 py-2 bg-gray-100 rounded"
            required
          />
        </div>

        <button
          type="submit"
          className={`w-full py-2 rounded-full ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
          disabled={loading}
        >
          {loading ? <span>Loading...</span> : <span>Add Menu</span>}
        </button>
      </form>
      {successAddMenuMessage && (
        <div
          className={`mt-4 p-4 rounded ${
            successAddMenuMessage.includes("Failed")
              ? "bg-red-100 text-red-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {successAddMenuMessage}
        </div>
      )}
      {errorMessage && (
        <div className={`mt-4 p-4 rounded bg-red-100 text-red-700`}>
          {errorMessage}
        </div>
      )}
    </div>
  );
};

export default AddMenu;
