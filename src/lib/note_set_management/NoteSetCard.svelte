<script lang="ts">
  import type { NoteSet } from "../../store/note_set";
  import { createEventDispatcher } from "svelte";

  export let noteSet: NoteSet;
  export let selected: boolean;

  const dispatch = createEventDispatcher();

  const handleClick = () => {
    dispatch("click");
  };
</script>

<button class="main clear" class:selected on:click={handleClick}>
  <span class="name">{noteSet.name}</span>
</button>

<style lang="scss">
  .main {
    border: 3px solid rgba(255, 255, 255, 0.7);
    border-radius: 10px;
    height: 70px;
    width: 200px;
    margin: 10px;
    transition: all 0.2s ease-in-out;
    &.selected {
      border: 3px solid #6db262;
    }
  }

  .name {
    font-size: 20px;
    font-weight: bold;
  }
</style>
