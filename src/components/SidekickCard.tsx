import Link from "next/link";
import type { Sidekick } from "../types/sidekick";
import { pickTopRoles, indexFrom } from "../lib/metrics";

export default function SidekickCard({ s }: { s: Sidekick }) {
  const top = pickTopRoles(s);
  const healIndex = (s.role_strength?.healer ?? 0) + (s.role_strength?.shielder ?? 0);
  const controlIndex = indexFrom(s, ["positioning","placement","ap_removal","mp_removal"]);

  return (
    <div className="rounded-2xl border p-4 bg-white/60 dark:bg-zinc-900/60 backdrop-blur">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{s.name}</h3>
        <div className="flex gap-2">
          {top.map(({ role, value }) => (
            <span key={role} className="text-xs px-2 py-0.5 rounded-full border">
              {role} • {value}
            </span>
          ))}
        </div>
      </div>
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{s.overview}</p>
      <div className="mt-3 flex gap-3 text-xs">
        <span className="px-2 py-1 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200">
          Sustain {healIndex}
        </span>
        <span className="px-2 py-1 rounded bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-200">
          Control {controlIndex}
        </span>
        <span className="px-2 py-1 rounded bg-gray-100 text-gray-800 dark:bg-gray-800/50 dark:text-gray-200">
          {s.elements.join(", ")}
        </span>
      </div>
      <div className="mt-4 flex justify-end">
        <Link href={`/sidekicks/${s.id}`} className="text-blue-600 hover:underline text-sm">
          Details
        </Link>
      </div>
    </div>
  );
}
