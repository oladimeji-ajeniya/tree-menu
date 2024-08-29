import React, { useState, useEffect } from "react";
import api from "../services/api";

const UpdateMenuForm = ({ menuId, onUpdate }) => {
  const [uuid, setUuid] = useState("");
  const [name, setName] = useState("");
  const [parentId, setParentId] = useState("");
  const [order, setOrder] = useState(0);
  const [menus, setMenus] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        const response = await api.get(`/menus/${menuId}`);
        const menu = response.data;
        setUuid(menu.uuid);
        setName(menu.name);
        setParentId(menu.parent_id || "");
        setOrder(menu.order || 0);
      } catch (error) {
        console.error("Error fetching menu data", error);
        setErrorMessage("Failed to fetch menu data.");
      }
    };

    const fetchMenus = async () => {
      try {
        const response = await api.get("/menus");
        setMenus(response.data);
      } catch (error) {
        console.error("Error fetching menus", error);
        setErrorMessage("Failed to fetch menus.");
      }
    };

    fetchMenuData();
    fetchMenus();
  }, [menuId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedMenu = { name, uuid, parent_id: parentId, order };
      await api.put(`/menus/${menuId}`, updatedMenu);
      setSuccessMessage("Menu updated successfully!");
      setErrorMessage("");
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error("Error updating menu", error);
      setSuccessMessage("");
      setErrorMessage("Failed to update menu.");
    }
  };

  return (
    <div className="container mx-auto w-full">
      <form onSubmit={handleSubmit} className="bg-white lg:p-4 xl:p-4">
        <div className="mb-4">
          <label className="block text-gray-700">MenuId</label>
          <input
            value={uuid}
            onChange={(e) => setUuid(e.target.value)}
            className="w-full px-3 py-2 bg-gray-100 rounded"
            required
            disabled
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Depth</label>
          <input
            type="number"
            value={order}
            onChange={(e) => setOrder(parseInt(e.target.value, 10))}
            className="w-full sm:w-1/2 px-3 py-2 bg-gray-200 rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">ParentData</label>
          <select
            value={parentId}
            onChange={(e) => setParentId(e.target.value)}
            className="w-full sm:w-1/2 px-3 py-2 bg-gray-100 rounded"
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
          <label className="block text-gray-700">Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full sm:w-1/2 px-3 py-2 bg-gray-100 rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full sm:w-1/2 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
        >
          Update
        </button>
      </form>
      {successMessage && (
        <div
          className={`mt-4 p-4 rounded ${
            successMessage.includes("Failed")
              ? "bg-red-100 text-red-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {successMessage}
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

export default UpdateMenuForm;
