<script lang="ts">
  import type { NoteSet } from "../../store/note_set";
  import NoteCarrousel from "./NoteCarrousel.svelte";
  import { createEventDispatcher, onDestroy, onMount } from "svelte";
  import { saveMod } from "../../util";
  import CycleSelect from "./CycleSelect.svelte";
  import JSConfetti from "js-confetti";
  import { recordFinish } from "../../store/stats";

  export let noteSet: NoteSet;

  export let noteIndex = -1;

  const dispatch = createEventDispatcher();

  let playing = false;
  const jsConfetti = new JSConfetti();
  const keyTimeout = 200;
  const keyTimeouts = new Map<string, number>();
  let duration = JSON.parse(localStorage.getItem("duration") || "1000");

  $: {
    localStorage.setItem("duration", JSON.stringify(duration));
  }

  $: notes = noteSet.notes;

  const advanceIndex = () => {
    noteIndex = saveMod(noteIndex + 2, $notes.length + 1) - 1;
  };
  const retreatIndex = () => {
    noteIndex = saveMod(noteIndex, $notes.length + 1) - 1;
  };

  const finished = () => {
    playing = false;
    recordFinish(noteSet, duration);

    setTimeout(() => {
      if (noteIndex === $notes.length - 1) {
        jsConfetti.addConfetti({
          confettiNumber: 250,
        });
        jsConfetti.addConfetti({
          emojis: ["🎵", "??", "🎶", "🎵", "🎶", "🎵", "🎶"],
          confettiNumber: 20,
        });
      }
    }, duration);
  };

  const continuePlaying = () => {
    if (!playing) return;

    setTimeout(() => {
      if (!playing) return;
      advanceIndex();
      if (noteIndex === $notes.length - 1) {
        finished();
      } else {
        continuePlaying();
      }
    }, duration);
  };

  $: {
    playing;
    continuePlaying();
  }

  const reset = () => {
    noteIndex = -1;
  };

  const togglePlaying = () => {
    playing = !playing;
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (keyTimeouts.has(event.key)) {
      return;
    }
    keyTimeouts.set(
      event.key,
      setTimeout(() => {
        keyTimeouts.delete(event.key);
      }, keyTimeout),
    );
    if (event.key === "ArrowLeft") {
      retreatIndex();
    } else if (event.key === "ArrowRight") {
      advanceIndex();
    } else if (event.key === " ") {
      if (noteIndex === $notes.length - 1) {
        reset();
      } else {
        togglePlaying();
      }
    }
  };

  const onClose = () => {
    dispatch("close");
  };

  const randomize = () => {
    noteSet.shuffle();
  };

  onMount(() => {
    window.addEventListener("keydown", handleKeyDown);
  });
  onDestroy(() => {
    window.removeEventListener("keydown", handleKeyDown);
  });
</script>

<div class="main flex-center">
  <button class="material text-button close-button" on:click={onClose}>
    <span class="material-symbols-outlined">close</span>
    Close
  </button>
  <NoteCarrousel bind:index={noteIndex} notes={$notes} />
  <div class="actions">
    {#if noteIndex === $notes.length - 1}
      <button on:click={reset} class="material text-button">
        <span class="material-symbols-outlined">replay</span>
        Reset
      </button>
    {:else}
      <button class="material text-button" on:click={togglePlaying}>
        {#if playing}
          <span class="material-symbols-outlined">pause</span>
          Pause
        {:else}
          <span class="material-symbols-outlined">play_arrow</span>
          Play
        {/if}
      </button>
    {/if}
    <button class="material text-button" on:click={randomize}>
      <span class="material-symbols-outlined">casino</span>
      Randomize
    </button>
  </div>
  <div class="cycle-select">
    <CycleSelect bind:duration />
  </div>
</div>

<style lang="scss">
  .main {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(5px);
    overflow: hidden;
    flex-direction: column;
  }

  .actions {
    margin-top: 25px;
    display: flex;
    justify-content: center;
    gap: 25px;
  }

  .cycle-select {
    position: absolute;
    bottom: 0;
    right: 0;
    margin: 25px;
  }

  .close-button {
    position: absolute;
    top: 0;
    right: 0;
    margin: 25px;
  }

  .material.text-button {
    font-size: 1.2em;
    font-weight: bold;
  }
</style>
