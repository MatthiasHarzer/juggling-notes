<script lang="ts">
  import NoteSetGrid from "./lib/NoteSetGrid.svelte";
  import { NoteSetManager } from "./store/note_set_manager";
  import NoteSetManagement from "./lib/note_set_management/NoteSetManagement.svelte";
  import type { NoteSet } from "./store/note_set";

  let editMode = false;
  let selectedNoteSet: NoteSet | null = null;

  const noteSetManager = new NoteSetManager();
  noteSetManager.init().then(() => {
    let noteSetName = localStorage.getItem("selectedNoteSet");
    if (noteSetName) {
      selectedNoteSet = noteSetManager.getNoteSetByName(noteSetName);
    } else {
      selectedNoteSet = noteSetManager.noteSetsAsArray[0];
    }
  });

  const randomize = () => {
    selectedNoteSet?.shuffle();
  };

  const onNoteSetClicked = ({ detail: noteSet }: CustomEvent<NoteSet>) => {
    selectedNoteSet = noteSet;
    localStorage.setItem("selectedNoteSet", selectedNoteSet.name);
  };

  const saveNoteSets = () => {
    noteSetManager.save();
  };

  const toggleEditMode = () => {
    editMode = !editMode;
  };
</script>

<main>
  <div class="set-management">
    <h3>Collections</h3>
    <NoteSetManagement
      {noteSetManager}
      {selectedNoteSet}
      on:set-clicked={onNoteSetClicked}
    />
  </div>
  <div class="main-content">
    <div class="note-set-grid">
      <div class="actions">
        <button class="material text-button" on:click={randomize}>
          <span class="material-symbols-outlined">casino</span>
          Randomize
        </button>
        <button class="material text-button" on:click={toggleEditMode}>
          {#if !editMode}
            <span class="material-symbols-outlined">edit</span>
            Edit
          {:else}
            <span class="material-symbols-outlined">done</span>
            Done
          {/if}
        </button>
      </div>
      <div class="grid">
        <NoteSetGrid
          {editMode}
          noteSet={selectedNoteSet}
          on:edited={saveNoteSets}
        />
      </div>
    </div>
  </div>
  <div class="footer"></div>
</main>

<style lang="scss">
  main {
    height: 100vh;
    width: 100vw;
    flex-direction: column;
    display: flex;

    .set-management {
      flex: 0 1 auto;

      h3 {
        margin: 0;
        padding: 0.5rem 1rem 0 1rem;
        font-size: 1.2rem;
        font-weight: 500;
        border-bottom: 1px solid var(--border-color);
      }
    }

    .main-content {
      flex: 1 0 auto;

      display: flex;
      justify-content: center;
      align-items: center;

      .note-set-grid {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        .actions {
          width: 100%;
          display: flex;
          justify-content: flex-end;
          margin-bottom: 1rem;
        }
      }
    }

    .footer {
      flex: 0 1 auto;
    }
  }

  .text-button {
    font-size: 1.1rem;
    font-weight: 500;
    padding: 0.2rem 1rem 0.2rem 0.5rem;
    border-radius: 0.5rem;

    .material-symbols-outlined {
      margin-right: 0.5rem;
    }
  }
</style>
