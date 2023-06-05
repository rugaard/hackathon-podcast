<template>
  <CompactPlayer />
</template>

<script lang="ts" setup>
import { usePodcastPlayer } from '@plugins/podcast-player';

import CompactPlayer from '@components/player/Compact.vue';

/**
 * ------------------------------------------
 * Composables
 * ------------------------------------------
 */
const player = usePodcastPlayer();
</script>
