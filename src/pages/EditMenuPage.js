import React from "react";
import MenuForm from "../components/MenuForm";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "react-query";
import api from "../services/api";

const EditMenuPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: menu, isLoading } = useQuery(["menu", id], async () => {
    const { data } = await api.get(`/menus/${id}`);
    return data;
  });

  const updateMenuMutation = useMutation(
    (updatedMenu) => api.put(`/menus/${id}`, updatedMenu),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("menus");
        navigate("/menus");
      },
    }
  );

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto xl:p-4 lg:p-4">
      <h1 className="text-2xl font-bold xl:mb-4 lg:p-4">Edit Menu</h1>
      <MenuForm
        initialData={menu}
        onSave={(data) => updateMenuMutation.mutate(data)}
      />
    </div>
  );
};

export default EditMenuPage;
