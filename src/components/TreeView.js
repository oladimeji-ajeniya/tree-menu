import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faChevronRight,
  faPlusCircle,
} from "@fortawesome/free-solid-svg-icons";
import api from "../services/api";
import MenuForm from "./MenuForm";
import AddMenu from "./AddForm";
import UpdateMenuForm from "./UpdateForm";
import Breadcrumb from "./Breadcrumb";
import CustomDropdown from "./CustomDropdown";

const TreeView = () => {
  const [expandedNodes, setExpandedNodes] = useState(new Set());
  const [hoveredNode, setHoveredNode] = useState(null);
  const [systemManagement, setSystemManagement] = useState(null);
  const [treeData, setTreeData] = useState([]);
  const [isTreeVisible, setIsTreeVisible] = useState(false);
  const [activeForm, setActiveForm] = useState(null);

  useEffect(() => {
    const fetchSystemManagement = async () => {
      try {
        const response = await api.get("/menus/top-level");
        console.log("response.data", response.data);
        setSystemManagement(response.data);
      } catch (error) {
        console.error("Error fetching System Management data", error);
      }
    };
    fetchSystemManagement();
  }, []);

  const fetchData = async (menuId) => {
    try {
      const response = await api.get(`/menus/${menuId}`);
      setTreeData(response.data || []);
      setIsTreeVisible(Boolean(response.data));
    } catch (error) {
      console.error("Error fetching tree data", error);
      setTreeData([]);
      setIsTreeVisible(false);
    }
  };

  const handleSelectChange = (event) => {
    const selectedMenuId = event.id;
    if (selectedMenuId && selectedMenuId !== "new-menu") {
      fetchData(selectedMenuId);
    } else {
      setTreeData([]);
      setIsTreeVisible(false);
    }
  };

  const handleToggle = (label) => {
    setExpandedNodes((prevNodes) => {
      const newNodes = new Set(prevNodes);
      if (newNodes.has(label)) {
        newNodes.delete(label);
      } else {
        newNodes.add(label);
      }
      return newNodes;
    });
  };

  const expandAll = () => {
    const collectLabels = (nodes) => {
      return nodes.reduce((acc, node) => {
        acc.add(node.label);
        if (node.children) {
          collectLabels(node.children).forEach((label) => acc.add(label));
        }
        return acc;
      }, new Set());
    };
    setExpandedNodes(collectLabels(treeData));
  };

  const collapseAll = () => {
    setExpandedNodes(new Set());
  };

  const handleNodeClick = (node) => {
    setActiveForm({ type: "edit", data: node });
  };

  const handleCreateNewChildNode = (node) => {
    setActiveForm({ type: "createChild", data: node });
  };

  const handleCreateNewNode = () => {
    setActiveForm({ type: "addNew" });
  };

  const handleSave = async (formData) => {
    try {
      const response = await api.post("/menus", formData);
      if (response.data.id) {
        const response = await api.get("/menus/top-level");
        setSystemManagement(response.data);
      }
    } catch (error) {
      console.error("Error saving data", error);
    }
    setActiveForm(null);
  };

  const renderActiveForm = () => {
    if (!activeForm) return null;

    const formProps = {
      onSave: handleSave,
      initialData: activeForm.data,
    };

    const formComponents = {
      edit: <MenuForm {...formProps} />,
      createChild: <UpdateMenuForm {...formProps} />,
      addNew: <AddMenu onSave={handleSave} />,
    };

    return (
      <div className="w-full mt-4 md:p-4 lg:w-2/5 xl:w-2/5 lg:ml-14 xl:ml-14">
        {formComponents[activeForm.type]}
      </div>
    );
  };

  const TreeNode = ({ node, level = 0 }) => {
    const isOpen = expandedNodes.has(node.label);

    return (
      <div
        className="relative mt-4"
        onMouseEnter={() => setHoveredNode(node.label)}
        onMouseLeave={() => setHoveredNode(null)}
      >
        {level > 0 && (
          <>
            <div
              className="absolute top-3 left-0 w-px bg-gray-400"
              style={{ height: "100%", left: "-1rem" }}
            ></div>
            <div
              className="absolute top-3 left-0 w-4 h-px bg-gray-400"
              style={{ left: "-1rem", transform: "translateY(-50%)" }}
            ></div>
          </>
        )}

        <div className="flex items-center mb-2">
          {node.children && (
            <button
              onClick={() => handleToggle(node.label)}
              className={`mr-2 ${
                isOpen ? "text-blue-600" : "text-gray-600"
              } hover:text-blue-800`}
            >
              <FontAwesomeIcon icon={isOpen ? faChevronDown : faChevronRight} />
            </button>
          )}
          <span
            className="font-medium hover:text-blue-500 cursor-pointer"
            onClick={() => handleNodeClick(node)}
          >
            {node.label}
          </span>
          {hoveredNode === node.label && (
            <button
              className="ml-2 text-blue-500 hover:text-blue-800"
              onClick={() => handleCreateNewChildNode(node)}
            >
              <FontAwesomeIcon icon={faPlusCircle} />
            </button>
          )}
        </div>

        {isOpen && node.children && (
          <div className="ml-8">
            {node.children.map((child, index) => (
              <TreeNode key={index} node={child} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="md:p-4 lg:p-2 xl:p-2 flex-row lg:flex-row w-full">
      <div className="w-full">
        <Breadcrumb />
        <div className="my-4">
          <div className="flex items-center my-4 lg:my-0">
            <div className="bg-blue-500 p-3 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
            </div>
            <h1 className=" md:p-4 ml-1 lg:p-6 xl:p-2 text-2xl font-bold text-gray-900">
              Menus
            </h1>
          </div>

          <div className="mb-4 sm:p-3 md:w-2/5 lg:w-2/5 xl:w-2/5">
            <label className="block text-gray-600 mb-2">Menu</label>
            <CustomDropdown
              options={systemManagement}
              onSelect={handleSelectChange}
              onCreateNew={handleCreateNewNode}
            />
          </div>
        </div>
      </div>
      {isTreeVisible && (
        <div className="flex flex-col lg:flex-row">
          <div className="lg:w-2/5 sm:ml-2 w-3/4">
            <div className="mb-4 flex w-full xl:w-3/4">
              <button
                onClick={expandAll}
                className="px-4 py-2 w-full bg-black mr-2 text-white rounded-full hover:bg-gray-800"
              >
                Expand All
              </button>
              <button
                onClick={collapseAll}
                className="px-4 py-2 w-full bg-white border text-black rounded-full hover:bg-gray-100"
              >
                Collapse All
              </button>
            </div>

            <div className="relative sm:pl-4">
              <div className="absolute top-0 left-0 w-px md:w-1/2 lg:w-64"></div>
              <div className="w-full">
                {treeData.length > 0 ? (
                  treeData.map((node, index) => (
                    <TreeNode key={index} node={node} />
                  ))
                ) : (
                  <p>No menus available</p>
                )}
              </div>
            </div>
          </div>

          {renderActiveForm()}
        </div>
      )}
    </div>
  );
};

export default TreeView;
