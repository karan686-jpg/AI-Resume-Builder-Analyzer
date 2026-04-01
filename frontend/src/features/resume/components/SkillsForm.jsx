import React, { useState } from "react";
import { Plus, X } from "lucide-react";

const SkillsForm = ({ skills, onChange }) => {
  const [skillInput, setSkillInput] = useState("");

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      onChange([...skills, skillInput.trim()]);
      setSkillInput("");
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    onChange(skills.filter((skill) => skill !== skillToRemove));
  };

  return (
    <div className="space-y-6 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Skills</h2>

      <form onSubmit={handleAddSkill} className="flex space-x-2">
        <input
          type="text"
          value={skillInput}
          onChange={(e) => setSkillInput(e.target.value)}
          placeholder="Add a skill (e.g. React.js)"
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
        />
        <button
          type="submit"
          disabled={!skillInput.trim()}
          className="flex items-center text-sm px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-all"
        >
          <Plus size={16} className="mr-1" /> Add
        </button>
      </form>

      <div className="flex flex-wrap gap-2 mt-4">
        {skills.map((skill, index) => (
          <div
            key={index}
            className="flex items-center px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full border border-blue-200 text-sm font-medium"
          >
            {skill}
            <button
              onClick={() => handleRemoveSkill(skill)}
              className="ml-2 text-blue-400 hover:text-blue-800 transition-colors outline-none"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillsForm;
