<script lang="ts">
  import type { NoteSetManager } from "../../store/note_set_manager";
  import NoteSetCard from "./NoteSetCard.svelte";
  import { createEventDispatcher } from "svelte";
  import type { NoteSet } from "../../store/note_set";

  const dispatch = createEventDispatcher();

  export let noteSetManager: NoteSetManager;
  export let selectedNoteSet: NoteSet | null;

  $: noteSets = noteSetManager.noteSets;

  const handleSetClicked = (noteSet: NoteSet) => {
    dispatch("set-clicked", noteSet);
  };

  const handleNewSetClicked = async () => {
    const newSet = await noteSetManager.createNoteSet();
    handleSetClicked(newSet);
  };
</script>

<div class="note-sets">
  {#each $noteSets as noteSet}
    <NoteSetCard
      on:click={() => handleSetClicked(noteSet)}
      {noteSet}
      selected={noteSet === selectedNoteSet}
    />
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

  .add-set {
    border: 3px solid rgba(255, 255, 255, 0.07);
    border-radius: 10px;
    height: 70px;
    width: 200px;
    margin: 10px;
    transition: all ease-in-out 0.2s;

    &:hover {
      border: 3px solid rgba(255, 255, 255, 0.2);
      cursor: pointer;
    }
  }
</style>
