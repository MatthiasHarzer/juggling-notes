type PRIMITIVE_NOTES = "C" | "D" | "E" | "F" | "G" | "A" | "B";

export let LETTERS = ["A", "B", "C", "D", "E", "F", "G"];
export let DEVIATIONS = ["", "♮", "♯", "♭"];

export interface Note {
  id?: number;
  letter: PRIMITIVE_NOTES;
  deviation?: string;
}

export const DEFAULT_NOTES: Note[] = [
  {
    letter: "C",
  },
  {
    letter: "C",
    deviation: "♯",
  },
  {
    letter: "D",
  },
  {
    letter: "D",
    deviation: "♯",
  },
  {
    letter: "E",
  },
  {
    letter: "F",
  },
  {
    letter: "F",
    deviation: "♯",
  },
  {
    letter: "G",
  },
  {
    letter: "G",
    deviation: "♯",
  },
  {
    letter: "A",
  },
  {
    letter: "A",
    deviation: "♯",
  },
  {
    letter: "B",
  },
];
