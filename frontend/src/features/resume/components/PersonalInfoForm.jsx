import React, { useState } from "react";
import { uploadProfileImage } from "../services/resume.api";
import { Loader2, UploadCloud } from "lucide-react";

const PersonalInfoForm = ({ data, onChange }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [removeBg, setRemoveBg] = useState(false);

  const handleChange = (e) => {
    onChange({ ...data, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const result = await uploadProfileImage(file, removeBg);
      if (result.success) {
        onChange({ ...data, imageUrl: result.url });
      }
    } catch (error) {
      console.error("Failed to upload image", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-xl font-semibold text-gray-800">
        Personal Information
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            type="text"
            name="name"
            value={data.name || ""}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
            placeholder="John Doe"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={data.email || ""}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
            placeholder="john@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <input
            type="text"
            name="phone"
            value={data.phone || ""}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
            placeholder="+1 234 567 890"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            LinkedIn Profile
          </label>
          <input
            type="text"
            name="linkedIn"
            value={data.linkedIn || ""}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
            placeholder="linkedin.com/in/johndoe"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            GitHub Profile
          </label>
          <input
            type="text"
            name="github"
            value={data.github || ""}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
            placeholder="github.com/johndoe"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Portfolio / Website
          </label>
          <input
            type="text"
            name="portfolio"
            value={data.portfolio || ""}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
            placeholder="johndoe.com"
          />
        </div>
      </div>

      <div className="mt-6 border-t pt-6 border-gray-100">
        <h3 className="text-sm font-medium text-gray-800 mb-3">
          Profile Picture
        </h3>
        <div className="flex items-center space-x-4">
          {data.imageUrl ? (
            <img
              src={data.imageUrl}
              alt="Profile"
              className="w-16 h-16 rounded-full object-cover border border-gray-200"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
              <UploadCloud size={24} />
            </div>
          )}

          <div className="flex-1 space-y-2">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all"
            />
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="removeBg"
                checked={removeBg}
                onChange={(e) => setRemoveBg(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <label htmlFor="removeBg" className="text-sm text-gray-600">
                Remove Background (AI)
              </label>
            </div>
            {isUploading && (
              <p className="text-sm text-blue-600 flex items-center">
                <Loader2 className="animate-spin mr-2" size={16} /> Uploading
                image...
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoForm;
