import React, { useMemo, useState } from "react";

// const API_BASE = "http://127.0.0.1:8000";
// const API_BASE = "https://cs5340-group5-s26-7-controlled-exposure.onrender.com";

const API_BASE =
  window.location.hostname === "localhost"
    ? "http://127.0.0.1:8000"
    : "https://cs5340-group5-s26-7-controlled-exposure.onrender.com";


function confidenceColor(conf) {
  const c = Math.max(0, Math.min(1, conf ?? 0));
  const r = Math.round(255 * (1 - c));
  const g = Math.round(255 * c);
  return `rgb(${r}, ${g}, 80)`;
}

function Badge({ children }) {
  return (
    <span
      style={{
        fontSize: 11,
        padding: "4px 8px",
        borderRadius: 999,
        background: "rgba(0,0,0,0.08)",
        fontWeight: 700,
      }}
    >
      {children}
    </span>
  );
}

function LogRow({ level, message }) {
  const bg =
    level === "warning" ? "rgba(255, 193, 7, 0.25)" : "rgba(0,0,0,0.04)";
  const border =
    level === "warning" ? "rgba(255, 193, 7, 0.9)" : "rgba(0,0,0,0.08)";
  return (
    <div
      style={{
        padding: "8px 10px",
        borderRadius: 10,
        background: bg,
        border: `1px solid ${border}`,
        marginBottom: 8,
        fontSize: 13,
        lineHeight: 1.35,
      }}
    >
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <Badge>{level}</Badge>
        <div style={{ opacity: 0.85 }}>{message}</div>
      </div>
    </div>
  );
}

function ModalShell({ title, children, onClose }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.35)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        zIndex: 9999,
      }}
      onMouseDown={onClose}
    >
      <div
        style={{
          width: "min(760px, 96vw)",
          background: "white",
          borderRadius: 18,
          border: "1px solid rgba(0,0,0,0.12)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
          overflow: "hidden",
        }}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div
          style={{
            padding: "14px 16px",
            borderBottom: "1px solid rgba(0,0,0,0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 10,
          }}
        >
          <div style={{ fontWeight: 900 }}>{title}</div>
          <button
            onClick={onClose}
            style={{
              border: "1px solid rgba(0,0,0,0.12)",
              background: "white",
              borderRadius: 12,
              padding: "8px 10px",
              cursor: "pointer",
              fontWeight: 800,
            }}
          >
            Close
          </button>
        </div>
        <div style={{ padding: 16 }}>{children}</div>
      </div>
    </div>
  );
}



function IntroPage({ onEnter }) {
  return (
    <div
      style={{
        height: "100vh",
        display: "grid",
        gridTemplateRows: "64px 1fr",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial',
        background: "rgba(0,0,0,0.02)",
      }}
    >
      {/* Top bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 18px",
          borderBottom: "1px solid rgba(0,0,0,0.08)",
          background: "white",
        }}
      >
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <div style={{ fontWeight: 800, fontSize: 18 }}>Seamful Dashboard</div>
            <span
              style={{
                fontSize: 12,
                padding: "4px 8px",
                borderRadius: 999,
                background: "#eee",
              }}
            >
              Review + Intervention + Gate
            </span>
        </div>
      </div>

      {/* Content */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 16,
        }}
      >
        <div
          style={{
            width: "min(860px, 96vw)",
            background: "white",
            border: "1px solid rgba(0,0,0,0.08)",
            borderRadius: 18,
            padding: 20,
            boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
          }}
        >
          <div style={{ fontSize: 22, fontWeight: 900, marginBottom: 10 }}>
            What this tool does
          </div>

          <div style={{ fontSize: 14, lineHeight: 1.65, opacity: 0.9 }}>
            This prototype demonstrates <b>seamful vs seamless governance</b> for
            AI-assisted workflows.
            <ul style={{ marginTop: 10 }}>
              <li>
                <b>Input review</b>: detects signals such as sensitive data, domain
                risk, or low confidence.
              </li>
              <li>
                <b>Confidence signal</b>: shows a confidence score to help users
                recognize uncertainty.
              </li>
              <li>
                <b>Intervention support</b>: instead of only blocking output, the
                system suggests actions and allows users to revise input or output
                before approval.
              </li>
              <li>
                <b>Gate (human sign-off)</b>: in seamful mode, outputs that need
                review require user approval or manual override.
              </li>
              <li>
                <b>Seamless mode</b>: allows automatic approval while still
                exposing signals for transparency.
              </li>
              <li>
                <b>Export</b>: download the current session as JSON for auditing.
              </li>
            </ul>

            <div style={{ marginTop: 12, opacity: 0.8 }}>
              Tip: try entering ambiguous or sensitive content to see how the
              system suggests revisions and supports intervention before approval.
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 10,
              marginTop: 18,
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={onEnter}
              style={{
                padding: "10px 14px",
                borderRadius: 12,
                border: "1px solid rgba(0,0,0,0.12)",
                background: "white",
                fontWeight: 900,
                cursor: "pointer",
              }}
            >
              Enter Dashboard →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}





export default function App() {
  const [text, setText] = useState(
    "Contact me at haomiao@gmail.com or 408-123-4567. This system hides uncertainty and increases automation bias. We want resilience."
  );

  const [maxSentences, setMaxSentences] = useState(3);
  const [loading, setLoading] = useState(false);
  const [serverResult, setServerResult] = useState(null); // raw from API
  const [approvedResult, setApprovedResult] = useState(null); // what user is allowed to see
  const [error, setError] = useState("");

  // Gate / Override states
  const [gateOpen, setGateOpen] = useState(false);
  const [overrideOpen, setOverrideOpen] = useState(false);
  const [draftSummary, setDraftSummary] = useState("");

  const [, setAuditTrail] = useState([]);
  const [metrics, setMetrics] = useState({
    gateTriggers: 0,
    overrides: 0,
  });

  const [mode, setMode] = useState("seamful"); // "seamful" | "seamless"

  const [, setLastDecision] = useState("none");  // "none" | "approved" | "overridden" | "auto_approved"

  //const [sessions, setSessions] = useState([]); // store simulated sessions

  const [pdfFile, setPdfFile] = useState(null); // store pdf upload

  const [page, setPage] = useState("intro"); // "intro" | "dashboard"

  const [showLogs, setShowLogs] = useState(false); // folder for logs


  const conf = (approvedResult ?? serverResult)?.confidence ?? 0;
  const confPct = Math.round(conf * 100);
  const confBarColor = useMemo(() => confidenceColor(conf), [conf]);

  const logs = (serverResult?.logs || []);

  const modelConfidenceLog = logs.find((l) =>
  l.message.toLowerCase().includes("model confidence")
  );

  const ruleConfidenceLog = logs.find((l) =>
    l.message.toLowerCase().includes("rule-based confidence")
  );
  
  const hasWarning =
  (serverResult?.risk_level === "high") ||
  ((serverResult?.pii_count || 0) > 0) ||
  ((serverResult?.confidence ?? 1) < 0.55);

  function openOverride(initialText) {
    setDraftSummary(initialText || "");
    setOverrideOpen(true);
  }

  async function handlePdfUpload(file) {
    if (!file) return;

    setPdfFile(file);
    setError("");
    setServerResult(null);
    setApprovedResult(null);
    setGateOpen(false);
    setOverrideOpen(false);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const resp = await fetch(`${API_BASE}/extract-pdf-text`, {
        method: "POST",
        body: formData,
      });

      if (!resp.ok) {
        const t = await resp.text();
        throw new Error(`HTTP ${resp.status}: ${t}`);
      }

      const data = await resp.json();
      const cleaned = (data.text || "")
        .replace(/\s+/g, " ")   //multiple spaces → single space
        .trim();

      setText(cleaned);
    } catch (e) {
      setError(e.message || String(e));
    }
  }

  async function runAnalyzeWithText(inputText = text) {
  setLoading(true);
  setError("");
  setGateOpen(false);
  setOverrideOpen(false);
  setApprovedResult(null);
  setLastDecision("none");

  try {
    const resp = await fetch(`${API_BASE}/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: inputText, max_sentences: maxSentences }),
    });

    if (!resp.ok) {
      const t = await resp.text();
      throw new Error(`HTTP ${resp.status}: ${t}`);
    }

    const data = await resp.json();
    setServerResult(data);

    const shouldBlock =
    data.risk_level === "high" ||
    (data.pii_count || 0) > 0 ||
    (data.confidence ?? 1) < 0.55;

    if (shouldBlock) {
      setMetrics((m) => ({ ...m, gateTriggers: m.gateTriggers + 1 }));

      if (mode === "seamful") {
        setGateOpen(true);
      } else {
        const timestamp = new Date().toLocaleTimeString();
        const record = `Auto-approved (seamless mode) at ${timestamp}`;
        const approved = {
          ...data,
          logs: [...(data.logs || []), { level: "info", message: record }],
        };
        setApprovedResult(approved);
        setLastDecision("auto_approved");
      }
    } else {
      setApprovedResult(data);
    }
  } catch (e) {
    setError(e.message || String(e));
  } finally {
    setLoading(false);
  }
}

  

  function downloadJson(filename, data) {
  const blob = new Blob(
    [JSON.stringify(data, null, 2)],
    { type: "application/json" }
  );

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");

  a.href = url;
  a.download = filename;
  a.click();

  URL.revokeObjectURL(url);
}



function exportCurrentSession() {
  // Export the final visible result if available;
  // otherwise export the raw serverResult (which may still be blocked by the Gate)
  const base = approvedResult ?? serverResult;
  if (!base) return;

  const baseLogs = base.logs || [];
  const warnings = baseLogs.filter((l) => l.level === "warning");
  const warningsDetected = warnings.length > 0;

  // Determine gate state:
  // - In seamless mode, the Gate is always bypassed.
  // - In seamful mode, if warnings exist and the result has not been approved yet,
  //   the output is considered "blocked".
  const gate_state =
    mode === "seamless"
      ? "bypassed"
      : warningsDetected && !approvedResult
      ? "blocked"
      : "approved";

  // Determine decision semantics:
  // - seamless mode → auto_approved
  // - seamful + blocked → pending (waiting for human approval)
  // - seamful + approved → check whether it was manually overridden
  const didOverride = baseLogs.some((l) =>
    (l.message || "").toLowerCase().includes("manual override")
  );

  const decision =
    mode === "seamless"
      ? "auto_approved"
      : gate_state === "blocked"
      ? "pending"
      : didOverride
      ? "overridden"
      : "approved";

  const payload = {
    timestamp: new Date().toISOString(),
    mode,

    // Preserve original input as essential session context
    input: text,

    // Export the final user-visible output (approved or overridden)
    output: base.summary ?? "",

    confidence: base.confidence ?? null,

    warnings_detected: warningsDetected,

    // Flatten warning messages for easier inspection in exported JSON
    warning_details: warnings.map((w) => w.message),

    gate_state,
    decision,

    logs: baseLogs,

    // Snapshot of governance metrics at export time
    metrics_snapshot: metrics,
  };

  downloadJson(`seamful_session_${Date.now()}.json`, payload);
}



  // const visibleSummary = approvedResult?.summary || "";
  const visibleLogs = serverResult?.logs || [];

  if (page === "intro") {
    return <IntroPage onEnter={() => setPage("dashboard")} />;
  }
  
  return (
    <div
      style={{
        height: "100vh",
        display: "grid",
        gridTemplateRows: "64px 1fr",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial',
      }}
    >
      {/* Top bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 18px",
          borderBottom: "1px solid rgba(0,0,0,0.08)",
          background: "white",
        }}
      >
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <div style={{ fontWeight: 800, fontSize: 18 }}>Seamful Dashboard</div>
          <Badge>Trust + Privacy + Gate</Badge>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <button
          onClick={() => setPage("intro")}
          style={{
            padding: "8px 10px",
            borderRadius: 12,
            border: "1px solid rgba(0,0,0,0.12)",
            background: "white",
            fontWeight: 800,
            cursor: "pointer",
          }}
        >
          About
        </button>
        <Badge>API: {API_BASE}</Badge>
      </div>

      </div>

      {/* Main grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.1fr 1.2fr 0.9fr",
          gap: 14,
          padding: 14,
          background: "rgba(0,0,0,0.02)",
        }}
      >
        {/* Left: Input */}
        <div
          style={{
            background: "white",
            border: "1px solid rgba(0,0,0,0.08)",
            borderRadius: 16,
            padding: 14,
            display: "flex",
            flexDirection: "column",
            gap: 10,
            minWidth: 0,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div style={{ fontWeight: 700 }}>Input</div>
            <Badge>Raw text</Badge>
          </div>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            style={{
              width: "100%",
              flex: 1,
              minHeight: 240,
              resize: "vertical",
              borderRadius: 12,
              border: "1px solid rgba(0,0,0,0.12)",
              padding: 12,
              fontSize: 14,
              lineHeight: 1.5,
            }}
          />

         

          {/*  PDF upload */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <label style={{ fontSize: 13, opacity: 0.8 }}>Upload PDF</label>
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => handlePdfUpload(e.target.files?.[0] || null)}
            />
            {pdfFile && (
              <div style={{ fontSize: 12, opacity: 0.75, lineHeight: 1.4 }}>
                <div>Selected: {pdfFile.name}</div>
                <div style={{ color: "#2e7d32", marginTop: 2 }}>
                  ✓ Text extracted and loaded into input
                </div>
              </div>
            )}
          </div>

    <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
      <label style={{ fontSize: 13, opacity: 0.8 }}>Max sentences</label>
      <input
        type="number"
        min={1}
        max={10}
        value={maxSentences}
        onChange={(e) => setMaxSentences(Number(e.target.value))}
        style={{
          width: 70,
          padding: "6px 8px",
          borderRadius: 10,
          border: "1px solid rgba(0,0,0,0.12)",
        }}
      />

        {/* original button */}
        <button
          onClick={() => runAnalyzeWithText(text)}
          disabled={loading}
          style={{
            marginLeft: "auto",
            padding: "10px 14px",
            borderRadius: 12,
            border: "1px solid rgba(0,0,0,0.12)",
            background: loading ? "rgba(0,0,0,0.06)" : "white",
            fontWeight: 700,
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Analyzing..." : "Analyze"}
        </button>

      </div>


      {serverResult?.review_reason && (
        <div
          style={{
            marginTop: 10,
            padding: 12,
            borderRadius: 12,
            border: "1px solid rgba(0,0,0,0.08)",
            background: "rgba(0,0,0,0.02)",
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 6 }}>
            Recommended Actions
          </div>

          <div style={{ fontSize: 13, opacity: 0.85, lineHeight: 1.5, marginBottom: 8 }}>
            {serverResult.review_reason}
          </div>

          {serverResult?.suggestions?.length > 0 && (
            <div style={{ fontSize: 13, lineHeight: 1.5 }}>
              {serverResult.suggestions.map((s, idx) => (
                <div key={idx} style={{ marginBottom: 4 }}>
                  • {s}
                </div>
              ))}
            </div>
          )}

          {serverResult?.can_apply_safe_version && (
            <button
              onClick={async () => {
                const safeText = serverResult.masked_text || text;
                setText(safeText);

                setTimeout(() => {
                  runAnalyzeWithText(safeText);
                }, 0);
              }}
              style={{
                marginTop: 10,
                padding: "10px 12px",
                borderRadius: 12,
                border: "1px solid rgba(0,0,0,0.12)",
                background: "white",
                fontWeight: 800,
                cursor: "pointer",
              }}
            >
              Use Revised Input & Rerun
            </button>
          )}
        </div>
      )}

          {error ? (
            <div
              style={{
                padding: 10,
                borderRadius: 12,
                border: "1px solid rgba(220,53,69,0.35)",
                background: "rgba(220,53,69,0.08)",
                color: "rgba(220,53,69,1)",
                fontSize: 13,
              }}
            >
              {error}
            </div>
          ) : null}
        </div>

        {/* Center: Output */}
        <div
          style={{
            background: "white",
            border: "1px solid rgba(0,0,0,0.08)",
            borderRadius: 16,
            padding: 14,
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div style={{ fontWeight: 700 }}>AI Output</div>
            <Badge>Summary</Badge>
          </div>

          <div
            style={{
              borderRadius: 14,
              border: "1px solid rgba(0,0,0,0.08)",
              padding: 14,
              background: "rgba(0,0,0,0.02)",
              minHeight: 140,
              whiteSpace: "pre-wrap",
              lineHeight: 1.6,
              fontSize: 14,
              position: "relative",
            }}
          >
            {/* If gate is open, blur output */}
            {gateOpen && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  backdropFilter: "blur(6px)",
                  background: "rgba(255,255,255,0.72)",
                  borderRadius: 14,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 18,
                  textAlign: "center",
                  fontWeight: 800,
                  lineHeight: 1.5,
                }}
              >
                <div>
                  This result needs review before approval.
                  <br />
                  Please check the highlighted issues, revise the input if needed, or approve manually.
                </div>
              </div>
            )}

            {approvedResult?.summary
              ? approvedResult.summary
              : serverResult?.summary
              ? "(Blocked — pending approval)"
              : "Click Analyze to generate a summary. Warnings trigger a Gate."}
          </div>

          <div style={{ opacity: 0.7, fontSize: 12 }}>
            Gate rule: high-risk content, true sensitive data, or very low confidence require user review before approval.
          </div>
        </div>

        {/* Right: Governance Sidebar */}
        <div
          style={{
            background: "white",
            border: "1px solid rgba(0,0,0,0.08)",
            borderRadius: 16,
            padding: 14,
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div style={{ fontWeight: 700 }}>Governance</div>
            <Badge>Controlled exposure</Badge>
          </div>

          {/* Confidence */}
          <div style={{ marginTop: 10, fontSize: 12, opacity: 0.8, lineHeight: 1.5 }}>
            {modelConfidenceLog && <div>{modelConfidenceLog.message}</div>}
            {ruleConfidenceLog && <div>{ruleConfidenceLog.message}</div>}
          </div>
          <div
            style={{
              borderRadius: 14,
              border: "1px solid rgba(0,0,0,0.08)",
              padding: 12,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div style={{ fontSize: 13, fontWeight: 700 }}>Confidence</div>
              <Badge>{confPct}%</Badge>
            </div>
            <div
              style={{
                marginTop: 10,
                height: 10,
                borderRadius: 999,
                background: "rgba(0,0,0,0.06)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${confPct}%`,
                  height: "100%",
                  background: confBarColor,
                }}
              />
            </div>
              <div style={{ marginTop: 8, fontSize: 12, opacity: 0.7, lineHeight: 1.5 }}>
                <div><span style={{ fontWeight: 700 }}>Threshold:</span> Confidence is one signal among multiple factors used to trigger warnings, including detected risks and content sensitivity.</div>
                <div style={{ marginTop: 4 }}>
                  Confidence is based on model certainty and output quality checks.
                </div>
              </div>
          </div>


          {/* Risk Classification */}
          <div style={{ fontSize: 12, opacity: 0.65, marginTop: 6 }}>
            High-risk domains require stricter human review before approval.
          </div>
          <div
            style={{
              borderRadius: 14,
              border: "1px solid rgba(0,0,0,0.08)",
              padding: 12,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div style={{ fontSize: 13, fontWeight: 800 }}>Risk Classification</div>
              <Badge>{(serverResult?.risk_type || "general").toUpperCase()}</Badge>
            </div>

            <div style={{ fontSize: 12, opacity: 0.75, marginTop: 6 }}>
              Risk level: <b>{serverResult?.risk_level || "low"}</b>
            </div>
          </div>



          
          {/* Mode toggle */}
          <div
            style={{
              borderRadius: 14,
              border: "1px solid rgba(0,0,0,0.08)",
              padding: 12,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: 13, fontWeight: 800 }}>Mode</div>
              <Badge>{mode === "seamful" ? "SEAMFUL" : "SEAMLESS"}</Badge>
            </div>

            <div style={{ fontSize: 12, opacity: 0.75, marginTop: 6, lineHeight: 1.4 }}>
              Seamful enforces Gate on warnings. Seamless bypasses Gate (auto-approve).
            </div>

            <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
              <button
                onClick={() => setMode("seamful")}
                style={{
                  flex: 1,
                  padding: "10px 12px",
                  borderRadius: 12,
                  border: "1px solid rgba(0,0,0,0.12)",
                  background: mode === "seamful" ? "rgba(0,0,0,0.06)" : "white",
                  fontWeight: 900,
                  cursor: "pointer",
                }}
              >
                Seamful
              </button>
              <button
                onClick={() => setMode("seamless")}
                style={{
                  flex: 1,
                  padding: "10px 12px",
                  borderRadius: 12,
                  border: "1px solid rgba(0,0,0,0.12)",
                  background: mode === "seamless" ? "rgba(0,0,0,0.06)" : "white",
                  fontWeight: 900,
                  cursor: "pointer",
                }}
              >
                Seamless
              </button>
            </div>
          </div>

          {/* Manual override */}
          <div
            style={{
              borderRadius: 14,
              border: "1px solid rgba(0,0,0,0.08)",
              padding: 12,
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 700 }}>Manual Override</div>
            <div style={{ fontSize: 12, opacity: 0.7, marginTop: 6 }}>
              If Gate triggers, you can edit output and sign off manually.
            </div>
            <button
              onClick={() =>
                openOverride(serverResult?.summary || approvedResult?.summary || "")
              }
              disabled={!serverResult}
              style={{
                marginTop: 10,
                width: "100%",
                padding: "10px 12px",
                borderRadius: 12,
                border: "1px solid rgba(0,0,0,0.12)",
                background: !serverResult ? "rgba(0,0,0,0.06)" : "white",
                fontWeight: 800,
                cursor: !serverResult ? "not-allowed" : "pointer",
              }}
            >
              Override & Edit
            </button>
          </div>

          {/* Gate status */}
          <div
            style={{
              borderRadius: 14,
              border: "1px solid rgba(0,0,0,0.08)",
              padding: 12,
              background: gateOpen ? "rgba(255,193,7,0.18)" : "rgba(0,0,0,0.02)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div style={{ fontSize: 13, fontWeight: 800 }}>Gate</div>
              <Badge>
                {mode === "seamless" ? "BYPASSED" : gateOpen ? "BLOCKED" : "OPEN"}
              </Badge>
            </div>
            <div style={{ fontSize: 12, opacity: 0.75, marginTop: 6 }}>
              {mode === "seamless"
                ? "Seamless mode — review signals will not block output."
                : serverResult
                ? hasWarning
                  ? "Review required before approval."
                  : "No major review signal detected."
                : "Run Analyze to evaluate."}
            </div>
          </div>

          {/* Metrics */}
          <div
            style={{
              borderRadius: 14,
              border: "1px solid rgba(0,0,0,0.08)",
              padding: 12,
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 800 }}>Metrics</div>
            <div style={{ fontSize: 12, marginTop: 6 }}>
              Gate triggers: {metrics.gateTriggers}
            </div>
            <div style={{ fontSize: 12 }}>
              Manual overrides: {metrics.overrides}
            </div>


            <button
              onClick={exportCurrentSession}
              disabled={!serverResult}
              style={{
                width: "100%",
                marginTop: 10,
                padding: "10px 12px",
                borderRadius: 12,
                border: "1px solid rgba(0,0,0,0.12)",
                background: "white",
                fontWeight: 900,
                cursor: "pointer",
              }}
            >
              Export Current Session
            </button>
          </div>


          {/* Logs */}
          <div style={{ fontSize: 12, opacity: 0.7, marginTop: -4, marginBottom: 4 }}>
            System actions and warning explanations
          </div>

          <button
            onClick={() => setShowLogs((v) => !v)}
            style={{
              padding: "8px 10px",
              borderRadius: 10,
              border: "1px solid rgba(0,0,0,0.12)",
              background: "white",
              fontWeight: 700,
              cursor: "pointer",
              alignSelf: "flex-start",
            }}
          >
            {showLogs ? "Hide Technical Details" : "Show Technical Details"}
          </button>

          {showLogs && (
            <div style={{ overflow: "auto", paddingRight: 4, marginTop: 8 }}>
              {visibleLogs.length ? (
                visibleLogs.map((l, idx) => (
                  <LogRow key={idx} level={l.level} message={l.message} />
                ))
              ) : (
                <div style={{ fontSize: 13, opacity: 0.7 }}>
                  No logs yet. Run Analyze.
                </div>
              )}
            </div>
          )}


        </div>
      </div>

    

      {/*  Gate modal */}
      {gateOpen && serverResult && (
        <ModalShell title="Elicitation Gate: Human Sign-off Required" onClose={() => {}}>
          <div style={{ fontSize: 14, lineHeight: 1.6 }}>
            <div style={{ fontWeight: 900, marginBottom: 8 }}>
              The system detected potential risk signals:
            </div>
            <div style={{ marginBottom: 10, opacity: 0.85 }}>
              This result includes signals that may need user review before approval.
            </div>

            {(() => {
              const warnings = (serverResult.logs || []).filter((l) => l.level === "warning");

              const privacyWarnings = warnings.filter((l) =>
                l.message.toLowerCase().includes("sensitive")
              );

              const trustWarnings = warnings.filter((l) =>
                l.message.toLowerCase().includes("confidence")
              );

              const medicalWarnings = warnings.filter((l) =>
                l.message.toLowerCase().includes("medical")
              );

              const financeWarnings = warnings.filter((l) =>
                l.message.toLowerCase().includes("finance")
              );

              return (
                <div style={{ marginBottom: 12 }}>
                  {/* Risk category summary */}
                  <div style={{ fontWeight: 900, marginBottom: 8 }}>
                    Risk Categories Detected:
                  </div>

                  {medicalWarnings.length > 0 && (
                    <div style={{ marginBottom: 6 }}>
                      • <b>Medical Risk</b> (High-stakes health-related content)
                    </div>
                  )}

                  {financeWarnings.length > 0 && (
                    <div style={{ marginBottom: 6 }}>
                      • <b>Financial Risk</b> (High-stakes financial content)
                    </div>
                  )}

                  <div style={{ marginBottom: 10 }}>
                    {privacyWarnings.length > 0 && (
                      <div style={{ marginBottom: 6 }}>
                        • <b>Privacy Risk</b> (PII detected & masked)
                      </div>
                    )}
                    {trustWarnings.length > 0 && (
                      <div style={{ marginBottom: 6 }}>
                        • <b>Trust Risk</b> (Low confidence output)
                      </div>
                    )}
                    {privacyWarnings.length === 0 && trustWarnings.length === 0 && (
                      <div style={{ marginBottom: 6 }}>
                        • <b>Other Risk</b> (General warning)
                      </div>
                    )}
                  </div>

                  {/* Keep original warning details */}
                  <div style={{ fontWeight: 900, marginBottom: 8 }}>
                    Warning Details:
                    {serverResult?.suggestions?.length > 0 && (
                      <div style={{ marginTop: 14 }}>
                        <div style={{ fontWeight: 900, marginBottom: 8 }}>
                          Suggested Next Step:
                        </div>

                        {serverResult.suggestions.map((s, i) => (
                          <div key={i} style={{ marginBottom: 6 }}>
                            • {s}
                          </div>
                        ))}

                        {serverResult?.can_apply_safe_version && (
                          <button
                            onClick={() => {
                              const safeText = serverResult.masked_text || text;
                              setText(safeText);
                              setGateOpen(false);
                              runAnalyzeWithText(safeText);
                            }}
                            style={{
                              marginTop: 10,
                              padding: "10px 12px",
                              borderRadius: 12,
                              border: "1px solid rgba(0,0,0,0.12)",
                              background: "white",
                              fontWeight: 900,
                              cursor: "pointer",
                            }}
                          >
                            Apply Safe Version & Rerun
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                  {warnings.map((l, i) => (
                    <div key={i} style={{ marginBottom: 6 }}>
                      • <b>{l.message}</b>
                    </div>
                  ))}
                </div>
              );
            })()}


            <div
              style={{
                border: "1px solid rgba(0,0,0,0.08)",
                borderRadius: 14,
                background: "rgba(0,0,0,0.02)",
                padding: 12,
                whiteSpace: "pre-wrap",
              }}
            >
              <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 8 }}>
                Proposed output (preview):
              </div>
              {serverResult.summary}
            </div>

            <div
              style={{
                display: "flex",
                gap: 10,
                marginTop: 14,
                justifyContent: "flex-end",
                flexWrap: "wrap",
              }}
            >
              <button
                onClick={() => openOverride(serverResult.summary)}
                style={{
                  padding: "10px 12px",
                  borderRadius: 12,
                  border: "1px solid rgba(0,0,0,0.12)",
                  background: "white",
                  fontWeight: 900,
                  cursor: "pointer",
                }}
              >
                Override & Edit
              </button>
              <button
                onClick={() => {
                  const timestamp = new Date().toLocaleTimeString();
                  const record = `Approved by user at ${timestamp}`;
                  setAuditTrail((prev) => [...prev, record]);

                  const approved = {
                    ...serverResult,
                    logs: [
                      ...serverResult.logs,
                      { level: "info", message: record },
                    ],
                  };

                  setApprovedResult(approved);
                  setGateOpen(false);
                  setLastDecision("approved");
                }}
                style={{
                  padding: "10px 12px",
                  borderRadius: 12,
                  border: "1px solid rgba(0,0,0,0.12)",
                  background: "white",
                  fontWeight: 900,
                  cursor: "pointer",
                }}
              >
                Approve Output
              </button>
            </div>
          </div>
        </ModalShell>
      )}

      {/*  Override modal */}
      {overrideOpen && (
        <ModalShell title="Manual Override: Edit & Sign Off" onClose={() => setOverrideOpen(false)}>
          <div style={{ fontSize: 14, lineHeight: 1.6 }}>
            <div style={{ marginBottom: 10, opacity: 0.8 }}>
              Edit the output below. When you save, this becomes the approved result.
            </div>

            <textarea
              value={draftSummary}
              onChange={(e) => setDraftSummary(e.target.value)}
              style={{
                width: "100%",
                minHeight: 220,
                borderRadius: 14,
                border: "1px solid rgba(0,0,0,0.12)",
                padding: 12,
                fontSize: 14,
                lineHeight: 1.55,
              }}
            />

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 12 }}>
              <button
                onClick={() => setOverrideOpen(false)}
                style={{
                  padding: "10px 12px",
                  borderRadius: 12,
                  border: "1px solid rgba(0,0,0,0.12)",
                  background: "white",
                  fontWeight: 900,
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // create an approved result using serverResult (if exists), but with edited summary
                  const base = serverResult || approvedResult || { confidence: 0, logs: [] };
                  const timestamp = new Date().toLocaleTimeString();
                  const record = `Manual override by user at ${timestamp}`;

                  const edited = {
                    ...base,
                    summary: draftSummary,
                    logs: [
                      ...(base.logs || []),
                      { level: "info", message: record },
                    ],
                  };
                  setMetrics((m) => ({ ...m, overrides: m.overrides + 1 }));  
                  setAuditTrail((prev) => [...prev, record]);

                  setApprovedResult(edited);
                  setGateOpen(false);
                  setOverrideOpen(false);
                  setLastDecision("overridden");
                }}
                style={{
                  padding: "10px 12px",
                  borderRadius: 12,
                  border: "1px solid rgba(0,0,0,0.12)",
                  background: "white",
                  fontWeight: 900,
                  cursor: "pointer",
                }}
              >
                Save & Approve
              </button>
            </div>
          </div>
        </ModalShell>
      )}
    </div>
  );
}
