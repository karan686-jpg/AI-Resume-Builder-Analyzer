const imagekit = require("../config/imagekit.config");

const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image file provided." });
    }

    const { removeBackground } = req.body;

    // Convert multer file buffer to base64 for ImageKit upload
    const fileBase64 = req.file.buffer.toString("base64");

    // Upload options
    const uploadOptions = {
      file: fileBase64,
      fileName: req.file.originalname,
      folder: "/resumeai/avatars",
    };

    // If removeBackground is true, apply the background removal extension
    if (removeBackground === "true" || removeBackground === true) {
      uploadOptions.extensions = [
        {
          name: "remove-bg",
          options: {
            add_shadow: false
          }
        }
      ];
    }

    const response = await imagekit.upload(uploadOptions);

    res.status(200).json({
      success: true,
      url: response.url,
      fileId: response.fileId,
    });
  } catch (error) {
    console.error("ImageKit upload error:", error);
    res.status(500).json({ error: "Failed to upload image." });
  }
};

module.exports = {
  uploadImage
};
