import React from "react";
import { Input } from "../../../components/ui";

const FIELDS = [
  { name: "name", label: "Full Name", placeholder: "John Doe" },
  {
    name: "title",
    label: "Professional Title",
    placeholder: "e.g. Full Stack Developer / Software Engineer",
  },
  {
    name: "email",
    label: "Email Address",
    type: "email",
    placeholder: "john@example.com",
  },
  {
    name: "phone",
    label: "Phone Number",
    placeholder: "+1 234 567 890",
  },
  {
    name: "linkedIn",
    label: "LinkedIn Profile",
    placeholder: "linkedin.com/in/johndoe",
  },
  {
    name: "github",
    label: "GitHub Profile",
    placeholder: "github.com/johndoe",
  },
  {
    name: "portfolio",
    label: "Portfolio / Website",
    placeholder: "johndoe.com",
  },
];

const PersonalInfoForm = ({ data = {}, onChange }) => {
  const handleChange = (e) => {
    onChange({ ...data, [e.target.name]: e.target.value });
  };

  return (
    <div className="space-y-6 bg-white p-6 rounded-xl shadow-xs border border-gray-100">
      <h2 className="text-xl font-bold text-gray-800">Personal Information</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {FIELDS.map((field) => (
          <Input
            key={field.name}
            name={field.name}
            label={field.label}
            type={field.type || "text"}
            placeholder={field.placeholder}
            value={data[field.name] || ""}
            onChange={handleChange}
          />
        ))}
      </div>
    </div>
  );
};

export default PersonalInfoForm;
