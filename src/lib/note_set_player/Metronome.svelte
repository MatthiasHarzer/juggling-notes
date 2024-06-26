<script lang="ts">
  import MetronomeBody from "../../assets/metronome_empty.svg";
  import MetronomeTick from "../../assets/metronome_shaft.svg";
  import MetronomeDot from "../../assets/metronome_dot.svg";
  import MetronomeSound from "../../assets/metronome_sound.mp3";
  import MetronomeSound2 from "../../assets/metronome_sound_2.mp3";
  import { onMount } from "svelte";
  import { saveMod } from "../../util";
  export let cycleTime: number = 100;

  let cycle: number = 0;
  let mutedVolume: number = 0;
  let inputElement: HTMLInputElement;
  let muted: boolean = JSON.parse(
    localStorage.getItem("metronome_muted") || "false",
  );
  $: localStorage.setItem("metronome_muted", muted.toString());
  let volume: number = JSON.parse(
    localStorage.getItem("metronome_volume") || "0.5",
  );
  $: localStorage.setItem("metronome_volume", volume.toString());

  let noAnimation: boolean = false;
  const tickAudio = new Audio(MetronomeSound);
  const tockAudio = new Audio(MetronomeSound2);
  $: {
    tickAudio.volume = volume;
  }

  $: if (muted) {
    mutedVolume = 0;
  } else {
    setTimeout(() => {
      inputElement?.focus();
    }, 10);
  }

  $: binCycle = saveMod(cycle, 2) === 0;

  export const tock = () => {
    cycle++;

    if (!muted) {
        tockAudio.currentTime = 0.03; // quick and easy way to better sync both tracks
        tockAudio.play();
    }
  };

  export const tick = () => {
    cycle++;

    if (!muted) {
        tickAudio.currentTime = 0;
        tickAudio.play();
    }
  }

  export const reset = () => {
    noAnimation = true;
    cycle = -1;
    setTimeout(() => {
      noAnimation = false;
    }, 10);
  };

  export const stop = () => {
    cycle = -1;
  };

  onMount(() => {
    setTimeout(() => {
      inputElement?.blur();
    }, 100);
  });
</script>

<div class="main" style="--animation-time: {cycleTime}ms;">
  <div class="sound-control">
    {#if muted}
      <input
        class="volume"
        type="range"
        min="0"
        max="1"
        step="0.01"
        bind:value={mutedVolume}
        on:change={() => {
          muted = false;
          volume = mutedVolume;
        }}
      />
    {:else}
      <input
        bind:this={inputElement}
        class="volume"
        type="range"
        min="0"
        max="1"
        step="0.01"
        bind:value={volume}
      />
    {/if}
    <button class="material muted-button" on:click={() => (muted = !muted)}>
      <span class="material-symbols-outlined">
        {muted ? "volume_off" : "volume_up"}
      </span>
    </button>
  </div>

  <div class="metronome-image">
    <img class="body" src={MetronomeBody} alt="A" />
    <img
      class="tick"
      src={MetronomeTick}
      alt="I"
      class:animation-right={binCycle}
      class:animation-left={!binCycle}
      class:no-animation={noAnimation || cycle === -1}
    />
    <img class="dot" src={MetronomeDot} alt="." />
  </div>
</div>

<style lang="scss">
  .main {
    position: relative;
    padding: 0 50px;
  }

  .metronome-image {
    position: relative;
    --rotation: 35deg;
    img {
      height: 250px;
      opacity: 0.8;
    }

    img.body {
      filter: invert(47%) sepia(5%) saturate(2787%) hue-rotate(346deg)
        brightness(94%) contrast(87%);
    }

    img.tick {
      opacity: 1;
      height: 80%;
      position: absolute;
      bottom: 20%;
      left: 50%;
      transform: translateX(-50%);
      filter: drop-shadow(0 0 1px rgba(0, 217, 255, 0.49));
      rotate: 0;
      transform-origin: bottom left;

      --bezier-fade-out: cubic-bezier(0, 0.5, 0.5, 1);
      --bezier-fade-in: cubic-bezier(0.5, 0, 1, 0.5);

      &.no-animation {
        animation: none !important;
      }

      &.animation-right {
        animation: animate-right var(--animation-time);
        animation-timing-function: ease-out;
      }

      &.animation-left {
        animation: animate-left var(--animation-time);
        animation-timing-function: ease-out;
      }

      @keyframes animate-right {
        0% {
          rotate: 0;
        }
        50% {
          rotate: calc(var(--rotation));
          animation-timing-function: ease-in;
        }
        100% {
          rotate: 0;
        }
      }

      @keyframes animate-left {
        0% {
          rotate: 0;
        }
        50% {
          rotate: calc(var(--rotation) * -1);
          animation-timing-function: ease-in;
        }
        100% {
          rotate: 0;
        }
      }
    }

    img.dot {
      opacity: 1;
      height: 8%;
      position: absolute;
      bottom: 15%;
      left: 50%;
      transform: translateX(-50%);
    }
  }

  .sound-control {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 0;
    display: flex;
    justify-content: flex-end;
    align-items: flex-end;
    flex-direction: column;

    .muted-button {
      opacity: 0.7;
      transition: opacity 0.5s;
    }

    .volume {
      transform: translate(95%) rotate(-90deg);
      transform-origin: bottom left;
      opacity: 0;
      transition: opacity 0.5s;
    }

    &:focus-within,
    &:hover {
      .volume,
      .muted-button {
        opacity: 1;
      }
    }
  }
</style>
