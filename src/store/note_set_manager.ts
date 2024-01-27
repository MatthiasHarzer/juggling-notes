import { NoteSet } from "./note_set";
import { get, writable, type Writable } from "svelte/store";

/**
 * Reads and writes all saved data to local storage.
 */
class LocalStorageReader {
  /**
   * Returns all saved note sets.
   */
  getNoteSets(): NoteSet[] {
    const noteSets = localStorage.getItem("noteSets");
    if (noteSets === null) {
      return [];
    }
    const json = JSON.parse(noteSets);

    return json.map((noteSet: any) => {
      return new NoteSet(noteSet.notes, noteSet.name, noteSet.id);
    });
  }

  /**
   * Saves all note sets to local storage.
   * @param noteSets The note sets to save.
   */
  setNoteSets(noteSets: NoteSet[]) {
    localStorage.setItem("noteSets", JSON.stringify(noteSets));
  }
}

export class NoteSetManager {
  private readonly _noteSets: Writable<NoteSet[]>;
  private readonly _localStorageReader: LocalStorageReader;

  constructor() {
    this._noteSets = writable<NoteSet[]>([]);
    this._localStorageReader = new LocalStorageReader();
  }

  async init() {
    this._noteSets.set(this._localStorageReader.getNoteSets());
    if (this.noteSetsAsArray.length === 0) {
      await this.addNoteSet(NoteSet.getDefault());
    }
  }

  get noteSetsAsArray(): NoteSet[] {
    return get(this._noteSets);
  }

  get noteSets(): Writable<NoteSet[]> {
    return this._noteSets;
  }

  async save() {
    this._localStorageReader.setNoteSets(this.noteSetsAsArray);
  }

  async addNoteSet(noteSet: NoteSet) {
    this._noteSets.update((noteSets) => [...noteSets, noteSet]);
    await this.save();
  }

  async removeNoteSet(noteSet: NoteSet) {
    this._noteSets.update((noteSets) => noteSets.filter((n) => n !== noteSet));
    await this.save();
  }

  getNoteSetByName(name: string): NoteSet | null {
    return this.noteSetsAsArray.find((n) => n.name === name) || null;
  }

  getNoteSetById(id: string): NoteSet | null {
    return this.noteSetsAsArray.find((n) => n.id === id) || null;
  }

  async createNoteSet(name?: string) {
    const setName = name ?? `Note Set (${this.noteSetsAsArray.length})`;

    const noteSet = new NoteSet(
      [],
      setName,
      this.getNoteSetByName(setName)
        ? `${setName} (${this.noteSetsAsArray.length})`.toLowerCase()
        : setName.toLowerCase(),
    );
    await this.addNoteSet(noteSet);
    return noteSet;
  }
}
