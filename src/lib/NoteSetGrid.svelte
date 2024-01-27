<script lang="ts">
  import NoteCard from "./components/NoteCard.svelte";
  import type { NoteSet } from "../store/note_set";
  import { readable } from "svelte/store";
  import { DEFAULT_NOTES, DEVIATIONS, LETTERS, type Note } from "../store/note";
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
  $: availableDefaultNotes = DEFAULT_NOTES.filter(
    (note) =>
      $notes.findIndex(
        (n) =>
          n.letter === note.letter &&
          (n.deviation === note.deviation ||
            (n.deviation === "" && !note.deviation)),
      ) === -1,
  );

  const checkAutoEditMode = () => {
    editMode = noteSet?.notesAsArray.length === 0;
  };
  $: {
    noteSet;
    checkAutoEditMode();
  }

  const handleNoteEdited = () => {
    noteSet?.update();
    dispatch("edited");
  };

  const handleAddNote = (note: Note) => {
    noteSet?.createNote(note.letter, note.deviation);
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
      <button
        class="material text-button add-button"
        on:click={() => handleAddNote(newNote)}
      >
        <span class="material-symbols-outlined">add</span>
        Add
      </button>
    </div>
  {/if}
</div>

{#if editMode && availableDefaultNotes.length > 0}
  <div class="available-default-notes">
    <h3>Default notes</h3>
    <div class="note-grid">
      {#each availableDefaultNotes as note (note.letter + note.deviation)}
        <div
          class="clear note"
          on:click={() => handleAddNote(note)}
          animate:flip={{ duration: 200 }}
        >
          <NoteCard {note} clear={true} />
          <div class="overlay">
            <span class="icon material-symbols-outlined">add</span>
          </div>
        </div>
      {/each}
    </div>
  </div>
{/if}

<style lang="scss">
  .note-grid {
    display: inline-flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    width: 100%;

    .note {
      margin: 3px;
    }
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
        border: none;
        //background-color: transparent;
        color: inherit;
        font-size: 1.5rem;
        font-weight: bold;
        padding: 0;
        margin: 0;
        text-align: center;
        border-bottom: 2px solid #c7c7c7;
      }
    }

    .add-button {
      margin-top: 2px;
      margin-bottom: 2px;
      border-radius: 10px;
      padding: 2px 10px;
    }
  }

  .available-default-notes {
    width: 100%;

    h3 {
      margin: 15px 0 0 0;
      padding: 0;
      //text-align: center;
    }

    .note-grid {
      justify-content: flex-start !important;

      .note {
        border: 1px solid rgba(173, 173, 173, 0.9);
        border-radius: 10px;
        margin: 0 3px;
        cursor: pointer;

        transition: all 0.2s ease-in-out;
        position: relative;

        &:hover {
          border: 1px solid white;

          .overlay {
            opacity: 1;
          }
        }

        .overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border-radius: 10px;
          background-color: rgba(30, 30, 30, 0.4);
          opacity: 0;
          transition: opacity 0.2s ease-in-out;
          backdrop-filter: blur(3px);

          .icon {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 3rem;
            //opacity: ;
          }
        }
      }
    }
  }
</style>
