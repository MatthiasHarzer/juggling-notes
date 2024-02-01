<script lang="ts">
  import { DEVIATIONS, LETTERS, type Note } from "../../store/note";
  import { createEventDispatcher, onMount, onDestroy } from "svelte";

  const dispatch = createEventDispatcher();
  export let note: Note;
  export let allowEdit: boolean = false;
  export let edit = false;
  export let clear: boolean = false;

  let el: HTMLElement;

  const handleDelete = () => {
    dispatch("delete", note);
  };

  const toggleEdit = () => {
    edit = !edit;
    if (!edit) {
      dispatch("edit", note);
    }
  };

  const toggleEditOnOutsideClick = (e: MouseEvent) => {
    if (edit && !e.composedPath().includes(el)) {
      toggleEdit();
    }
  };

  onMount(() => {
    document.addEventListener("click", toggleEditOnOutsideClick);
  });
  onDestroy(() => {
    document.removeEventListener("click", toggleEditOnOutsideClick);
  });
</script>

<div class="card-container flex-center" class:clear class:edit bind:this={el}>
  {#if !edit}
    <div class="note">
      <span class="letter">{note.letter}</span>
      {#if note.deviation}
        <span class="deviation">{note.deviation}</span>
      {/if}
    </div>
  {:else}
    <div class="inputs">
      <select bind:value={note.letter}>
        {#each LETTERS as letter}
          <option value={letter}>
            {letter}
          </option>
        {/each}
      </select>
      <select bind:value={note.deviation}>
        {#each DEVIATIONS as deviation}
          <option value={deviation}>
            {deviation}
          </option>
        {/each}
      </select>
    </div>
  {/if}
  {#if allowEdit}
    <button class="material icon-button edit-button" on:click={toggleEdit}>
      <span class="material-symbols-outlined">
        {edit ? "done" : "edit"}
      </span>
    </button>
    {#if edit}
      <button
        class="material icon-button remove-button"
        on:click={handleDelete}
      >
        <span class="material-symbols-outlined"> delete </span>
      </button>
    {/if}
  {/if}
</div>

<style lang="scss">
  .card-container {
    background-color: aliceblue;
    border-radius: 0.5rem;
    width: 5em;
    height: 5em;
    color: #333;
    position: relative;

    &.clear {
      background-color: transparent;
      color: inherit;
      border: none;
      margin: 0;
    }

    &.edit {
      align-items: flex-end;
    }
  }

  .inputs {
    margin-bottom: 15px;
    select {
      border: none;
      background-color: transparent;
      color: inherit;
      font-size: 1.5em;
      font-weight: bold;
      padding: 0;
      margin: 0;
      text-align: center;
      border-bottom: 2px solid #333;
    }
  }

  .letter {
    font-size: 2em;
    font-weight: bold;
  }
  .deviation {
    font-size: 1.4em;
    font-weight: bold;
  }

  .icon-button {
    position: absolute;

    border-radius: 0 0.5rem 0 0;
    //background-color: ;
    color: #4b4b4b;
    border: none;
    //width: 1rem;
    //height: 1rem;
    padding: 0;
    margin: 0;
  }

  .edit-button {
    top: 0;
    right: 0;
  }

  .remove-button {
    top: 0;
    left: 0;
  }
</style>
