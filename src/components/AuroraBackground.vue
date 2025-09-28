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
    #00bcd4 0%,   /* 蓝绿 */
    #26c6da 15%,  /* 亮青 */
    #4caf50 30%,  /* 清新绿 */
    #8bc34a 45%,  /* 浅绿 */
    #1de9b6 60%,  /* 薄荷绿 */
    #00bcd4 100%  /* 回到蓝绿 */
  );
  background-size: 400% 400%;
  animation: aurora 15s ease infinite;
  opacity: 0.35;
  filter: blur(40px);
}

.dark .aurora-background {
  background: linear-gradient(
    45deg,
    #007c91 0%,   /* 深青 */
    #00acc1 15%,  /* 蓝绿 */
    #00897b 30%,  /* 墨绿 */
    #26a69a 45%,  /* 青绿 */
    #00bfa5 60%,  /* 祖母绿偏青 */
    #007c91 100%  /* 回到深青 */
  );
  opacity: 0.45;
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