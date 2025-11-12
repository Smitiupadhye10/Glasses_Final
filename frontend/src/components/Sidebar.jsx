import React from "react";

const Sidebar = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: "products", label: "Products" },
    { id: "orders", label: "Orders" },
    { id: "users", label: "Users" },
  ];

  return (
    <div className="w-64 bg-white shadow flex flex-col">
      <h1 className="text-xl font-bold p-4 border-b">Admin Panel</h1>
      <ul className="flex flex-col mt-4">
        {tabs.map((tab) => (
          <li
            key={tab.id}
            className={`p-4 cursor-pointer hover:bg-gray-200 ${
              activeTab === tab.id ? "bg-gray-200 font-semibold" : ""
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
