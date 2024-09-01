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
  const [hoveredNode, setOnHoveredNode] = useState(null);
  const [menuOptions, setMenuOptions] = useState(null);
  const [treeData, setTreeData] = useState([]);
  const [isTreeVisible, setIsTreeVisible] = useState(false);
  const [activeForm, setActiveForm] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAllParentMenus = async () => {
      setLoading(true);
      try {
        const response = await api.get("/menus/top-level");
        setMenuOptions(response.data);
      } catch (error) {
        console.error("Error fetching top menu options", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllParentMenus();
  }, []);

  const fetchParentMenuById = async (menuId) => {
    setLoading(true);
    try {
      const response = await api.get(`/menus/${menuId}`);
      setTreeData(response.data || []);
    } catch (error) {
      console.error("Error fetching tree data", error);
      setTreeData([]);
      setIsTreeVisible(false);
    } finally {
      setLoading(false);
    }
  };

  const selectMenuChange = (event) => {
    const selectedMenuId = event.id;

    if (selectedMenuId && selectedMenuId !== "new-menu") {
      fetchParentMenuById(selectedMenuId);
      setIsTreeVisible(true);
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
      // Initialize an array to accumulate labels
      let labels = [];

      // loop over each node
      nodes.forEach((node) => {
        labels.push(node.label);
        if (node.children) {
          labels = labels.concat(collectLabels(node.children));
        }
      });

      return labels;
    };

    // Collect all labels from the treeData and convert them to a Set to get uniqueness
    const allLabels = collectLabels(treeData);
    setExpandedNodes(new Set(allLabels));
  };

  const collapseAll = () => {
    setExpandedNodes(new Set());
  };

  const handleNodeClick = (node) => {
    setShowForm(true);
    setActiveForm({ type: "edit", data: node });
  };

  const handleCreateNewChildNode = (node) => {
    setShowForm(true);
    setActiveForm({ type: "createChild", data: node });
  };

  const addNewMenuNode = () => {
    setIsTreeVisible(true);
    setShowForm(true);
    setActiveForm({ type: "addNew" });
  };

  const saveMenuNode = async (formData) => {
    setLoading(true);
    try {
      const response = await api.post("/menus", formData);
      if (response.data.id) {
        const response = await api.get("/menus/top-level");
        setMenuOptions(response.data);
      }
    } catch (error) {
      console.error("Error saving data", error);
    } finally {
      setLoading(false);
      setActiveForm(null);
    }
  };

  const renderActiveForm = () => {
    if (!activeForm) return null;

    const formProps = {
      onSave: saveMenuNode,
      initialData: activeForm.data,
    };

    const formComponents = {
      edit: <MenuForm {...formProps} />,
      createChild: <UpdateMenuForm {...formProps} />,
      addNew: <AddMenu onSave={saveMenuNode} />,
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
        onMouseEnter={() => setOnHoveredNode(node.label)}
        onMouseLeave={() => setOnHoveredNode(null)}
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
              options={menuOptions}
              onSelect={selectMenuChange}
              onCreateNew={addNewMenuNode}
            />
          </div>
        </div>
      </div>
      {loading ? (
        <div className="w-full flex justify-center items-center">
          <svg
            className="animate-spin h-20 w-20 text-blue-500"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 841.9 595.3"
          >
            <g fill="#61DAFB">
              <path d="M666.3 296.5c0-32.5-40.7-63.3-103.1-82.4 14.4-63.6 8-114.2-20.2-130.4-6.5-3.8-14.1-5.6-22.4-5.6v22.3c4.6 0 8.3.9 11.4 2.6 13.6 7.8 19.5 37.5 14.9 75.7-1.1 9.4-2.9 19.3-5.1 29.4-19.6-4.8-41-8.5-63.5-10.9-13.5-18.5-27.5-35.3-41.6-50 32.6-30.3 63.2-46.9 84-46.9V78c-27.5 0-63.5 19.6-99.9 53.6-36.4-33.8-72.4-53.2-99.9-53.2v22.3c20.7 0 51.4 16.5 84 46.6-14 14.7-28 31.4-41.3 49.9-22.6 2.4-44 6.1-63.6 11-2.3-10-4-19.7-5.2-29-4.7-38.2 1.1-67.9 14.6-75.8 3-1.8 6.9-2.6 11.5-2.6V78.5c-8.4 0-16 1.8-22.6 5.6-28.1 16.2-34.4 66.7-19.9 130.1-62.2 19.2-102.7 49.9-102.7 82.3 0 32.5 40.7 63.3 103.1 82.4-14.4 63.6-8 114.2 20.2 130.4 6.5 3.8 14.1 5.6 22.5 5.6 27.5 0 63.5-19.6 99.9-53.6 36.4 33.8 72.4 53.2 99.9 53.2 8.4 0 16-1.8 22.6-5.6 28.1-16.2 34.4-66.7 19.9-130.1 62-19.1 102.5-49.9 102.5-82.3zm-130.2-66.7c-3.7 12.9-8.3 26.2-13.5 39.5-4.1-8-8.4-16-13.1-24-4.6-8-9.5-15.8-14.4-23.4 14.2 2.1 27.9 4.7 41 7.9zm-45.8 106.5c-7.8 13.5-15.8 26.3-24.1 38.2-14.9 1.3-30 2-45.2 2-15.1 0-30.2-.7-45-1.9-8.3-11.9-16.4-24.6-24.2-38-7.6-13.1-14.5-26.4-20.8-39.8 6.2-13.4 13.2-26.8 20.7-39.9 7.8-13.5 15.8-26.3 24.1-38.2 14.9-1.3 30-2 45.2-2 15.1 0 30.2.7 45 1.9 8.3 11.9 16.4 24.6 24.2 38 7.6 13.1 14.5 26.4 20.8 39.8-6.3 13.4-13.2 26.8-20.7 39.9zm32.3-13c5.4 13.4 10 26.8 13.8 39.8-13.1 3.2-26.9 5.9-41.2 8 4.9-7.7 9.8-15.6 14.4-23.7 4.6-8 8.9-16.1 13-24.1zM421.2 430c-9.3-9.6-18.6-20.3-27.8-32 9 .4 18.2.7 27.5.7 9.4 0 18.7-.2 27.8-.7-9 11.7-18.3 22.4-27.5 32zm-74.4-58.9c-14.2-2.1-27.9-4.7-41-7.9 3.7-12.9 8.3-26.2 13.5-39.5 4.1 8 8.4 16 13.1 24 4.7 8 9.5 15.8 14.4 23.4zM420.7 163c9.3 9.6 18.6 20.3 27.8 32-9-.4-18.2-.7-27.5-.7-9.4 0-18.7.2-27.8.7 9-11.7 18.3-22.4 27.5-32zm-74 58.9c-4.9 7.7-9.8 15.6-14.4 23.7-4.6 8-8.9 16-13 24-5.4-13.4-10-26.8-13.8-39.8 13.1-3.1 26.9-5.8 41.2-7.9zm-90.5 125.2c-35.4-15.1-58.3-34.9-58.3-50.6 0-15.7 22.9-35.6 58.3-50.6 8.6-3.7 18-7 27.7-10.1 5.7 19.6 13.2 40 22.5 60.9-9.2 20.8-16.6 41.1-22.2 60.6-9.9-3.1-19.3-6.5-28-10.2zM310 490c-13.6-7.8-19.5-37.5-14.9-75.7 1.1-9.4 2.9-19.3 5.1-29.4 19.6 4.8 41 8.5 63.5 10.9 13.5 18.5 27.5 35.3 41.6 50-32.6 30.3-63.2 46.9-84 46.9-4.5-.1-8.3-1-11.3-2.7zm237.2-76.2c4.7 38.2-1.1 67.9-14.6 75.8-3 1.8-6.9 2.6-11.5 2.6-20.7 0-51.4-16.5-84-46.6 14-14.7 28-31.4 41.3-49.9 22.6-2.4 44-6.1 63.6-11 2.3 10.1 4.1 19.8 5.2 29.1zm38.5-66.7c-8.6 3.7-18 7-27.7 10.1-5.7-19.6-13.2-40-22.5-60.9 9.2-20.8 16.6-41.1 22.2-60.6 9.9 3.1 19.3 6.5 28.1 10.2 35.4 15.1 58.3 34.9 58.3 50.6-.1 15.7-23 35.6-58.4 50.6zM320.8 78.4z" />
              <circle cx="420.9" cy="296.5" r="45.7" />
              <path d="M520.5 78.1z" />
            </g>
          </svg>
        </div>
      ) : (
        isTreeVisible && (
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

            {showForm && renderActiveForm()}
          </div>
        )
      )}
    </div>
  );
};

export default TreeView;
