import { useState } from "react";
import { Download, Copy, FileText, Check } from "lucide-react";
import EmptyState from "../common/EmptyState";
import { reportsApi } from "../../api/client";
import { useToast } from "../../context/ToastContext";
import { getReportId, getReportTitle } from "../../utils/report";

function asText(value) {
  if (Array.isArray(value)) {
    return value.join("\n");
  }

  if (typeof value === "string") {
    return value;
  }

  return "";
}

function reportToText(report) {
  return `
${getReportTitle(report)}

========================================

EXECUTIVE SUMMARY

${asText(report.summary)}

========================================

FINDINGS

${asText(report.findings)}

========================================

RECOMMENDATIONS

${asText(report.recommendations)}
`;
}

export default function ReportPreview({ report }) {
  const toast = useToast();

  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!report) {
    return (
      <div className="section-card">
        <EmptyState
          icon={<FileText size={18} />}
          title="Select a report"
          message="Choose a report from the left panel."
        />
      </div>
    );
  }

  async function handleDownload() {
    try {
      setDownloading(true);

      const { blob, filename } = await reportsApi.download(
        getReportId(report)
      );

      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = filename;

      document.body.appendChild(a);
      a.click();
      a.remove();

      URL.revokeObjectURL(url);

      toast.success("Report downloaded");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setDownloading(false);
    }
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(reportToText(report));

      setCopied(true);

      toast.success("Copied");

      setTimeout(() => {
        setCopied(false);
      }, 1500);
    } catch {
      toast.error("Copy failed");
    }
  }

  return (
    <div className="section-card">
      <div className="section-card-hdr">
        <div>
          <h3>{getReportTitle(report)}</h3>

          <span className="eyebrow">
            {new Date(report.generated_at).toLocaleString()}
          </span>
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <button
            className="btn sm"
            onClick={handleCopy}
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? "Copied" : "Copy"}
          </button>

          <button
            className="btn sm primary"
            onClick={handleDownload}
            disabled={downloading}
          >
            <Download size={14} />
            {downloading ? "Downloading..." : "Download"}
          </button>
        </div>
      </div>

      <div className="section-card-body">

        <h4>Executive Summary</h4>

        <pre
          style={{
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            background: "#fafafa",
            padding: "16px",
            borderRadius: "8px",
            overflowX: "auto",
            fontFamily: "inherit"
          }}
        >
          {asText(report.summary)}
        </pre>

        <h4 style={{ marginTop: 24 }}>Findings</h4>

        <pre
          style={{
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            background: "#fafafa",
            padding: "16px",
            borderRadius: "8px",
            overflowX: "auto",
            fontFamily: "inherit"
          }}
        >
          {asText(report.findings)}
        </pre>

        <h4 style={{ marginTop: 24 }}>Recommendations</h4>

        <pre
          style={{
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            background: "#fafafa",
            padding: "16px",
            borderRadius: "8px",
            overflowX: "auto",
            fontFamily: "inherit"
          }}
        >
          {asText(report.recommendations)}
        </pre>

      </div>
    </div>
  );
}