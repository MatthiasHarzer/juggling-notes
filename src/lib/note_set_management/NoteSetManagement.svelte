<script lang="ts">
  import type { NoteSetManager } from "../../store/note_set_manager";
  import NoteSetCard from "./NoteSetCard.svelte";
  import { createEventDispatcher } from "svelte";
  import type { NoteSet } from "../../store/note_set";

  const dispatch = createEventDispatcher();

  export let noteSetManager: NoteSetManager;
  export let selectedNoteSet: NoteSet | null;

  let currentSetComponent: NoteSetCard | null = null;

  $: noteSets = noteSetManager.noteSets;

  const handleSetClicked = (noteSet: NoteSet) => {
    dispatch("set-clicked", noteSet);
  };

  const handleSetEdited = () => {
    noteSetManager.export();
  };

  const handleNewSetClicked = async () => {
    const newSet = await noteSetManager.createNoteSet();
    handleSetClicked(newSet);

    setTimeout(() => {
      currentSetComponent?.toggleEditing();
    }, 100);
  };
</script>

<div class="note-sets">
  {#each $noteSets as noteSet}
    <div class="note-set">
      <NoteSetCard
        on:click={() => handleSetClicked(noteSet)}
        on:edit={handleSetEdited}
        {noteSet}
        selected={noteSet === selectedNoteSet}
        bind:this={currentSetComponent}
      />
    </div>
  {/each}
  <button class="clear add-set" on:click={handleNewSetClicked}>
    <span class="material-symbols-outlined"> add </span>
  </button>
</div>

<style lang="scss">
  .note-sets {
    width: 100%;
    display: inline-flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    box-sizing: border-box;
    padding: 0 15px;
  }

  .note-set {
    margin: 5px;
  }

  .add-set {
    border: 3px solid rgba(255, 255, 255, 0.07);
    border-radius: 10px;
    height: 60px;
    width: 200px;
    margin: 5px;
    transition: all ease-in-out 0.2s;

    &:hover {
      border: 3px solid rgba(255, 255, 255, 0.2);
      cursor: pointer;
    }
  }
</style>
