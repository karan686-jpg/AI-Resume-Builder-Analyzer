import React, { useState } from "react";
import { Plus, X } from "lucide-react";
import { Button, Badge } from "../../../components/ui";

const SkillsForm = ({ skills = [], onChange }) => {
  const [skillInput, setSkillInput] = useState("");

  const handleAddSkill = (e) => {
    e.preventDefault();
    const trimmed = skillInput.trim();
    if (trimmed && !skills.includes(trimmed)) {
      onChange([...skills, trimmed]);
      setSkillInput("");
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    onChange(skills.filter((skill) => skill !== skillToRemove));
  };

  return (
    <div className="space-y-6 bg-white p-6 rounded-xl shadow-xs border border-gray-100">
      <h2 className="text-xl font-bold text-gray-800">Skills</h2>

      <form onSubmit={handleAddSkill} className="flex gap-2">
        <input
          type="text"
          value={skillInput}
          onChange={(e) => setSkillInput(e.target.value)}
          placeholder="Add a skill (e.g. React.js, Node.js)"
          className="flex-1 text-xs px-3.5 py-2 bg-white border border-slate-300 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
        />
        <Button
          type="submit"
          variant="dark"
          size="sm"
          disabled={!skillInput.trim()}
        >
          <Plus size={15} /> Add
        </Button>
      </form>

      <div className="flex flex-wrap gap-2 mt-4">
        {skills.map((skill, index) => (
          <Badge
            key={index}
            variant="info"
            size="md"
            className="flex items-center gap-1.5"
          >
            {skill}
            <button
              type="button"
              onClick={() => handleRemoveSkill(skill)}
              className="text-blue-500 hover:text-rose-600 transition-colors cursor-pointer"
              title="Remove skill"
            >
              <X size={13} />
            </button>
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default SkillsForm;
