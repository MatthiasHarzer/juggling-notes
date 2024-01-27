<script lang="ts">
  import type { NoteSet } from "../../store/note_set";
  import { createEventDispatcher, onMount } from "svelte";

  export let noteSet: NoteSet;
  export let selected: boolean;

  const dispatch = createEventDispatcher();

  let element: HTMLButtonElement;
  let editing = false;
  let input: HTMLInputElement;

  const handleClick = () => {
    dispatch("click");
  };
  export const toggleEditing = () => {
    editing = !editing;

    if (!editing) {
      dispatch("edit", noteSet);
    } else {
      setTimeout(() => {
        input?.focus();
      }, 0);
    }
  };

  const checkIfClickedOutside = (e: MouseEvent) => {
    if (editing && !element.contains(e.target as Node)) {
      editing = false;
    }
  };

  onMount(() => {
    window.addEventListener("click", checkIfClickedOutside);
    return () => {
      window.removeEventListener("click", checkIfClickedOutside);
    };
  });
</script>

<button
  class="main clear"
  class:selected
  on:click={handleClick}
  bind:this={element}
>
  {#if editing}
    <input
      type="text"
      bind:this={input}
      bind:value={noteSet.name}
      on:keydown={(e) => {
        if (e.key === "Enter") {
          toggleEditing();
        }
      }}
    />
  {:else}
    <span class="name">{noteSet.name}</span>
  {/if}
  {#if selected}
    <button class="material" on:click={toggleEditing}>
      <span class="material-symbols-outlined">
        {editing ? "done" : "edit"}
      </span>
    </button>
  {/if}
</button>

<style lang="scss">
  .main {
    border: 2px solid rgba(255, 255, 255, 0.7);
    border-radius: 10px;
    height: 60px;
    width: 200px;
    transition: all 0.2s ease-in-out;

    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    &.selected {
      border: 3px solid #6db262;
    }
  }

  .name {
    font-size: 20px;
    font-weight: bold;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  input {
    width: 90%;
    margin-right: 5px;
    font-size: 20px;
    border: none;
    border-bottom: 1px solid rgba(255, 255, 255, 0.7);
    background-color: #232323;
    color: #fff;
    border-radius: 4px 4px 2px 2px;
  }
</style>
