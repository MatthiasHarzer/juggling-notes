import type { NoteSet } from "./note_set";

interface StatEntry {
  timestamp: number;
  interval: number;
  noteSet: NoteSet;
}

const stats: StatEntry[] = JSON.parse(localStorage.getItem("stats") || "[]");

const saveStats = () => {
  localStorage.setItem("stats", JSON.stringify(stats));
};

export const recordFinish = (noteSet: NoteSet, interval: number) => {
  stats.push({
    timestamp: Date.now(),
    interval,
    noteSet,
  });
  saveStats();
};
