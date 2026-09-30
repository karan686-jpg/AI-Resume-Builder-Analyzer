const { PDFParse } = require("pdf-parse");

/**
 * Extracts plain text from an uploaded PDF buffer.
 * Automatically cleans up parser instance from memory.
 * Safely handles corrupted or unreadable PDF streams.
 * @param {Buffer} buffer
 * @returns {Promise<string>}
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
    throw new Error(
      "Unable to parse text from the uploaded PDF. Please ensure it is a valid text-based PDF document."
    );
  } finally {
    if (parser) {
      await parser.destroy();
    }
  }
}

module.exports = { extractPdfText };
