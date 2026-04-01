import React, { useState } from "react";
import { Plus, Trash2, Edit2, Check } from "lucide-react";

const SUGGESTED_TITLES = [
  "Internships",
  "Projects",
  "Awards",
  "Certifications",
  "Languages",
  "Publications",
];

const CustomSectionForm = ({ sections, onChange }) => {
  const [newSectionTitle, setNewSectionTitle] = useState("");
  const [editingTitleId, setEditingTitleId] = useState(null);

  const handleAddSection = () => {
    if (!newSectionTitle.trim()) return;
    const newSection = {
      id: Date.now().toString(),
      title: newSectionTitle.trim(),
      items: [],
    };
    onChange([...sections, newSection]);
    setNewSectionTitle("");
  };

  const handleRemoveSection = (sectionId) => {
    onChange(sections.filter((s) => s.id !== sectionId));
  };

  const handleTitleChange = (sectionId, newTitle) => {
    onChange(
      sections.map((s) => (s.id === sectionId ? { ...s, title: newTitle } : s)),
    );
  };

  const handleAddItem = (sectionId) => {
    onChange(
      sections.map((s) => {
        if (s.id === sectionId) {
          return {
            ...s,
            items: [
              ...s.items,
              {
                title: "",
                subtitle: "",
                dates: "",
                description: "",
                link: "",
                imageUrl: "",
              },
            ],
          };
        }
        return s;
      }),
    );
  };

  const handleRemoveItem = (sectionId, itemIndex) => {
    onChange(
      sections.map((s) => {
        if (s.id === sectionId) {
          const newItems = [...s.items];
          newItems.splice(itemIndex, 1);
          return { ...s, items: newItems };
        }
        return s;
      }),
    );
  };

  const handleItemChange = (sectionId, itemIndex, field, value) => {
    onChange(
      sections.map((s) => {
        if (s.id === sectionId) {
          const newItems = [...s.items];
          newItems[itemIndex] = { ...newItems[itemIndex], [field]: value };
          return { ...s, items: newItems };
        }
        return s;
      }),
    );
  };

  return (
    <div className="space-y-6 bg-white p-6 rounded-xl shadow-sm border border-gray-100 mt-6">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Custom Sections</h2>
        <p className="text-sm text-gray-500 mt-1">
          Add any sections missing from your resume (Internships, Awards,
          Projects, etc).
        </p>
      </div>

      {/* Suggested & Add Section Header */}
      <div className="flex flex-col gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
        <div className="flex flex-wrap gap-2">
          {SUGGESTED_TITLES.map((title) => (
            <button
              key={title}
              onClick={() => setNewSectionTitle(title)}
              className="px-3 py-1.5 text-xs font-medium bg-white border border-gray-300 rounded-full text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
            >
              + {title}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 mt-2">
          <input
            type="text"
            value={newSectionTitle}
            onChange={(e) => setNewSectionTitle(e.target.value)}
            className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
            placeholder="e.g. Internships"
            onKeyDown={(e) => e.key === "Enter" && handleAddSection()}
          />
          <button
            onClick={handleAddSection}
            disabled={!newSectionTitle.trim()}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors font-medium"
          >
            <Plus size={16} className="mr-1" /> Add
          </button>
        </div>
      </div>

      {/* Render Sections */}
      {sections.map((section) => (
        <div
          key={section.id}
          className="border border-gray-200 rounded-xl overflow-hidden"
        >
          {/* Section Header */}
          <div className="bg-gray-100 px-4 py-3 flex justify-between items-center border-b border-gray-200">
            <div className="flex items-center gap-2">
              {editingTitleId === section.id ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={section.title}
                    onChange={(e) =>
                      handleTitleChange(section.id, e.target.value)
                    }
                    className="px-2 py-1 text-sm font-bold bg-white border border-gray-300 rounded focus:outline-none"
                    autoFocus
                    onBlur={() => setEditingTitleId(null)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && setEditingTitleId(null)
                    }
                  />
                  <button
                    onClick={() => setEditingTitleId(null)}
                    className="text-green-600 p-1"
                  >
                    <Check size={16} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-gray-800 text-lg uppercase tracking-wider">
                    {section.title}
                  </h3>
                  <button
                    onClick={() => setEditingTitleId(section.id)}
                    className="text-gray-400 hover:text-gray-600 p-1"
                  >
                    <Edit2 size={14} />
                  </button>
                </div>
              )}
            </div>
            <button
              onClick={() => handleRemoveSection(section.id)}
              className="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 p-1.5 rounded transition-colors"
              title="Delete Entire Section"
            >
              <Trash2 size={16} />
            </button>
          </div>

          {/* Items */}
          <div className="p-4 space-y-4 bg-white">
            {section.items.map((item, idx) => (
              <div
                key={idx}
                className="p-4 border border-gray-100 rounded-lg bg-gray-50/50 space-y-3 relative"
              >
                <button
                  onClick={() => handleRemoveItem(section.id, idx)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={16} />
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pr-8">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Title (e.g. Project Name)
                    </label>
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) =>
                        handleItemChange(
                          section.id,
                          idx,
                          "title",
                          e.target.value,
                        )
                      }
                      className="w-full px-3 py-1.5 text-sm bg-white border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Subtitle / Role (Optional)
                    </label>
                    <input
                      type="text"
                      value={item.subtitle}
                      onChange={(e) =>
                        handleItemChange(
                          section.id,
                          idx,
                          "subtitle",
                          e.target.value,
                        )
                      }
                      className="w-full px-3 py-1.5 text-sm bg-white border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Dates (Optional)
                    </label>
                    <input
                      type="text"
                      value={item.dates}
                      onChange={(e) =>
                        handleItemChange(
                          section.id,
                          idx,
                          "dates",
                          e.target.value,
                        )
                      }
                      className="w-full px-3 py-1.5 text-sm bg-white border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Link URL (Optional)
                    </label>
                    <input
                      type="text"
                      value={item.link}
                      onChange={(e) =>
                        handleItemChange(
                          section.id,
                          idx,
                          "link",
                          e.target.value,
                        )
                      }
                      className="w-full px-3 py-1.5 text-sm bg-white border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 outline-none"
                      placeholder="https://..."
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Image URL (Optional)
                    </label>
                    <input
                      type="text"
                      value={item.imageUrl}
                      onChange={(e) =>
                        handleItemChange(
                          section.id,
                          idx,
                          "imageUrl",
                          e.target.value,
                        )
                      }
                      className="w-full px-3 py-1.5 text-sm bg-white border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 outline-none"
                      placeholder="https://image..."
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    rows="3"
                    value={item.description}
                    onChange={(e) =>
                      handleItemChange(
                        section.id,
                        idx,
                        "description",
                        e.target.value,
                      )
                    }
                    className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 outline-none resize-none"
                    placeholder="Describe your achievements..."
                  />
                </div>
              </div>
            ))}

            <button
              onClick={() => handleAddItem(section.id)}
              className="w-full py-2 bg-gray-50 border border-dashed border-gray-300 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-colors flex justify-center items-center"
            >
              <Plus size={16} className="mr-1" /> Add entry to {section.title}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CustomSectionForm;
