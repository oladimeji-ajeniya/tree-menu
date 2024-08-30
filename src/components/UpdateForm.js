import React, { useState, useEffect } from "react";

const UpdateMenuForm = ({ initialData = {}, onSave }) => {
  console.log("initialData", initialData);
  const [parentId, setParentId] = useState(initialData.id || "");
  const [parentName, setParentName] = useState(initialData.label || "");

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [dept, setDept] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setParentId(initialData.id || "");
    setParentName(initialData.label || "");
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onSave({ name, slug, parent_id: parentId, order: dept });
      setSuccessMessage("Menu saved successfully!");
    } catch (error) {
      console.error("Error saving menu", error);
      setErrorMessage("Failed to save menu.");
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
          <label className="block text-gray-700">Slug</label>
          <input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="w-full px-3 py-2 bg-gray-100 rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Depth</label>
          <input
            value={dept}
            onChange={(e) => setDept(e.target.value)}
            type="number"
            className="w-full px-3 py-2 bg-gray-200 rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Parent</label>
          <input
            value={parentName}
            onChange={(e) => setParentName(e.target.value)}
            className="w-full px-3 py-2 bg-gray-200 rounded"
            required
            disabled
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
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
