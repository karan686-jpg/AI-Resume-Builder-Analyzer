import React, { useRef } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Input, Textarea, Button } from "../../../components/ui";
import FormatToolbar from "./FormatToolbar";

const ExperienceForm = ({ experienceList = [], onChange }) => {
  const textareaRefs = useRef({});

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

  return (
    <div className="space-y-6 bg-white p-6 rounded-xl shadow-xs border border-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Experience</h2>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={handleAdd}
          className="text-blue-600 bg-blue-50 border-blue-200 hover:bg-blue-100"
        >
          <Plus size={15} /> Add Experience
        </Button>
      </div>

      {experienceList.map((exp, index) => (
        <div
          key={index}
          className="p-5 border border-gray-200 rounded-xl space-y-4 bg-gray-50/50"
        >
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-gray-700">
              Experience {index + 1}
            </h3>
            <button
              type="button"
              onClick={() => handleRemove(index)}
              className="text-rose-500 hover:text-rose-700 p-1.5 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors cursor-pointer"
              title="Remove experience"
            >
              <Trash2 size={16} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Company"
              placeholder="e.g. Google, TechNova"
              value={exp.company || ""}
              onChange={(e) => handleChange(index, "company", e.target.value)}
            />
            <Input
              label="Job Title / Role"
              placeholder="e.g. Software Engineer"
              value={exp.role || ""}
              onChange={(e) => handleChange(index, "role", e.target.value)}
            />
            <div className="md:col-span-2">
              <Input
                label="Dates (Duration)"
                placeholder="e.g. Jan 2022 - Present"
                value={exp.dates || ""}
                onChange={(e) => handleChange(index, "dates", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2 mt-3">
            <label className="block text-xs font-semibold text-slate-700 tracking-wide">
              Description & Bullet Points
            </label>
            <div className="flex justify-between items-center">
              <FormatToolbar
                textareaRef={textareaRefs}
                textareaIndex={index}
                value={exp.description || ""}
                onChange={(val) => handleChange(index, "description", val)}
              />
            </div>
            <Textarea
              ref={(el) => { textareaRefs.current[index] = el; }}
              rows={4}
              placeholder="• Architected full-stack React web apps..."
              value={exp.description || ""}
              onChange={(e) => handleChange(index, "description", e.target.value)}
            />
          </div>
        </div>
      ))}

      {experienceList.length === 0 && (
        <div className="text-center py-8 text-sm text-gray-500 border-2 border-dashed border-gray-200 rounded-xl">
          No experience added yet. Click "+ Add Experience" above.
        </div>
      )}
    </div>
  );
};

export default ExperienceForm;
