<script lang="ts">
  import type { NoteSet } from "../../store/note_set";
  import NoteCarrousel from "./NoteCarrousel.svelte";
  import { createEventDispatcher, onMount } from "svelte";
  import { saveMod } from "../../util";
  import CycleSelect from "./CycleSelect.svelte";
  import JSConfetti from "js-confetti";
  import { recordFinish } from "../../store/stats";
  import Metronome from "./Metronome.svelte";

  export let noteSet: NoteSet;

  export let noteIndex = -1;

  const dispatch = createEventDispatcher();

  let playing = false;
  const jsConfetti = new JSConfetti();
  const keyTimeout = 200;
  const keyTimeouts = new Map<string, number>();
  let tick = 0;
  let duration = JSON.parse(localStorage.getItem("duration") || "1000");
  let cycle = JSON.parse(localStorage.getItem("cycle") || "4");
  let metronome: Metronome;
  let cycleInterval: number;
  let showMetronome = JSON.parse(
    localStorage.getItem("showMetronome") || "true",
  );
  $: localStorage.setItem("showMetronome", JSON.stringify(showMetronome));

  $: animationDuration = Math.min(500, Math.max(250, duration / 4));

  $: {
    localStorage.setItem("duration", JSON.stringify(duration));
  }

  $: notes = noteSet.notes;
  $: isFinished = noteIndex === $notes.length - 1;

  $: {
    duration;
    setCycleInterval();
  }

  const setCycleInterval = () => {
    clearInterval(cycleInterval);
    metronome?.reset();
    cycleInterval = setInterval(tickCycle, duration);
  };

  const advanceIndex = () => {
    noteIndex = saveMod(noteIndex + 2, $notes.length + 1) - 1;
  };
  const retreatIndex = () => {
    noteIndex = saveMod(noteIndex, $notes.length + 1) - 1;
  };

  const finished = () => {
    playing = false;
    recordFinish(noteSet, duration);
    metronome?.stop();

    setTimeout(() => {
      if (isFinished) {
        jsConfetti.addConfetti({
          confettiNumber: 500,
        });
        jsConfetti.addConfetti({
          emojis: ["🎵", "??", "🎶", "🎵", "🎶", "🎵", "🎶"],
          confettiNumber: 40,
        });
      }
    }, duration);
  };

  const tickCycle = () => {
    tick++;

    if (tick % cycle === 0) {
      playTick();

      if (!isFinished) {
        metronome?.tock();
      }
    } else if (!isFinished) {
      metronome?.tick();
    }
  };

  const playTick = () => {
    if (!playing) return;
    if (noteIndex === $notes.length - 1) {
      finished();
    } else {
      advanceIndex();
    }
  };
  const reset = () => {
    noteIndex = -1;
  };

  const togglePlaying = () => {
    playing = !playing;
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    event.preventDefault();
    event.stopPropagation();
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

  const toggleMetronome = () => {
    showMetronome = !showMetronome;
    setCycleInterval();
  };

  onMount(() => {
    window.addEventListener("keydown", handleKeyDown);
    setCycleInterval();
    metronome?.tock();

    return () => {
      clearInterval(cycleInterval);
      window.removeEventListener("keydown", handleKeyDown);
    };
  });
</script>

<div class="main flex-center">
  <button
    class="material text-button toggle-metronome-button"
    on:click={toggleMetronome}
  >
    <span class="material-symbols-outlined">
      {#if showMetronome}
        music_note
      {:else}
        music_off
      {/if}
    </span>
    {#if showMetronome}
      Hide metronome
    {:else}
      Show metronome
    {/if}
  </button>
  <button class="material text-button close-button" on:click={onClose}>
    <span class="material-symbols-outlined">close</span>
    Close
  </button>
  {#if showMetronome}
    <div class="metronome">
      <Metronome bind:this={metronome} cycleTime={duration} numCycles={cycle} />
    </div>
  {/if}
  <NoteCarrousel bind:index={noteIndex} notes={$notes} {animationDuration} />
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
    <CycleSelect bind:duration bind:cycle />
  </div>
</div>

<style lang="scss">
  .main {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    padding-bottom: 50px;
    box-sizing: border-box;
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

  .toggle-metronome-button {
    position: absolute;
    top: 0;
    left: 0;
    margin: 25px;
  }

  .material.text-button {
    font-size: 1.2em;
    font-weight: bold;
  }

  .metronome {
    margin-bottom: 50px;
  }
</style>
