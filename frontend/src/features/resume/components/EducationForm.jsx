import React from "react";
import { Plus, Trash2 } from "lucide-react";
import { Input, Button } from "../../../components/ui";

const EDU_FIELDS = [
  {
    name: "institution",
    label: "Institution / University",
    placeholder: "University of California",
    colSpan: 2,
  },
  {
    name: "degree",
    label: "Degree",
    placeholder: "Bachelor of Science",
  },
  {
    name: "fieldOfStudy",
    label: "Field of Study",
    placeholder: "Computer Science",
  },
  {
    name: "dates",
    label: "Dates / Graduation Year",
    placeholder: "2018 - 2022",
    colSpan: 2,
  },
];

const EducationForm = ({ educationList = [], onChange }) => {
  const handleAdd = () => {
    onChange([
      ...educationList,
      { institution: "", degree: "", fieldOfStudy: "", dates: "" },
    ]);
  };

  const handleRemove = (index) => {
    onChange(educationList.filter((_, i) => i !== index));
  };

  const handleChange = (index, field, value) => {
    const updated = [...educationList];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  return (
    <div className="space-y-6 bg-white p-6 rounded-xl shadow-xs border border-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Education</h2>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={handleAdd}
          className="text-blue-600 bg-blue-50 border-blue-200 hover:bg-blue-100"
        >
          <Plus size={15} /> Add Education
        </Button>
      </div>

      {educationList.map((edu, index) => (
        <div
          key={index}
          className="p-5 border border-gray-200 rounded-xl space-y-4 bg-gray-50/50"
        >
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-gray-700">
              Education {index + 1}
            </h3>
            <button
              type="button"
              onClick={() => handleRemove(index)}
              className="text-rose-500 hover:text-rose-700 p-1.5 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors cursor-pointer"
              title="Remove education"
            >
              <Trash2 size={16} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {EDU_FIELDS.map((f) => (
              <div
                key={f.name}
                className={f.colSpan === 2 ? "md:col-span-2" : ""}
              >
                <Input
                  label={f.label}
                  placeholder={f.placeholder}
                  value={edu[f.name] || ""}
                  onChange={(e) => handleChange(index, f.name, e.target.value)}
                />
              </div>
            ))}
          </div>
        </div>
      ))}

      {educationList.length === 0 && (
        <div className="text-center py-8 text-sm text-gray-500 border-2 border-dashed border-gray-200 rounded-xl">
          No education added yet. Click "+ Add Education" above.
        </div>
      )}
    </div>
  );
};

export default EducationForm;
