<script lang="ts">
  import NoteCard from "./components/NoteCard.svelte";
  import type { NoteSet } from "../store/note_set";
  import { readable } from "svelte/store";
  import { DEVIATIONS, LETTERS, type Note } from "../store/note";
  import { createEventDispatcher } from "svelte";
  import { flip } from "svelte/animate";

  const dispatch = createEventDispatcher();

  export let noteSet: NoteSet | null;
  export let editMode: boolean = false;

  let newNote: Note = {
    letter: "C",
    deviation: "",
  };

  $: notes = noteSet?.notes ?? readable([]);

  const handleNoteEdited = () => {
    noteSet?.update();
    dispatch("edited");
  };

  const handleAddNote = () => {
    noteSet?.createNote(newNote.letter, newNote.deviation);
    dispatch("edited");

    newNote = {
      letter: "C",
      deviation: "",
    };
  };

  const handleDeleteNote = (note: Note) => {
    noteSet?.remove(note);
    dispatch("edited");
  };
</script>

<div class="note-grid">
  {#each $notes as note (note.id)}
    <div class="note" animate:flip={{ duration: 200 }}>
      <NoteCard
        {note}
        allowEdit={editMode}
        on:edit={handleNoteEdited}
        on:delete={() => handleDeleteNote(note)}
      />
    </div>
  {/each}
  {#if editMode}
    <div class="new-note">
      <div class="inputs">
        <select bind:value={newNote.letter}>
          {#each LETTERS as letter}
            <option value={letter}>
              {letter}
            </option>
          {/each}
        </select>
        <select bind:value={newNote.deviation}>
          {#each DEVIATIONS as deviation}
            <option value={deviation}>
              {deviation}
            </option>
          {/each}
        </select>
      </div>
      <button class="material text-button add-button" on:click={handleAddNote}>
        <span class="material-symbols-outlined">add</span>
        Add
      </button>
    </div>
  {/if}
</div>

<style lang="scss">
  .note-grid {
    display: inline-flex;
    flex-wrap: wrap;
    justify-content: center;
  }

  .new-note {
    border: 3px solid rgba(173, 173, 173, 0.25);
    border-radius: 0.5rem;
    width: 5rem;
    //height: 5rem;
    margin: 3px;
    transition: border 0.2s ease-in-out;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    &:hover {
      border: 3px solid rgba(173, 173, 173, 0.9);
    }

    .inputs {
      display: flex;
      justify-content: center;
      align-items: flex-start;
      padding-top: 10px;

      select {
        font-weight: 700;
        font-size: 1.1rem;
      }
    }

    .add-button {
      margin-top: 2px;
    }
  }
</style>
