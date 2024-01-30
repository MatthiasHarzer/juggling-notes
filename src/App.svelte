<script lang="ts">
  import NoteSetGrid from "./lib/NoteSetGrid.svelte";
  import { NoteSetManager } from "./store/note_set_manager";
  import NoteSetManagement from "./lib/note_set_management/NoteSetManagement.svelte";
  import type { NoteSet } from "./store/note_set";
  import NoteSetPlayer from "./lib/note_set_player/NoteSetPlayer.svelte";
  import { fade } from "svelte/transition";
  import githubLogo from "./assets/github.svg";

  let editMode = false;
  let selectedNoteSet: NoteSet | null = null;
  let fontScale = JSON.parse(localStorage.getItem("fontScale") ?? "1.2");

  const noteSetManager = new NoteSetManager();
  noteSetManager.init().then(() => {
    let noteSetId = localStorage.getItem("selectedNoteSet");
    if (noteSetId) {
      selectedNoteSet = noteSetManager.getNoteSetById(noteSetId);
    }
    if (!selectedNoteSet) {
      selectedNoteSet = noteSetManager.noteSetsAsArray[0];
    }
  });

  const randomize = () => {
    selectedNoteSet?.shuffle();
    saveNoteSets();
  };

  const onNoteSetClicked = ({ detail: noteSet }: CustomEvent<NoteSet>) => {
    selectedNoteSet = noteSet;
    localStorage.setItem("selectedNoteSet", selectedNoteSet.id);
  };

  const saveNoteSets = () => {
    noteSetManager.export();
  };

  const toggleEditMode = () => {
    editMode = !editMode;
  };

  let playerOpen = false;
  const openPlayer = () => {
    playerOpen = true;
  };
  const closePlayer = () => {
    playerOpen = false;
  };

  const modifyFontScale = (delta: number) => {
    fontScale += delta;
    fontScale = Math.max(0.5, fontScale);
    fontScale = Math.min(2.5, fontScale);
    localStorage.setItem("fontScale", JSON.stringify(fontScale));
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
        <div class="font-scale">
          <button class="material" on:click={() => modifyFontScale(-0.1)}>
            <span class="material-symbols-outlined w500">remove</span>
          </button>
          <button class="material" on:click={() => modifyFontScale(0.1)}>
            <span class="material-symbols-outlined w500">add</span>
          </button>
          Scale
        </div>
        <button class="material text-button" on:click={openPlayer}>
          <span class="material-symbols-outlined">play_arrow</span>
          Play
        </button>
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
          bind:editMode
          noteSet={selectedNoteSet}
          on:edited={saveNoteSets}
          {fontScale}
        />
      </div>
    </div>
  </div>
  <div class="footer">
    <div class="github-notice">
      Check out the code on <a
        href="https://github.com/MatthiasHarzer/juggling-notes"
        >GitHub <img src={githubLogo} alt="GitHub Logo" />
      </a>
    </div>
  </div>
</main>
{#if selectedNoteSet && playerOpen}
  <div transition:fade={{ duration: 200 }}>
    <NoteSetPlayer noteSet={selectedNoteSet} on:close={closePlayer} />
  </div>
{/if}

<style lang="scss">
  main {
    height: 100vh;
    width: 100vw;
    padding: 0 10px;
    box-sizing: border-box;
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

    .actions {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      gap: 0.7rem;

      .font-scale {
        display: flex;
        align-items: center;
        font-weight: bold;
        //gap: 0.5rem;
        span {
          //wght: 800;
        }
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
        padding-top: 30px;
        box-sizing: border-box;
        flex-direction: column;
        //justify-content: center;
        align-items: center;

        .actions {
          width: 100%;
          display: flex;
          justify-content: flex-end;
          margin-bottom: 1rem;
        }

        .grid {
          width: 100%;
          padding: 0 15px;
          box-sizing: border-box;
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

  .footer {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding: 0.5rem;
    color: var(--text-color);

    .github-notice {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      a {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        img {
          height: 1rem;
          filter: invert(1);
        }
      }
    }
  }
</style>
