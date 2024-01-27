<script lang="ts">
  import type { Note } from "../../store/note";
  import { onMount } from "svelte";
  import NoteCard from "../components/NoteCard.svelte";

  export let notes: Note[] = [];
  export let index = 0;
  export let animationDuration = 300;

  const jumpTo = (idx: number) => {
    index = idx;
  };

  $: {
    const element = document.getElementById(`element-${index}`);
    element?.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "center",
    });
  }

  $: style = `--animation-duration: ${animationDuration}ms;`;

  onMount(() => {
    setTimeout(() => {
      const element = document.getElementById(`element-${index}`);
      element?.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });
    }, 200);
  });
</script>

<div class="main">
  <div class="note-carrousel" {style}>
    <div class="carrousel-disk">
      <button
        class="clear note start-note flex-center"
        id="element--1"
        style="--proximity: {Math.abs(-1 - index) + 1}"
        class:current={-1 === index}
        on:click={() => jumpTo(-1)}
      >
        START
      </button>
      {#each notes as note, idx}
        <button
          class="clear note"
          class:current={idx === index}
          style="--proximity: {Math.abs(idx - index) + 1}"
          id="element-{idx}"
          on:click={() => jumpTo(idx)}
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
    //height: 100%;
    position: relative;
  }
  .note-carrousel {
    position: relative;
    --size: 150px;
    padding: 15px 0;
    width: 100%;
    font-size: 2rem;

    overflow-x: hidden;

    .carrousel-disk {
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      align-items: center;
      width: fit-content;
      position: relative;
      transition: left var(--animation-duration) ease-in-out;
    }

    .note {
      transition: all var(--animation-duration) ease-in-out;
      margin: 0 15px;
      scale: 0.8;
      font-size: inherit;
      opacity: calc(1 / var(--proximity) * 1.5);

      &.current {
        scale: 1;
        margin: 0 15px;
      }

      &:last-child {
        margin-right: 100vw;
      }
      &:first-child {
        margin-left: 100vw;
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
