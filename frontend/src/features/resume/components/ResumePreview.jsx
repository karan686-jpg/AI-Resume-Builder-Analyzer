import React, { useRef, useState, useEffect } from "react";
import ClassicTemplate from "./templates/ClassicTemplate";
import ModernTemplate from "./templates/ModernTemplate";
import MinimalTemplate from "./templates/MinimalTemplate";
import CreativeTemplate from "./templates/CreativeTemplate";
import ExecutiveTemplate from "./templates/ExecutiveTemplate";
import ProfessionalTemplate from "./templates/ProfessionalTemplate";
import CorporateTemplate from "./templates/CorporateTemplate";
import SimpleTemplate from "./templates/SimpleTemplate";
import ElegantTemplate from "./templates/ElegantTemplate";
import { Download, Share2, Check } from "lucide-react";
import html2pdf from "html2pdf.js";

/**
 * ResumePreview — receives template as a prop from ResumeBuilder (parent controls it)
 */
const ResumePreviewWrapper = ({ data, template }) => {
  const [copied, setCopied] = useState(false);
  const containerRef = useRef(null);
  const printRef = useRef(null);
  const [scale, setScale] = useState(1);

  // Auto-scale the A4 resume to fit the preview panel width
  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        // The preview container width
        const containerWidth = containerRef.current.offsetWidth;
        // A4 width in pixels (794px) plus some padding to look nice
        const targetWidth = 794 + 64;

        if (containerWidth < targetWidth) {
          setScale(containerWidth / targetWidth);
        } else {
          setScale(1);
        }
      }
    };

    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  const handleDownloadPdf = () => {
    const element =
      document.getElementById("hidden-resume-pdf-content") ||
      document.getElementById("resume-pdf-content");
    const opt = {
      margin: 0,
      filename: "resume.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    };
    html2pdf().set(opt).from(element).save();
  };

  const handleShare = async () => {
    try {
      const url = `${window.location.origin}/view/${data.userId || "shared"}`;
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link", err);
    }
  };

  const renderTemplate = () => {
    switch (template) {
      case "classic":
        return <ClassicTemplate data={data} />;
      case "minimal":
        return <MinimalTemplate data={data} />;
      case "creative":
        return <CreativeTemplate data={data} />;
      case "executive":
        return <ExecutiveTemplate data={data} />;
      case "professional":
        return <ProfessionalTemplate data={data} />;
      case "corporate":
        return <CorporateTemplate data={data} />;
      case "simple":
        return <SimpleTemplate data={data} />;
      case "elegant":
        return <ElegantTemplate data={data} />;
      case "modern":
      default:
        return <ModernTemplate data={data} />;
    }
  };

  return (
    <div className="flex flex-col h-full w-full overflow-hidden relative print:overflow-visible">
      {/* Top bar */}
      <div className="bg-white border text-black border-gray-200 rounded-xl p-4 mb-4 flex justify-between items-center shadow-sm shrink-0 print:hidden">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-semibold text-gray-700">
            Live Preview
          </span>
          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
            ● Live
          </span>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleShare}
            className="flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {copied ? (
              <Check size={16} className="text-green-600 mr-2" />
            ) : (
              <Share2 size={16} className="text-blue-500 mr-2" />
            )}
            {copied ? "Copied!" : "Share Link"}
          </button>

          <button
            onClick={handleDownloadPdf}
            className="flex items-center px-4 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Download size={16} className="mr-2" />
            Download PDF
          </button>
        </div>
      </div>

      {/* A4 Resume paper container */}
      <div
        ref={containerRef}
        className="flex-1 overflow-auto custom-scrollbar flex justify-center items-start pt-4 bg-gray-100/50 rounded-lg print:bg-transparent print:pt-0 print:overflow-visible"
      >
        <div
          style={{
            transform: `scale(${scale})`,
            transformOrigin: "top center",
            height: scale < 1 ? 1123 * scale : "auto",
            marginBottom: scale < 1 ? 40 : 40, // Add bottom padding for scroll
          }}
          className="transition-transform duration-200 ease-out print:transform-none! print:h-auto! print:m-0! print:w-full!"
        >
          <div
            id="resume-pdf-content"
            ref={printRef}
            className="bg-white shadow-xl shrink-0 overflow-hidden print:shadow-none print:w-full"
            style={{
              width: "794px",
              minHeight: "1123px",
              fontFamily: data.fontFamily || undefined,
            }}
          >
            {renderTemplate()}
          </div>
        </div>
      </div>

      {/* Hidden Unscaled Copy strictly for PDF generator */}
      <div
        style={{ position: "absolute", top: "-9999px", left: "-9999px" }}
        className="print:hidden"
      >
        <div
          id="hidden-resume-pdf-content"
          className="bg-white shrink-0 overflow-hidden"
          style={{
            width: "794px",
            minHeight: "1123px",
            fontFamily: data.fontFamily || undefined,
          }}
        >
          {renderTemplate()}
        </div>
      </div>
    </div>
  );
};

export default ResumePreviewWrapper;
