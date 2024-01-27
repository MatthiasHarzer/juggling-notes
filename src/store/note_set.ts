import { DEFAULT_NOTES, type Note } from "./note";
import { get, type Readable, type Writable, writable } from "svelte/store";

export class NoteSet {
  private readonly _notes: Writable<Note[]>;

  constructor(
    _notes: Note[],
    public name: string,
  ) {
    this._notes = writable(_notes ?? []);
    let id = 0;
    this._notes.update((notes) => {
      return notes.map((note) => {
        if (note.id === undefined) {
          note.id = id++;
        }
        return note;
      });
    });
  }

  get notesAsArray(): Note[] {
    return get(this._notes);
  }

  get notes(): Readable<Note[]> {
    return this._notes;
  }

  add(note: Note) {
    this._notes.update((notes) => [...notes, note]);
  }

  remove(note: Note) {
    this._notes.update((notes) => notes.filter((n) => n !== note));
  }

  update() {
    this._notes.update((notes) => notes);
  }

  createNote(letter: string, deviation?: string) {
    const note: Note = {
      id: this.notesAsArray.length,
      letter: letter as any,
      deviation: deviation,
    };
    this.add(note);
  }

  shuffle() {
    this._notes.update((notes) => {
      const shuffled = [...notes];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    });
  }

  toJSON() {
    return {
      name: this.name,
      notes: this.notesAsArray,
    };
  }

  static getDefault(): NoteSet {
    return new NoteSet(DEFAULT_NOTES, "Default");
  }
}
