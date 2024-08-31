import React from "react";
import { useRecoilState, atom } from "recoil";

const isOpenState = atom({
  key: "isOpenState",
  default: false,
});

const selectedOptionState = atom({
  key: "selectedOptionState",
  default: null,
});

const CustomDropdown = ({ options, onSelect, onCreateNew }) => {
  const [isOpen, setIsOpen] = useRecoilState(isOpenState);
  const [selectedOption, setSelectedOption] =
    useRecoilState(selectedOptionState);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
    if (onSelect) {
      onSelect(option);
    }
  };

  const handleCreateNewClick = () => {
    setIsOpen(false);
    if (onCreateNew) {
      onCreateNew();
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 bg-gray-100 text-gray-900 rounded-lg flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <span>{selectedOption ? selectedOption.name : "Select a menu"}</span>
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
      </button>
      {isOpen && (
        <div className="absolute mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-10">
          <ul className="max-h-60 overflow-y-auto">
            {options.length > 0 ? (
              options.map((option) => (
                <li
                  key={option.id}
                  onClick={() => handleOptionClick(option)}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  {option.name}
                </li>
              ))
            ) : (
              <li className="px-4 py-2 text-gray-500">No options available</li>
            )}
          </ul>
          <div className="border-t border-gray-300">
            <button
              onClick={handleCreateNewClick}
              className="w-full px-4 py-2 text-blue-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Create New Menu
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;
