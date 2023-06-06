<template>
  <div class="px-10"></div>
</template>

<script lang="ts" setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { usePodcastPlayer } from '@plugins/podcast-player';

/**
 * ------------------------------------------
 * Composables
 * ------------------------------------------
 */
const player = usePodcastPlayer();
</script>
