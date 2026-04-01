import React, { useState } from "react";
import { enhanceExperience } from "../services/resume.api";
import { Sparkles, Loader2, Plus, Trash2 } from "lucide-react";

const ExperienceForm = ({ experienceList, onChange }) => {
  const [enhancingIndex, setEnhancingIndex] = useState(null);

  const handleAdd = () => {
    onChange([
      ...experienceList,
      { company: "", role: "", dates: "", description: "" },
    ]);
  };

  const handleRemove = (index) => {
    const newList = [...experienceList];
    newList.splice(index, 1);
    onChange(newList);
  };

  const handleChange = (index, field, value) => {
    const newList = [...experienceList];
    newList[index] = { ...newList[index], [field]: value };
    onChange(newList);
  };

  const handleEnhance = async (index) => {
    const exp = experienceList[index];
    if (!exp.description || !exp.role || !exp.company) return;

    setEnhancingIndex(index);
    try {
      const improvedText = await enhanceExperience(
        exp.description,
        exp.role,
        exp.company,
      );
      handleChange(index, "description", improvedText);
    } catch (error) {
      console.error("Failed to enhance experience", error);
    } finally {
      setEnhancingIndex(null);
    }
  };

  return (
    <div className="space-y-6 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Experience</h2>
        <button
          onClick={handleAdd}
          className="flex items-center text-sm px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg outline-none hover:bg-blue-100 transition-colors font-medium border border-blue-200"
        >
          <Plus size={16} className="mr-1" /> Add Experience
        </button>
      </div>

      {experienceList.map((exp, index) => (
        <div
          key={index}
          className="p-5 border border-gray-200 rounded-xl space-y-4 bg-gray-50/50"
        >
          <div className="flex justify-between items-center">
            <h3 className="text-md font-medium text-gray-700">
              Experience {index + 1}
            </h3>
            <button
              onClick={() => handleRemove(index)}
              className="text-red-500 hover:text-red-700 p-1 bg-red-50 hover:bg-red-100 rounded-md transition-colors"
              title="Remove"
            >
              <Trash2 size={18} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company
              </label>
              <input
                type="text"
                value={exp.company}
                onChange={(e) => handleChange(index, "company", e.target.value)}
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                placeholder="Google"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Job Title / Role
              </label>
              <input
                type="text"
                value={exp.role}
                onChange={(e) => handleChange(index, "role", e.target.value)}
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                placeholder="Software Engineer"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dates (Duration)
              </label>
              <input
                type="text"
                value={exp.dates}
                onChange={(e) => handleChange(index, "dates", e.target.value)}
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                placeholder="Jan 2020 - Present"
              />
            </div>
          </div>

          <div className="space-y-2 mt-4">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <button
                onClick={() => handleEnhance(index)}
                disabled={
                  enhancingIndex === index ||
                  !exp.description ||
                  !exp.role ||
                  !exp.company
                }
                className="flex items-center text-xs px-3 py-1.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50 transition-all"
              >
                {enhancingIndex === index ? (
                  <Loader2 className="animate-spin mr-1" size={14} />
                ) : (
                  <Sparkles className="mr-1" size={14} />
                )}
                {enhancingIndex === index ? "Enhancing..." : "Enhance with AI"}
              </button>
            </div>
            <p className="text-xs text-gray-500 mb-2">
              Write a rough draft of your responsibilities, then use AI to
              create bullet points.
            </p>
            <textarea
              rows="4"
              value={exp.description}
              onChange={(e) =>
                handleChange(index, "description", e.target.value)
              }
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all outline-none resize-none"
              placeholder="I built scalable microservices and led a team of 3 developers..."
            />
          </div>
        </div>
      ))}

      {experienceList.length === 0 && (
        <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-200 rounded-xl">
          No experience added yet.
        </div>
      )}
    </div>
  );
};

export default ExperienceForm;
