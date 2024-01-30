<script lang="ts">
  import type { Note } from "../../store/note";
  import { onMount } from "svelte";
  import NoteCard from "../components/NoteCard.svelte";

  export let notes: Note[] = [];
  export let index = 0;
  export let animationDuration = 300;

  let elementWidth = 1000;
  $: offsetLeft = elementWidth * index * -1;

  const jumpTo = (idx: number) => {
    index = idx;
  };

  $: style = `--animation-duration: ${animationDuration}ms; --note-width: ${elementWidth}px; --offset-left: ${offsetLeft}px;`;
</script>

<div class="main">
  <div class="note-carrousel" {style}>
    <div class="carrousel-disk">
      <button
        class="clear note"
        id="element--1"
        style="--proximity: {Math.abs(-1 - index) + 1}"
        class:current={-1 === index}
        on:click={() => jumpTo(-1)}
      >
        <div class="start-note flex-center">START</div>
      </button>
      {#each notes as note, idx}
        <button
          class="clear note"
          class:current={idx === index}
          style="--proximity: {Math.abs(idx - index) + 1}"
          id="element-{idx}"
          on:click={() => jumpTo(idx)}
          bind:clientWidth={elementWidth}
        >
          <NoteCard {note} />
        </button>
      {/each}
    </div>
  </div>
  <div class="current-arrow" class:invisible={index === -1}></div>
</div>

<style lang="scss">
  .main {
    width: 100%;
    position: relative;
  }
  .note-carrousel {
    --size: 150px;
    padding: 15px 0;
    width: 0;
    margin: 0 auto;
    height: var(--size);
    font-size: 2rem;

    overflow-x: visible;

    .carrousel-disk {
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      align-items: center;
      width: fit-content;
      position: relative;
      transition: left var(--animation-duration) ease-in-out;
      translate: calc(var(--note-width) * -1 - var(--note-width) / 2 + 8px) 0;
      left: var(--offset-left);
    }

    .note {
      transition: all var(--animation-duration) ease-in-out;
      padding: 0 30px;
      //scale: calc(1 / var(--proximity) * 1.5);
      scale: 0.75;
      font-size: inherit;
      opacity: calc(1 / var(--proximity) * 1.5);

      &.current {
        scale: 1;
      }
    }

    .start-note {
      border: 2px solid aliceblue;
      width: var(--size);
      height: var(--size);
      border-radius: 15px;
      font-weight: bold;
    }
  }

  .current-arrow {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    opacity: 1;
    transition: opacity 0.5s ease-in-out;

    &.invisible {
      opacity: 0;
    }

    &::before {
      content: "";
      position: absolute;
      top: 0;
      left: 50%;
      transform: translate(-50%, -50%) rotate(45deg);
      width: 20px;
      height: 20px;
      border: 12px solid #ec6767;
      border-left: none;
      border-top: none;
    }
  }
</style>
