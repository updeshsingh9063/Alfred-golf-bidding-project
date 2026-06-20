import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Target,
  Heart,
  Ticket,
  Trophy,
  Settings,
  Plus,
  Pencil,
  Trash2,
  X,
  Check,
} from "lucide-react";
import { SidebarNav } from "../../components/shared/SidebarNav";
import { EmptyState } from "../../components/shared/EmptyState";
import { useScores } from "../../lib/hooks";
import { fetchApi } from "../../lib/api";

const dashboardItems = [
  { label: "Overview", href: "/dashboard", icon: <LayoutDashboard size={16} /> },
  { label: "My Scores", href: "/dashboard/scores", icon: <Target size={16} /> },
  { label: "My Charity", href: "/dashboard/charity", icon: <Heart size={16} /> },
  { label: "Draws", href: "/dashboard/draws", icon: <Ticket size={16} /> },
  { label: "Winnings", href: "/dashboard/winnings", icon: <Trophy size={16} /> },
  { label: "Settings", href: "/dashboard/settings", icon: <Settings size={16} /> },
];

export default function MyScores() {
  const { data, loading, refetch } = useScores();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formDate, setFormDate] = useState("");
  const [formScore, setFormScore] = useState("");
  const [formCourse, setFormCourse] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const scores = data?.scores || [];

  function resetForm() {
    setFormDate("");
    setFormScore("");
    setFormCourse("");
    setError("");
    setShowForm(false);
    setEditingId(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    const scoreNum = Number(formScore);
    if (!formDate) {
      setError("Please select a date.");
      setIsSubmitting(false);
      return;
    }
    if (isNaN(scoreNum) || scoreNum < 1 || scoreNum > 45) {
      setError("Score must be between 1 and 45.");
      setIsSubmitting(false);
      return;
    }

    try {
      if (editingId) {
        const res = await fetchApi(`/scores/${editingId}`, {
          method: 'PATCH',
          body: JSON.stringify({ date: formDate, score: scoreNum, course: formCourse })
        });
        if (!res.success) {
          setError(res.message);
          setIsSubmitting(false);
          return;
        }
      } else {
        const res = await fetchApi('/scores', {
          method: 'POST',
          body: JSON.stringify({ date: formDate, score: scoreNum, course: formCourse })
        });
        if (!res.success) {
          setError(res.message);
          setIsSubmitting(false);
          return;
        }
      }
      
      await refetch();
      resetForm();
    } catch (err: any) {
      setError(err.message || 'Failed to save score.');
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleEdit(entry: any) {
    setEditingId(entry._id);
    setFormDate(new Date(entry.date).toISOString().split('T')[0]);
    setFormScore(String(entry.score));
    setFormCourse(entry.course || "");
    setShowForm(true);
  }

  async function handleDelete(id: string) {
    if (confirm("Are you sure you want to delete this score?")) {
      try {
        await fetchApi(`/scores/${id}`, { method: 'DELETE' });
        refetch();
      } catch (err: any) {
        alert(err.message || 'Failed to delete score.');
      }
    }
  }

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }

  return (
    <div className="flex min-h-screen bg-bg">
      <SidebarNav
        items={dashboardItems}
        activePath="/dashboard/scores"
        title="Fairway"
        variant="dashboard"
      />

      <main className="flex-1 overflow-y-auto md:ml-64">
        <div className="mx-auto max-w-[1200px] px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display text-2xl font-semibold text-ink">
                My Scores
              </h1>
              <p className="mt-1 text-sm text-ink-soft">
                Log your rounds to build this month's draw numbers. Maximum 5 recent scores are kept.
              </p>
            </div>
            {!showForm && (
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-accent-deep px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-deep-hov"
              >
                <Plus size={16} />
                Add Score
              </button>
            )}
          </div>

          <AnimatePresence>
            {showForm && (
              <motion.form
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                onSubmit={handleSubmit}
                className="mt-6 overflow-hidden rounded-xl border border-border bg-surface p-5"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-ink">
                    {editingId ? "Edit score" : "New score"}
                  </h3>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="text-ink-soft hover:text-ink"
                  >
                    <X size={16} />
                  </button>
                </div>
                <div className="mt-4 grid gap-4 sm:grid-cols-3">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-ink-soft">
                      Date
                    </label>
                    <input
                      type="date"
                      value={formDate}
                      onChange={(e) => setFormDate(e.target.value)}
                      className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-ink outline-none focus:border-accent-deep"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-ink-soft">
                      Score (1–45)
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={45}
                      value={formScore}
                      onChange={(e) => setFormScore(e.target.value)}
                      placeholder="e.g. 34"
                      className="w-full rounded-lg border border-border bg-bg px-3 py-2 font-mono text-sm text-ink outline-none focus:border-accent-deep"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-ink-soft">
                      Course
                    </label>
                    <input
                      type="text"
                      value={formCourse}
                      onChange={(e) => setFormCourse(e.target.value)}
                      placeholder="e.g. Muirfield"
                      className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-ink outline-none focus:border-accent-deep"
                    />
                  </div>
                </div>
                {error && (
                  <p className="mt-3 text-xs font-medium text-danger">{error}</p>
                )}
                <div className="mt-4 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={resetForm}
                    disabled={isSubmitting}
                    className="rounded-lg px-4 py-2 text-sm font-medium text-ink-soft hover:bg-surface-sunken disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-accent-deep px-4 py-2 text-sm font-medium text-white hover:bg-accent-deep-hov disabled:opacity-50"
                  >
                    <Check size={14} />
                    {isSubmitting ? "Saving..." : (editingId ? "Update" : "Save")}
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          {scores.length === 0 ? (
            <EmptyState
              icon={<Target size={24} />}
              title="No scores yet"
              description="Log your first round to enter this month's draw."
              action={{ label: "Log your first round", onClick: () => setShowForm(true) }}
            />
          ) : (
            <div className="mt-6 space-y-3">
              <AnimatePresence mode="popLayout">
                {scores.map((entry: any) => (
                  <motion.div
                    key={entry._id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20, height: 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    className="flex items-center justify-between rounded-xl border border-border bg-surface px-5 py-4"
                  >
                    <div className="flex items-center gap-4">
                      <span className="font-mono text-2xl font-bold text-accent-deep">
                        {entry.score}
                      </span>
                      <div>
                        <p className="text-sm font-medium text-ink">
                          {entry.course || "Unknown course"}
                        </p>
                        <p className="text-xs text-ink-soft">
                          {new Date(entry.date).toLocaleDateString("en-GB", {
                            weekday: "short",
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleEdit(entry)}
                        className="rounded-lg p-2 text-ink-soft hover:bg-surface-sunken hover:text-ink"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(entry._id)}
                        className="rounded-lg p-2 text-ink-soft hover:bg-rose-soft hover:text-rose"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
