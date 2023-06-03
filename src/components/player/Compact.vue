<template>
  <div class="w-full pt-10 pb-13 px-10 border-t border-gray-100 bg-white shadow-md shadow-gray-800 fixed inset-x z-100 transition-all" :class="{ '-bottom-full': !isVisible, 'bottom-0': isVisible }">
    <div class="max-w-3xl mx-auto">
      <template v-if="!isLoading">
        <div class="flex h-40 items-center justify-between">
          <div class="flex items-center">
            <img :src="currentlyPlaying?.image_url ?? 'https://dummyimage.com/40x40'" class="h-40 flex-none rounded-lg" alt="" />
            <div class="flex flex-col justify-center px-8">
              <strong class="text-13 leading-18 font-semibold line-clamp-1">{{ currentlyPlaying?.title }}</strong>
              <span class="text-13 leading-18">{{ currentlyPlaying?.show?.title }}</span>
            </div>
          </div>
          <div class="flex-none pr-5 flex items-center gap-x-10">
            <button type="button" @click="player?.togglePlayPause">
              <FontAwesomeIcon :icon="['fas', player?.isPlaying ? 'pause' : 'play']" class="text-20" :class="{ 'text-pink-400': player?.isPlaying }" fixed-width />
            </button>
            <button type="button">
              <FontAwesomeIcon :icon="['far', 'list']" class="text-20" fixed-width />
            </button>
          </div>
        </div>
        <div class="w-full h-3 absolute left-0 right-0 bottom-0 bg-gray-300">
          <div class="h-3 bg-pink-400" :style="'width:' + player?.currentTimeInPercentage || 0 + '%'" />
        </div>
      </template>
      <div v-else class="h-40 flex items-center">
        <span class="text-16 font-semibold px-10">Indlæser ...</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { usePodcastPlayer } from '@plugins/podcast-player';

/**
 * ------------------------------------------
 * Component properties
 * ------------------------------------------
 */
defineProps({
  isActive: {
    type: Boolean,
    default: false
  },
  isLoading: {
    type: Boolean,
    default: false
  },
  isVisible: {
    type: Boolean,
    default: false
  }
});

/**
 * ------------------------------------------
 * Composables
 * ------------------------------------------
 */
const podcastPlayer = usePodcastPlayer();
const { player, currentlyPlaying } = podcastPlayer;
</script>
