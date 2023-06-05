<template>
  <div class="home">
    <div class="flex items-center justify-between bg-pink-100 rounded-lg">
      <template v-if="player.episode.value">
        <div class="w-70 h-70 rounded-lg flex-none flex items-center justify-center relative overflow-hidden">
          <div class="rounded-lg relative" style="filter:blur(3px); -webkit-filter:blur(3px)">
            <img :src="player.episode.value?.image.url ?? 'https://dummyimage.com/40x40'" class="h-[70px]" alt="" />
          </div>
          <img :src="player.episode.value?.image.url ?? 'https://dummyimage.com/40x40'" class="h-[60px] absolute z-1" alt="" />
        </div>
        <div class="flex flex-col justify-center px-8">
          <strong class="text-13 leading-18 font-semibold line-clamp-1">{{ player.episode.value?.title }}</strong>
          <span class="text-13 leading-18 inline-block mt-4">{{ player.episode.value?.show.title }} | {{ (player.episode.value?.duration / 60000).toFixed(0) }} min.</span>
        </div>
      </template>
      <div class="flex-none flex items-center pr-20">
        <button type="button" v-if="52361215 === player.episode.value?.id" @click="player.togglePlayPause">
          <FontAwesomeIcon :icon="['fas', player.isPlaying.value ? 'pause-circle': 'play-circle']" class="text-30" :class="{ 'text-pink-400': player.isPlaying.value }" />
        </button>
        <button type="button" @click="player.playEpisode(52361215)" v-else>
          <FontAwesomeIcon :icon="['fas', 'play-circle']" class="text-30" />
        </button>
      </div>
    </div>
  </div>
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
