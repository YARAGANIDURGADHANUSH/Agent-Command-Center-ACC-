import { useState } from "react";
import { X } from "lucide-react";
import { missionsApi } from "../../api/client";
import { useToast } from "../../context/ToastContext";

export default function NewMissionModal({ onClose, onCreated }) {
  const toast = useToast();

  const [title, setTitle] = useState("");
  const [objective, setObjective] = useState("");
  const [priority, setPriority] = useState("Medium");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    if (!title.trim()) {
      setError("Mission title is required.");
      return;
    }

    if (!objective.trim()) {
      setError("Mission objective is required.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const mission = await missionsApi.create({
        title: title.trim(),
        objective: objective.trim(),
        priority,
      });

      console.log("MISSION CREATED");
      console.log(mission);

      toast.success(`Mission "${mission.title}" created successfully.`);

      if (onCreated) {
        onCreated(mission);
      }

      onClose();
    } catch (err) {
      console.error(err);

      const message =
        err?.message ||
        "Failed to create mission.";

      setError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-hdr">
          <h3>New mission</h3>

          <button
            className="modal-close"
            onClick={onClose}
            type="button"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">

            <div className="field">
              <label htmlFor="mission-title">
                Mission title
              </label>

              <input
                id="mission-title"
                value={title}
                onChange={(e) =>
                  setTitle(e.target.value)
                }
                placeholder="e.g. Threat Intelligence Analysis"
                autoFocus
              />
            </div>

            <div className="field">
              <label htmlFor="mission-objective">
                Objective
              </label>

              <textarea
                id="mission-objective"
                value={objective}
                onChange={(e) =>
                  setObjective(e.target.value)
                }
                placeholder="Describe what ACC should accomplish..."
                rows={6}
              />
            </div>

            <div className="field">
              <label htmlFor="mission-priority">
                Priority
              </label>

              <select
                id="mission-priority"
                value={priority}
                onChange={(e) =>
                  setPriority(e.target.value)
                }
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            {error && (
              <p
                style={{
                  color: "red",
                  marginTop: "10px",
                  fontSize: "14px",
                }}
              >
                {error}
              </p>
            )}

          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="btn primary"
              disabled={submitting}
            >
              {submitting
                ? "Creating..."
                : "Create mission"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}