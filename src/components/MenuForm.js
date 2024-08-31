import React, { useEffect } from "react";
import { useRecoilState, atom } from "recoil";
import api from "../services/api";

const uuidState = atom({
  key: "uuidState",
  default: "",
});

const nameStates = atom({
  key: "nameStates",
  default: "",
});

const parentIdStates = atom({
  key: "parentIdStates",
  default: "",
});

const orderState = atom({
  key: "orderState",
  default: 0,
});

const menusState = atom({
  key: "menusState",
  default: [],
});

const successMessageStates = atom({
  key: "successMessageStates",
  default: "",
});

const MenuForm = ({ initialData = {}, onSave }) => {
  const [uuid, setUuid] = useRecoilState(uuidState);
  const [name, setName] = useRecoilState(nameStates);
  const [parentId, setParentId] = useRecoilState(parentIdStates);
  const [order, setOrder] = useRecoilState(orderState);
  const [menus, setMenus] = useRecoilState(menusState);
  const [successMessage, setSuccessMessage] =
    useRecoilState(successMessageStates);

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const response = await api.get("/menus");
        setMenus(response.data);
      } catch (error) {
        console.error("Error fetching menus", error);
      }
    };

    fetchMenus();
  }, [setMenus]);

  useEffect(() => {
    setUuid(initialData.uuid || "");
    setName(initialData.label || "");
    setParentId(initialData.parent_id || "");
    setOrder(initialData.order || 0);
  }, [initialData, setUuid, setName, setParentId, setOrder]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onSave({ name, uuid, parent_id: parentId, order });
      setSuccessMessage("Menu saved successfully!");
    } catch (error) {
      console.error("Error saving menu", error);
      setSuccessMessage("Failed to save menu.");
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
          Save
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
    </div>
  );
};

export default MenuForm;
