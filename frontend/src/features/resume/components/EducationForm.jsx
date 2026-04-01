import React from "react";
import { Plus, Trash2 } from "lucide-react";

const EducationForm = ({ educationList, onChange }) => {
  const handleAdd = () => {
    onChange([
      ...educationList,
      { institution: "", degree: "", fieldOfStudy: "", dates: "" },
    ]);
  };

  const handleRemove = (index) => {
    const newList = [...educationList];
    newList.splice(index, 1);
    onChange(newList);
  };

  const handleChange = (index, field, value) => {
    const newList = [...educationList];
    newList[index] = { ...newList[index], [field]: value };
    onChange(newList);
  };

  return (
    <div className="space-y-6 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Education</h2>
        <button
          onClick={handleAdd}
          className="flex items-center text-sm px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg outline-none hover:bg-blue-100 transition-colors font-medium border border-blue-200"
        >
          <Plus size={16} className="mr-1" /> Add Education
        </button>
      </div>

      {educationList.map((edu, index) => (
        <div
          key={index}
          className="p-5 border border-gray-200 rounded-xl space-y-4 bg-gray-50/50"
        >
          <div className="flex justify-between items-center">
            <h3 className="text-md font-medium text-gray-700">
              Education {index + 1}
            </h3>
            <button
              onClick={() => handleRemove(index)}
              className="text-red-500 hover:text-red-700 p-1 bg-red-50 hover:bg-red-100 rounded-md transition-colors"
            >
              <Trash2 size={18} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Institution
              </label>
              <input
                type="text"
                value={edu.institution}
                onChange={(e) =>
                  handleChange(index, "institution", e.target.value)
                }
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                placeholder="University of California"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Degree
              </label>
              <input
                type="text"
                value={edu.degree}
                onChange={(e) => handleChange(index, "degree", e.target.value)}
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                placeholder="Bachelor of Science"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Field of Study
              </label>
              <input
                type="text"
                value={edu.fieldOfStudy}
                onChange={(e) =>
                  handleChange(index, "fieldOfStudy", e.target.value)
                }
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                placeholder="Computer Science"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dates
              </label>
              <input
                type="text"
                value={edu.dates}
                onChange={(e) => handleChange(index, "dates", e.target.value)}
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                placeholder="2018 - 2022"
              />
            </div>
          </div>
        </div>
      ))}

      {educationList.length === 0 && (
        <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-200 rounded-xl">
          No education added yet.
        </div>
      )}
    </div>
  );
};

export default EducationForm;
