import { useState, useRef } from "react";
import * as XLSX from "xlsx";
import axios from "axios";
import { toast } from "react-hot-toast";
import {
  UploadCloud,
  FileSpreadsheet,
  Loader2,
  Play,
  CheckCircle2,
  XCircle,
} from "lucide-react";

export default function FileUploader({ onUploadSuccess }) {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileMeta, setFileMeta] = useState(null);
  const [preview, setPreview] = useState(null); // { rows, warnings }
  const fileInputRef = useRef(null);

  const backendUrl =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/api";

  const normaliseHeaders = (rows) => {
    return rows.map((row) => {
      const normalised = {};

      const lower = {};
      Object.keys(row).forEach((k) => {
        lower[k.toLowerCase().replace(/\s+/g, "")] = row[k];
      });

      normalised.FirstName =
        lower["firstname"] ?? lower["first_name"] ?? lower["name"] ?? "";
      normalised.Phone = String(
        lower["phone"] ?? lower["phonenumber"] ?? lower["mobile"] ?? "",
      );
      normalised.Notes = String(
        lower["notes"] ?? lower["note"] ?? lower["description"] ?? "",
      );

      return normalised;
    });
  };

  const preValidateRows = (normalisedRows) => {
    const valid = [];
    const warnings = [];

    normalisedRows.forEach((row, i) => {
      const phoneNum = Number(row.Phone);
      if (!row.FirstName || row.FirstName.trim() === "") {
        warnings.push(
          `Row ${i + 1}: Missing FirstName — will be skipped by server`,
        );
      } else if (!row.Phone || isNaN(phoneNum)) {
        warnings.push(
          `Row ${i + 1}: Invalid Phone "${row.Phone}" — will be skipped by server`,
        );
      } else {
        valid.push(row);
      }
    });

    return { valid, warnings };
  };

  const handleFileStaging = async (file) => {
    if (!file) return;

    const validExtensions = [".csv", ".xlsx", ".xls", ".axls"];
    const ext = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();

    if (!validExtensions.includes(ext)) {
      toast.error(
        "Invalid format — only .csv, .xlsx, .xls, .axls are accepted.",
      );
      return;
    }

    setSelectedFile(file);
    setFileMeta({
      name: file.name,
      size: (file.size / 1024).toFixed(1) + " KB",
    });
    setPreview(null);

    try {
      const raw = await parseSpreadsheetData(file);
      const normalised = normaliseHeaders(raw);
      const { valid, warnings } = preValidateRows(normalised);
      setPreview({ rows: normalised, valid, warnings });
    } catch {
      toast.error("Could not read file — make sure it is a valid spreadsheet.");
    }
  };

  const parseSpreadsheetData = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: "array" });
          const worksheet = workbook.Sheets[workbook.SheetNames[0]];

          const rows = XLSX.utils.sheet_to_json(worksheet, {
            defval: "",
            raw: false,
          });
          resolve(rows);
        } catch (err) {
          reject(err);
        }
      };

      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  };

  const handleUploadAndDistribution = async () => {
    if (!selectedFile) {
      toast.error("No file staged for upload.");
      return;
    }
    if (!preview || preview.valid.length === 0) {
      toast.error("No valid rows to send ");
      return;
    }

    setIsProcessing(true);
    const toastId = toast.loading("Parsing spreadsheet...");

    try {
      const raw = await parseSpreadsheetData(selectedFile);
      const parsedRows = normaliseHeaders(raw);

      toast.loading("Sending to server & distributing among agents...", {
        id: toastId,
      });

      const token = localStorage.getItem("token");
      const cleanApiTarget = `${backendUrl.replace(/\/$/, "")}/tasks/upload`;

      const response = await axios.post(
        cleanApiTarget,
        { parsedRows },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (response.data.success) {
        toast.success(
          `Done! ${response.data.data.totalProcessed} tasks distributed across ${response.data.data.agentsCount} agents.`,
          { id: toastId },
        );
        setSelectedFile(null);
        setFileMeta(null);
        setPreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        if (onUploadSuccess) onUploadSuccess();
      }
    } catch (err) {
      console.error("Upload error:", err);
      const msg =
        err.response?.data?.message ||
        "Server error — check console for details.";
      toast.error(msg, { id: toastId });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files?.[0]) handleFileStaging(e.dataTransfer.files[0]);
  };

  const clearFile = (e) => {
    e.stopPropagation();
    setSelectedFile(null);
    setFileMeta(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="w-full bg-[#0e1422]/40 border border-slate-900 rounded-2xl p-6 sm:p-8 backdrop-blur-md space-y-4">
      <div>
        <h3 className="text-lg font-bold text-white">Import File</h3>
        <p className="text-xs text-slate-400 mt-1">
          Upload a CSV / XLSX / XLS file with columns:{" "}
          <span className="font-mono text-slate-300">
            FirstName, Phone, Notes
          </span>
        </p>
      </div>
      <label
        htmlFor="file-upload-input"
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        className={`w-full border-2 border-dashed rounded-xl p-8 transition-colors text-center cursor-pointer flex flex-col items-center justify-center ${
          isDragging
            ? "border-emerald-500 bg-emerald-500/5"
            : "border-slate-800 hover:border-slate-700 bg-slate-950/30"
        }`}
      >
        <input
          type="file"
          id="file-upload-input"
          ref={fileInputRef}
          disabled={isProcessing}
          accept=".csv,.xlsx,.xls"
          onChange={(e) =>
            e.target.files?.[0] && handleFileStaging(e.target.files[0])
          }
          className="sr-only"
        />

        {isProcessing ? (
          <div className="space-y-3">
            <Loader2 className="w-10 h-10 text-emerald-400 animate-spin mx-auto" />
            <p className="text-sm font-medium text-slate-300">
              Distributing tasks to agents...
            </p>
          </div>
        ) : fileMeta ? (
          <div className="space-y-2">
            <FileSpreadsheet className="w-10 h-10 text-emerald-400 mx-auto" />
            <p className="text-sm font-semibold text-white font-mono">
              {fileMeta.name}
            </p>
            <p className="text-xs text-slate-500">{fileMeta.size}</p>
            <button
              type="button"
              onClick={clearFile}
              className="text-[11px] font-mono text-rose-400 hover:text-rose-300 underline px-2 py-1"
            >
              Clear selected file
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-slate-400 mb-4">
              <UploadCloud className="w-6 h-6" />
            </div>
            <p className="text-sm font-medium text-slate-200">
              Drag & drop here, or{" "}
              <span className="text-emerald-400">browse files</span>
            </p>
            <p className="text-[11px] font-mono text-slate-500 uppercase tracking-wider mt-2">
              CSV · XLSX · XLS — max 5 MB
            </p>
          </div>
        )}
      </label>

      {preview && !isProcessing && (
        <div className="rounded-xl border border-slate-800 bg-slate-950/50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-800 bg-slate-900/60">
            <span className="text-xs font-mono text-slate-400">
              Preview — {preview.rows.length} rows parsed
            </span>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-xs text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {preview.valid.length} valid
              </span>
              {preview.warnings.length > 0 && (
                <span className="flex items-center gap-1 text-xs text-amber-400">
                  <XCircle className="w-3.5 h-3.5" />
                  {preview.warnings.length} will be skipped
                </span>
              )}
            </div>
          </div>

          {preview.warnings.length > 0 && (
            <div className="px-4 py-2 border-b border-slate-800 space-y-1 max-h-24 overflow-y-auto">
              {preview.warnings.map((w, i) => (
                <p key={i} className="text-[11px] font-mono text-amber-400">
                  {w}
                </p>
              ))}
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-[11px] font-mono">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="text-left px-4 py-2 text-slate-500 font-medium">
                    FirstName
                  </th>
                  <th className="text-left px-4 py-2 text-slate-500 font-medium">
                    Phone
                  </th>
                  <th className="text-left px-4 py-2 text-slate-500 font-medium">
                    Notes
                  </th>
                </tr>
              </thead>
              <tbody>
                {preview.rows.slice(0, 5).map((row, i) => {
                  const isInvalid =
                    !row.FirstName?.trim() || isNaN(Number(row.Phone));
                  return (
                    <tr
                      key={i}
                      className={`border-b border-slate-800/50 ${isInvalid ? "opacity-40" : ""}`}
                    >
                      <td className="px-4 py-1.5 text-slate-300">
                        {row.FirstName || (
                          <span className="text-rose-500">—</span>
                        )}
                      </td>
                      <td className="px-4 py-1.5 text-slate-300">
                        {row.Phone || <span className="text-rose-500">—</span>}
                      </td>
                      <td className="px-4 py-1.5 text-slate-400 truncate max-w-50">
                        {row.Notes || "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {preview.rows.length > 5 && (
              <p className="text-[10px] font-mono text-slate-600 px-4 py-2">
                + {preview.rows.length - 5} more rows not shown
              </p>
            )}
          </div>
        </div>
      )}

      {selectedFile && !isProcessing && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-slate-500 font-mono">
            {preview?.valid.length ?? 0} rows will be sent to the server
          </p>
          <button
            type="button"
            onClick={handleUploadAndDistribution}
            disabled={!preview || preview.valid.length === 0}
            className="px-6 py-2.5 text-xs font-semibold text-slate-950 bg-linear-to-r from-emerald-400 to-teal-400 rounded-xl hover:opacity-95 flex items-center gap-2 shadow-md shadow-emerald-500/10 transition-all active:scale-95 duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            Process & Distribute Tasks
          </button>
        </div>
      )}
    </div>
  );
}
