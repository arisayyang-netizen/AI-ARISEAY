<template>
  <div class="aurora-container" :class="containerClass">
    <div class="aurora-background"></div>
    <div class="aurora-content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  className?: string
  showRadialGradient?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  className: '',
  showRadialGradient: true
})

const containerClass = computed(() => [
  'relative flex h-screen flex-col items-center justify-center',
  'bg-zinc-50 dark:bg-zinc-900 text-slate-950 dark:text-white',
  props.className
].join(' '))
</script>

<style scoped>
.aurora-container {
  position: relative;
  overflow: hidden;
}

.aurora-background {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    45deg,
    #3b82f6 0%,
    #a5b4fc 15%,
    #93c5fd 30%,
    #ddd6fe 45%,
    #60a5fa 60%,
    #3b82f6 100%
  );
  background-size: 400% 400%;
  animation: aurora 15s ease infinite;
  opacity: 0.3;
  filter: blur(40px);
}

.dark .aurora-background {
  background: linear-gradient(
    45deg,
    #1e40af 0%,
    #6366f1 15%,
    #3b82f6 30%,
    #8b5cf6 45%,
    #6366f1 60%,
    #1e40af 100%
  );
  opacity: 0.4;
}

.aurora-content {
  position: relative;
  z-index: 1;
}

@keyframes aurora {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
</style>