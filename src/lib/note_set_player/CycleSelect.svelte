<script lang="ts">
  import { onMount } from "svelte";

  export let duration = 1000;
  let playing = false;
  let element: HTMLDivElement;

  let durationFormatted = 0;

  const applyFormatted = () => {
    duration = 3300 - durationFormatted;
  };

  const applyDuration = () => {
    durationFormatted = 3300 - duration;
  };

  $: {
    duration;
    applyDuration();
  }

  $: {
    durationFormatted;
    applyFormatted();
  }

  const checkClick = (event: MouseEvent) => {
    playing = event.composedPath().includes(element);
  };

  onMount(() => {
    document.addEventListener("click", checkClick);
    return () => document.removeEventListener("click", checkClick);
  });
</script>

<div
  bind:this={element}
  class="main"
  on:blur={() => (playing = false)}
  on:focus={() => (playing = true)}
>
  <div class="description">
    <h3>Interval</h3>
    <input
      bind:value={durationFormatted}
      max="3000"
      min="300"
      step="50"
      type="range"
    />
  </div>
  <div class="time-indicator">
    <div
      class="indicator"
      class:no-animation={!playing}
      style="--animation-duration: {duration}ms"
    >
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
    <span>{duration}ms</span>
  </div>
</div>

<style lang="scss">
  .main {
    display: flex;
    flex-direction: row;

    align-items: center;

    .description {
      h3 {
        margin: 0 0 10px;
      }
    }
  }

  .time-indicator {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-left: 20px;
    span {
      //margin-left: 10px;
    }
  }

  .indicator {
    --size: 20px;
    width: calc(var(--size) * 5);
    height: var(--size);
    display: inline-block;
    position: relative;
    //right: calc(var(--size) / 2);

    &.no-animation div {
      //animation: none !important;
      //animation-timing-function: linear !important;
      animation-play-state: paused !important;
    }

    div {
      position: absolute;
      width: var(--size);
      height: var(--size);
      border-radius: 4px;
      background: currentColor;
      --timing-funciton: cubic-bezier(0.6, 0, 0.2, 1);
    }

    div:nth-child(1) {
      left: var(--size);
      opacity: 0.8;
      animation: lds-ellipsis1 var(--animation-duration) infinite;
      animation-timing-function: var(--timing-funciton);
    }

    div:nth-child(2) {
      left: var(--size);
      animation: lds-ellipsis2 var(--animation-duration) infinite;
      animation-timing-function: var(--timing-funciton);
    }

    div:nth-child(3) {
      left: calc(3 * var(--size));
      animation: lds-ellipsis3 var(--animation-duration) infinite;
      animation-timing-function: var(--timing-funciton);
    }

    div:nth-child(4) {
      opacity: 0.8;
      left: calc(3 * var(--size));
      animation: lds-ellipsis4 var(--animation-duration) infinite;
      animation-timing-function: var(--timing-funciton);
    }

    @keyframes lds-ellipsis1 {
      0% {
        translate: 0;
        scale: 0.5;
      }
      100% {
        translate: calc(-1 * var(--size)) 0;
        scale: 0;
      }
    }
    @keyframes lds-ellipsis2 {
      0% {
        translate: var(--size) 0;
        scale: 1;
        opacity: 1;
      }
      100% {
        translate: 0;
        scale: 0.5;
        opacity: 0.8;
      }
    }
    @keyframes lds-ellipsis3 {
      0% {
        translate: 0 0;
        scale: 0.5;
        opacity: 0.8;
      }
      100% {
        translate: calc(-1 * var(--size));
        scale: 1;
        opacity: 1;
      }
    }

    @keyframes lds-ellipsis4 {
      0% {
        translate: var(--size) 0;
        scale: 0;
      }
      100% {
        translate: 0;
        scale: 0.5;
      }
    }
  }
</style>
