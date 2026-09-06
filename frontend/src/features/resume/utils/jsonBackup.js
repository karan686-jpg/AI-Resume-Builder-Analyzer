// JSON Backup Utility — Export & Import Resume Data
// Zero-token, zero-cost, purely client-side using FileReader API & Blob API

/**
 * Exports current resumeData to a downloadable .json file
 * @param {Object} resumeData - The full resume state object
 */
export function exportResumeToJson(resumeData) {
  const payload = JSON.stringify(resumeData, null, 2);
  const blob = new Blob([payload], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  // Create a temporary anchor tag and click it to trigger download
  const link = document.createElement("a");
  const safeName = (resumeData.title || "resume")
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
  link.href = url;
  link.download = `${safeName}-backup.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Opens a file picker and imports resume data from a .json file
 * @param {Function} onSuccess - Callback with parsed resumeData object
 * @param {Function} onError - Callback with error message string
 */
export function importResumeFromJson(onSuccess, onError) {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".json,application/json";

  input.onchange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        // Basic validation: must have at least personalInfo
        if (!parsed || typeof parsed !== "object") {
          throw new Error("Invalid JSON structure.");
        }
        onSuccess(parsed);
      } catch (err) {
        onError("Failed to parse JSON: " + err.message);
      }
    };
    reader.onerror = () => onError("Failed to read file.");
    reader.readAsText(file);
  };

  document.body.appendChild(input);
  input.click();
  document.body.removeChild(input);
}
