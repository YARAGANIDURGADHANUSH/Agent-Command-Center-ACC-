import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import PageHeader from "../components/common/PageHeader";
import LoadingRow from "../components/common/LoadingRow";
import ErrorState from "../components/common/ErrorState";
import { useConnection } from "../context/ConnectionContext";
import { useToast } from "../context/ToastContext";
import { settingsApi } from "../api/client";
import { useFetch } from "../hooks/useFetch";

const PROVIDERS = ["Fireworks AI", "OpenAI", "Anthropic", "Google Gemini"];

export default function Settings() {
  const { connected, baseUrl } = useConnection();
  const toast = useToast();
  const { data: settings, loading, error, refetch } = useFetch(() => settingsApi.get(), []);

  const [checking, setChecking] = useState(false);
  const [checkResult, setCheckResult] = useState(null);
  const [saving, setSaving] = useState(false);
  const [showKey, setShowKey] = useState(false);

  const [aiProvider, setAiProvider] = useState("Fireworks AI");
  const [aiModel, setAiModel] = useState("");
  const [apiKey, setApiKey] = useState("");

  useEffect(() => {
    if (settings) {
      setAiProvider(settings.ai_provider || "Fireworks AI");
      setAiModel(settings.ai_model || "");
      setApiKey(settings.api_key || "");
    }
  }, [settings]);

  async function testConnection() {
    setChecking(true);
    setCheckResult(null);
    try {
      await settingsApi.testConnection({ ai_provider: aiProvider, ai_model: aiModel, api_key: apiKey });
      setCheckResult({ ok: true, message: "Backend responded successfully." });
    } catch (err) {
      setCheckResult({ ok: false, message: err.message });
    } finally {
      setChecking(false);
    }
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await settingsApi.save({ ai_provider: aiProvider, ai_model: aiModel, api_key: apiKey });
      toast.success("Settings saved");
      refetch();
    } catch (err) {
      toast.error(`Couldn't save settings: ${err.message}`);
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <PageHeader title="Settings" description="Connection and AI provider configuration for this ACC instance." />

      <div className="section-card" style={{ maxWidth: 640, marginBottom: 16 }}>
        <div className="section-card-hdr">
          <h3>Backend connection</h3>
          <span className={`status-badge ${connected ? "completed" : "failed"}`}>
            <span className="status-dot" />
            {connected ? "Connected" : "Unreachable"}
          </span>
        </div>
        <div className="section-card-body">
          <div className="field">
            <label>API base URL</label>
            <input value={baseUrl} readOnly />
            <p className="hint">
              Set via <code>VITE_API_BASE_URL</code> in your <code>.env</code> file, then restart the dev server.
            </p>
          </div>
          <button className="btn" onClick={testConnection} disabled={checking}>
            {checking ? "Running health check…" : "Run health check"}
          </button>
          {checkResult && (
            <p style={{ fontSize: 12, marginTop: 10, color: checkResult.ok ? "var(--teal)" : "var(--red)" }}>
              {checkResult.message}
            </p>
          )}
        </div>
      </div>

      <div className="section-card" style={{ maxWidth: 640 }}>
        <div className="section-card-hdr">
          <h3>AI provider</h3>
        </div>
        <div className="section-card-body">
          {loading ? (
            <LoadingRow label="Loading saved settings…" />
          ) : error ? (
            <ErrorState error={error} onRetry={refetch} label="Couldn't load settings" />
          ) : (
            <form onSubmit={handleSave}>
              <div className="field-row">
                <div className="field">
                  <label htmlFor="ai-provider">Provider</label>
                  <select id="ai-provider" value={aiProvider} onChange={(e) => setAiProvider(e.target.value)}>
                    {PROVIDERS.map((p) => (
                      <option key={p}>{p}</option>
                    ))}
                  </select>
                </div>
                <div className="field">
                  <label htmlFor="ai-model">Model</label>
                  <input
                    id="ai-model"
                    value={aiModel}
                    onChange={(e) => setAiModel(e.target.value)}
                    placeholder="e.g. Gemma"
                  />
                </div>
              </div>

              <div className="field">
                <label htmlFor="ai-key">{aiProvider} API key</label>
                <div style={{ position: "relative" }}>
                  <input
                    id="ai-key"
                    type={showKey ? "text" : "password"}
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Paste your API key"
                    style={{ paddingRight: 38 }}
                    autoComplete="off"
                  />
                  <button
                    type="button"
                    className="modal-close"
                    style={{ position: "absolute", right: 6, top: 5 }}
                    onClick={() => setShowKey((s) => !s)}
                    aria-label={showKey ? "Hide API key" : "Show API key"}
                  >
                    {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
                <p className="hint">Stored by the backend. Never exposed to other users of this deployment.</p>
              </div>

              <button className="btn primary" type="submit" disabled={saving}>
                {saving ? "Saving…" : "Save settings"}
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
