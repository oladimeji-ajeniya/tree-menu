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

const TreeView = () => {
  const [expandedNodes, setExpandedNodes] = useState(new Set());
  const [hoveredNode, setHoveredNode] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showFormToCreateChild, setFormToCreateChild] = useState(false);
  const [showToAddNew, setShowToAddNew] = useState(false);

  const [selectedNode, setSelectedNode] = useState(null);
  const [systemManagement, setSystemManagement] = useState(null);
  const [treeData, setTreeData] = useState([]);
  const [isTreeVisible, setIsTreeVisible] = useState(false);

  const fetchSystemManagement = async () => {
    try {
      const response = await api.get("/menus/top-level");
      setSystemManagement(response.data[0]);
    } catch (error) {
      console.error("Error fetching System Management data", error);
    }
  };

  useEffect(() => {
    fetchSystemManagement();
  }, []);

  const fetchData = async (menuId) => {
    try {
      const response = await api.get(`/menus/${menuId}`);
      if (response.data) {
        setTreeData(response.data);
        setIsTreeVisible(true);
      } else {
        setTreeData([]);
        setIsTreeVisible(false);
      }
    } catch (error) {
      setTreeData([]);
      setIsTreeVisible(false);
    }
  };

  const handleSelectChange = (event) => {
    const selectedMenuId = event.target.value;
    if (selectedMenuId && selectedMenuId !== "new-menu") {
      fetchData(selectedMenuId);
    } else {
      setTreeData([]);
      setIsTreeVisible(false);
    }
  };

  const handleToggle = (label) => {
    const newExpandedNodes = new Set(expandedNodes);
    if (newExpandedNodes.has(label)) {
      newExpandedNodes.delete(label);
    } else {
      newExpandedNodes.add(label);
    }
    setExpandedNodes(newExpandedNodes);
  };

  const expandAll = () => {
    const allLabels = new Set();
    const getLabels = (nodes) => {
      nodes.forEach((node) => {
        allLabels.add(node.label);
        if (node.children) {
          getLabels(node.children);
        }
      });
    };
    getLabels(treeData);
    setExpandedNodes(allLabels);
  };

  const collapseAll = () => {
    setExpandedNodes(new Set());
  };

  const handleNodeClick = (node) => {
    console.log("node", node);
    setSelectedNode(node);
    setShowForm(true);
  };

  const handleCreateNewChildNode = () => {
    console.log("handleCreateNewChildNode");
    setFormToCreateChild(true);
  };

  const handleCreateNewNode = () => {
    console.log("handleCreateNewNode");
    setShowToAddNew(true);
  };

  const handleSave = async (formData) => {
    try {
      console.log("selectedNode", selectedNode);
      if (selectedNode) {
        await api.post("/menus", formData);
        if (selectedNode) {
          await fetchData(selectedNode.id);
        }
      }
    } catch (error) {}
    setShowForm(false);
    setSelectedNode(null);
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
    <div className="md:p-4 lg:p-6 xl:p-8 flex-row lg:flex-row w-full">
      <div className="w-full">
        <Breadcrumb />
        <div className="my-4">
          <div className="flex items-center my-4">
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
            <h1 className="ml-2 md:p-4 lg:p-6 xl:p-8 text-2xl font-bold text-gray-900">
              Menus
            </h1>
          </div>

          <div className="mb-4 sm:p-3 md:w-2/5 lg:w-2/5 xl:w-2/5">
            <label className="block text-gray-600 mb-2">Menu</label>
            <div className="relative">
              <select
                className="appearance-none w-full px-4 py-3 bg-gray-100 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={handleSelectChange}
                defaultValue=""
              >
                <option value="" disabled>
                  Select a menu
                </option>
                {systemManagement ? (
                  <option value={systemManagement.id}>
                    {systemManagement.name}
                  </option>
                ) : (
                  <option>Loading...</option>
                )}
                <option onClick={() => handleCreateNewNode()} value="new-menu">
                  Create New Menu
                </option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 3a1 1 0 00-.707.293l-6 6a1 1 0 001.414 1.414L10 5.414l5.293 5.293a1 1 0 001.414-1.414l-6-6A1 1 0 0010 3z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
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

          {showForm && (
            <div className="w-full mt-4 md:p-4 lg:w-2/5 xl:w-2/5 lg:ml-14 xl:ml-14">
              <MenuForm initialData={selectedNode} onSave={handleSave} />
            </div>
          )}

          {/* {showFormToCreateChild && (
            <div className="w-full mt-4 md:p-4 lg:w-2/5 xl:w-2/5 lg:ml-14 xl:ml-14">
              <UpdateMenuForm initialData={selectedNode} onSave={handleSave} />
            </div>
          )}

          {showToAddNew && (
            <div className="w-full mt-4 md:p-4 lg:w-2/5 xl:w-2/5 lg:ml-14 xl:ml-14">
              <AddMenu onSave={handleSave} />
            </div>
          )} */}
        </div>
      )}
    </div>
  );
};

export default TreeView;
