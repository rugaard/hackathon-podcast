<template>
  <div class="border-b sticky top-0 z-50 bg-white">
    <div class="max-w-3xl mx-auto py-10 px-15 flex items-center justify-between">
      <h1>
        <RouterLink to="/" class="flex items-center gap-x-10">
          <img src="@/assets/logo.svg" class="h-30" />
          <span class="text-20 font-semibold uppercase">Podcast</span>
        </RouterLink>
      </h1>
      <Navigation />
    </div>
  </div>
  <div class="max-w-3xl mx-auto pt-15" :class="{ 'pb-[76px]': isVisible, 'pb-15': !isVisible }">
    <RouterView />
  </div>
  <Player />
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { RouterLink, RouterView } from 'vue-router';
import { usePodcastPlayer } from '@/plugins/podcast-player';

import Navigation from '@/components/layout/Header/Navigation.vue';
import Player from '@/components/Player.vue';

/**
 * ------------------------------------------------------
 * Composable
 * ------------------------------------------------------
 */
const podcastPlayer = usePodcastPlayer();

/**
 * ------------------------------------------
 * Computed
 * ------------------------------------------
 */
const isVisible = computed<boolean>((): boolean => {
  return podcastPlayer.episode.value !== null;
});
</script>
