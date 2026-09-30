import React, { useRef, useState, useEffect } from "react";
import ModernTemplate from "./templates/ModernTemplate";
import { Share2, Check, Printer } from "lucide-react";

/**
 * ResumePreview — renders the live A4 resume preview using ModernTemplate
 */
const ResumePreviewWrapper = ({ data }) => {

  const [copied, setCopied] = useState(false);
  const containerRef = useRef(null);
  const printRef = useRef(null);
  const [scale, setScale] = useState(1);

  // Auto-scale the A4 resume to fit the preview panel width
  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const targetWidth = 794 + 48;

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

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link", err);
    }
  };

  const renderTemplate = () => {
    return <ModernTemplate data={data} />;
  };


  return (
    <div className="flex flex-col h-full w-full overflow-hidden relative print:overflow-visible">
      {/* Top bar */}
      <div className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 mb-3 flex items-center justify-between shadow-xs shrink-0 print:hidden gap-3">
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Live Preview
          </span>
          <span className="text-[11px] bg-emerald-50 text-emerald-600 border border-emerald-200 px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Real-time
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleShare}
            className="flex items-center px-2.5 py-1 text-xs font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            title="Copy shareable link"
          >
            {copied ? (
              <Check size={13} className="text-emerald-600 mr-1" />
            ) : (
              <Share2 size={13} className="text-blue-500 mr-1" />
            )}
            <span>{copied ? "Copied!" : "Share"}</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center px-3 py-1 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-all shadow-xs cursor-pointer"
            title="Pixel-perfect vector print or save as PDF"
          >
            <Printer size={13} className="mr-1.5" />
            <span>Print / PDF</span>
          </button>
        </div>
      </div>

      {/* A4 Resume paper container */}
      <div
        ref={containerRef}
        className="flex-1 overflow-auto custom-scrollbar flex justify-center items-start pt-2 bg-slate-100/70 rounded-xl p-4 print:bg-transparent print:pt-0 print:overflow-visible"
      >
        <div
          style={{
            transform: `scale(${scale})`,
            transformOrigin: "top center",
            height: scale < 1 ? 1123 * scale : "auto",
            marginBottom: scale < 1 ? 40 : 40,
          }}
          className="transition-transform duration-200 ease-out print:transform-none! print:h-auto! print:m-0! print:w-full!"
        >
          <div
            id="resume-pdf-content"
            ref={printRef}
            className="bg-white shadow-2xl rounded-sm shrink-0 overflow-hidden print:shadow-none print:w-full transition-all"
            style={{
              width: "794px",
              minHeight: "1123px",
              fontFamily: data.fontFamily || "'Inter', sans-serif",
            }}
          >
            {renderTemplate()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumePreviewWrapper;
