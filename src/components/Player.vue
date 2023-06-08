<template>
  <CompactPlayer />
</template>

<script lang="ts" setup>
import { watch } from 'vue';
import { usePodcastPlayer, type Episode } from '@/plugins/podcast-player';


import CompactPlayer from '@components/player/Compact.vue';

/**
 * ------------------------------------------------------
 * Composable
 * ------------------------------------------------------
 */
const podcastPlayer = usePodcastPlayer();

/**
 * ------------------------------------------
 * Watchers
 * ------------------------------------------
 */
watch(() => podcastPlayer.episode.value, (episode: Episode|null) => {
  if (!episode) {
    navigator.mediaSession.metadata = null;
    return;
  }

  navigator.mediaSession.metadata = new MediaMetadata({
    title: episode.title,
    artist: episode.show.title,
    album: episode.show.title,
    artwork: [{
      src: episode.image.url,
      sizes: '200x200',
      type: 'image/jpeg',
    }, {
      src: episode.image.original,
      sizes: '1400x1400',
      type: 'image/jpeg',
    }]
  });
})
</script>
