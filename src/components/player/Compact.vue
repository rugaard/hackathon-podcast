<template>
  <div class="w-full lg:max-w-3xl lg:mx-auto h-screen pt-25 pb-[66px] lg:shadow-md bg-white/70 lg:left-1/2 lg:-translate-x-1/2 fixed z-90 backdrop-filter backdrop-blur-md transition-all duration-300" :class="{ 'top-full': !isShowEpisodesVisible, 'top-0': isShowEpisodesVisible }">
    <div class="relative">
      <button type="button" class="absolute top-5 right-25" @click="toggleShowEpisodes">
        <FontAwesomeIcon :icon="['far', 'xmark']" class="text-23" />
      </button>
      <h3 class="text-16 px-30 font-semibold text-center">Episoder</h3>
      <div class="flex py-30 px-20 lg:px-50">
        <img :src="player.showEpisodes.value?.show.image?.url ?? 'https://dummyimage.com/40x40'" class="h-70 lg:h-100 flex-none rounded-lg" alt="" />
        <div class="flex flex-col justify-center pl-15 space-y-8">
          <strong class="text-16 lg:text-17 leading-18 font-semibold line-clamp-1">{{ player.showEpisodes.value?.show.title }}</strong>
          <span class="text-15 leading-18 line-clamp-2 lg:line-clamp-4" v-html="player.showEpisodes.value?.show.description!.html" />
        </div>
      </div>
      <h5 class="text-17 lg:text-18 font-semibold px-20 my-5">{{ player.showEpisodes.value?.episodes.length }} episoder</h5>
      <div class="border-y divide-y">
        <div class="py-10 px-20 flex items-center justify-between gap-20" :class="[player.isPlaying.value && player.isEpisodePlaying(item.id!) ? 'bg-white/90' : 'odd:bg-gray-100/40']" v-for="item in player.showEpisodes.value?.episodes">
          <div class="pr-10 py-1 flex flex-col justify-center gap-y-6" :class="{ 'text-pink-400': player.isPlaying.value && player.isEpisodePlaying(item.id!) }">
            <span class="text-14 leading-20 font-semibold line-clamp-2">{{ item.title }}</span>
            <span class="text-13 leading-14">{{ (new Date(item.published_at!)).toLocaleDateString() }} | {{ (item.duration! / 60000).toFixed(0) }} min.</span>
          </div>
          <div class="flex-none">
            <template v-if="player.isEpisodePlaying(item.id!)">
              <button type="button" @click="player.togglePlayPause" v-if="player.isPlayable.value">
                <FontAwesomeIcon :icon="['fas', player.isPlaying.value ? 'pause-circle': 'play-circle']" class="text-30" :class="{ 'text-pink-400': player.isPlaying.value }" fixed-width />
              </button>
              <FontAwesomeIcon v-else :icon="['fad', 'spinner-third']" class="text-30" fixed-width spin />
            </template>
            <button type="button" @click="player.playEpisode(item.id!)" v-else>
              <FontAwesomeIcon :icon="['fas', 'play-circle']" class="text-30" fixed-width />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="w-full pt-10 pb-13 px-10 border-t border-gray-100 bg-white shadow-md shadow-gray-800 fixed inset-x z-100 transition-all" :class="{ '-bottom-full': !isVisible, 'bottom-0': isVisible }">
    <div class="max-w-3xl mx-auto">
      <template v-if="!isLoading">
        <div class="flex h-40 items-center justify-between">
          <div class="flex items-center">
            <img :src="player.episode.value?.image.url ?? 'https://dummyimage.com/40x40'" class="h-40 flex-none rounded-lg" alt="" />
            <div class="flex flex-col justify-center px-8">
              <strong class="text-13 leading-18 font-semibold line-clamp-1">{{ player.episode.value?.title }}</strong>
              <span class="text-13 leading-18">{{ player.episode.value?.show.title }}</span>
            </div>
          </div>
          <div class="flex-none pr-5 flex items-center gap-x-10">
            <button type="button" @click="player.togglePlayPause" v-if="player.isPlayable.value">
              <FontAwesomeIcon :icon="['fas', player.isPlaying.value ? 'pause' : 'play']" class="text-20" :class="{ 'text-pink-400': player.isPlaying.value }" fixed-width />
            </button>
            <FontAwesomeIcon v-else :icon="['fad', 'spinner-third']" class="text-20" fixed-width spin />
            <button type="button" @click="toggleShowEpisodes">
              <FontAwesomeIcon :icon="['far', 'list']" class="text-20" :class="{ 'text-pink-400': isShowEpisodesVisible }" fixed-width />
            </button>
          </div>
        </div>
        <div class="w-full max-w-3xl mx-auto h-3 absolute left-0 right-0 bottom-0 bg-gray-300">
          <div class="h-3 bg-pink-400" :style="'width:' + (player.timePlayedInPercentage.value || 0) + '%'" />
        </div>
      </template>
      <div v-else class="h-40 flex items-center">
        <span class="text-16 font-semibold px-10">Indlæser ...</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
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
  }
});

/**
 * ------------------------------------------
 * Composables
 * ------------------------------------------
 */
const player = usePodcastPlayer();

/**
 * ------------------------------------------
 * Refs
 * ------------------------------------------
 */
const isShowEpisodesVisible = ref<boolean>(false);

/**
 * ------------------------------------------
 * Methods
 * ------------------------------------------
 */
const toggleShowEpisodes = (): void => {
  isShowEpisodesVisible.value = isShowEpisodesVisible.value ? false : true;
}

/**
 * ------------------------------------------
 * Computed
 * ------------------------------------------
 */
const isVisible = computed<boolean>((): boolean => {
  return player.episode.value !== null;
})
</script>
