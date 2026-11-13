const { PDFParse } = require("pdf-parse");

/**
 * Extracts plain text from an in-memory PDF buffer (zero disk footprint).
 */
async function extractPdfText(buffer) {
  if (!buffer) return "";
  let parser = null;
  try {
    parser = new PDFParse({ data: buffer });
    const pdfData = await parser.getText();
    return pdfData.text || "";
  } catch (err) {
    console.error("[PDF Service] Extraction error:", err.message);
    const error = new Error("Unable to parse text from the uploaded PDF. Ensure it is a valid text-based PDF.");
    error.status = 400;
    throw error;
  } finally {
    if (parser) {
      await parser.destroy();
    }
  }
}

module.exports = { extractPdfText };
