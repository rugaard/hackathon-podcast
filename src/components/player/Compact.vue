<template>
  <!-- Full player -->
  <div class="w-full lg:max-w-3xl lg:mx-auto h-full py-25 lg:shadow-md bg-white/90 lg:left-1/2 lg:-translate-x-1/2 flex flex-col justify-between gap-30 fixed z-100 backdrop-filter backdrop-blur-md transition-all duration-300" :class="{ 'top-full': !isVisible || !isFullPlayerVisisble, 'top-0':  isVisible && isFullPlayerVisisble }">
    <div class="flex-none">
      <div class="relative">
        <button type="button" class="absolute top-1 right-25" @click="toggleFullPlayer">
          <FontAwesomeIcon :icon="['far', 'xmark']" class="text-23" />
        </button>
        <h3 class="text-16 px-50 font-semibold text-center">Afspiller</h3>
      </div>
      <div class="p-20" :class="{ 'grayscale': !player.isPlaying.value }">
        <div class="w-[300px] h-[300px] mx-auto rounded-lg bg-contain bg-center" :style="'background-image: url(\'' + player.episode.value?.image.original + '\')'">
          <div class="w-full h-full p-50 bg-white/40 backdrop-filter backdrop-blur rounded-lg">
            <img :src="player.episode.value?.image.original ?? 'https://dummyimage.com/40x40'" class="h-[200px]" alt="" />
          </div>
        </div>
      </div>
      <div class="mt-5 px-45 flex flex-col">
        <h4 class="text-16 font-semibold line-clamp-1">{{ player.episode.value?.title }}</h4>
        <h5 class="text-14 pt-5">{{ player.episode.value?.show.title }}</h5>
        <div class="my-30 flex items-center justify-between gap-10">
          <span class="w-[40px] text-13 flex-none text-right">{{ player.timePlayedAsReadable.value }}</span>
          <div class="flex-1 flex flex-col items-center justify-center relative">
            <input type="range" class="w-full h-5 accent-pink-300 bg-transparent absolute -top-3 z-1 appearance-none" @change="(event: any) => player.position(event.target?.value || undefined)" :value="player.timePlayedInPercentage.value || 0" min="0" max="100" />
            <progress class="w-full h-5 appearance-none [&::-webkit-progress-bar]:rounded-lg [&::-webkit-progress-bar]:bg-gray-200 [&::-webkit-progress-value]:rounded-lg [&::-webkit-progress-value]:bg-pink-300 absolute -top-3" :value="player.timePlayedInPercentage.value || 0" max="100">{{ (player.timePlayedInPercentage.value || 0) }}%</progress>
          </div>
          <span class="w-[40px] text-13 flex-none">{{ player.remainingTimeAsReadable.value }}</span>
        </div>
      </div>
      <div class="px-45 flex items-center justify-center gap-20">
        <div class="pr-16">
          <button type="button" class="flex items-center gap-2" @click="player.rewind(10)">
            <FontAwesomeLayers fixed-width>
              <FontAwesomeIcon :icon="['fal', 'rotate-left']" class="text-35" />
              <FontAwesomeLayersText transform="right-9 shrink-6" class="font-medium" value="10" />
            </FontAwesomeLayers>
          </button>
        </div>
        <div class="flex-none">
          <button type="button" class="flex-none" @click="player.togglePlayPause">
            <FontAwesomeIcon :icon="['fas', player.isPlaying.value ? 'pause-circle': 'play-circle']" class="text-60" :class="{ 'text-pink-400': player.isPlaying.value }" fixed-width />
          </button>
        </div>
        <div class="pr-20">
          <button type="button" class="flex-1 flex items-center gap-2" @click="player.forward(15)">
            <FontAwesomeLayers fixed-width>
              <FontAwesomeIcon :icon="['fal', 'rotate-right']" class="text-35" />
              <FontAwesomeLayersText transform="right-7 shrink-6" class="font-medium" value="15" />
            </FontAwesomeLayers>
          </button>
        </div>
      </div>
    </div>
    <div class="flex justify-center">
      <button type="button" class="text-13 text-gray-500 py-8 px-15 border border-gray-300/80 rounded-full bg-gray-200/80 flex items-center justify-center gap-5" @click="player.quit">
        <FontAwesomeIcon :icon="['fas', 'power-off']" class="text-15" fixed-width />
        <span>Afslut afspiller</span>
      </button>
    </div>
  </div>
  <!-- Episodes list -->
  <div class="w-full lg:max-w-3xl lg:mx-auto h-full pt-25 pb-[66px] lg:shadow-md bg-white/90 lg:left-1/2 lg:-translate-x-1/2 flex flex-col fixed z-80 backdrop-filter backdrop-blur-md transition-all duration-300 cursor-pointer" :class="{ 'top-full': !isVisible || !isShowEpisodesVisible, 'top-0':  isVisible && isShowEpisodesVisible }">
    <div class="flex-none">
      <div class="relative">
        <button type="button" class="absolute top-2 right-25" @click="toggleShowEpisodes">
          <FontAwesomeIcon :icon="['far', 'xmark']" class="text-23" />
        </button>
        <h3 class="text-16 px-30 font-semibold text-center">Episoder</h3>
        <div class="flex py-20 lg:py-30 px-20 lg:px-50">
          <img :src="player.showEpisodes.value?.show.image?.url ?? 'https://dummyimage.com/40x40'" class="h-70 lg:h-100 flex-none rounded-lg" alt="" />
          <div class="flex flex-col justify-center pl-15 space-y-8">
            <strong class="text-15 lg:text-17 leading-18 font-semibold line-clamp-1">{{ player.showEpisodes.value?.show.title }}</strong>
            <span class="text-14 leading-18 line-clamp-2 lg:line-clamp-4" v-html="player.showEpisodes.value?.show.description!.html" />
          </div>
        </div>
      </div>
      <h5 class="text-17 lg:text-18 font-semibold px-20 my-5">{{ player.showEpisodes.value?.episodes.length }} episoder</h5>
    </div>
    <div class="border-y divide-y overflow-y-auto">
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
  <!-- Compact -->
  <div class="w-full pt-10 pb-13 px-10 border-t border-gray-100 bg-white shadow-md shadow-gray-800 fixed inset-x z-90 transition-all" :class="{ '-bottom-full': !isVisible, 'bottom-0': isVisible }">
    <div class="max-w-3xl mx-auto" @click="toggleFullPlayer">
      <template v-if="!isLoading">
        <div class="flex h-40 items-center justify-between">
          <div class="flex items-center">
            <img :src="player.episode.value?.image.url ?? 'https://dummyimage.com/40x40'" class="h-40 flex-none rounded-lg" :class="{ 'grayscale': !player.isPlaying.value }" alt="" />
            <div class="flex flex-col justify-center px-8">
              <strong class="text-13 leading-18 font-semibold line-clamp-1">{{ player.episode.value?.title }}</strong>
              <span class="text-13 leading-18">{{ player.episode.value?.show.title }}</span>
            </div>
          </div>
          <div class="flex-none pr-5 flex items-center gap-x-10">
            <button type="button" @click.stop="player.togglePlayPause" v-if="player.isPlayable.value">
              <FontAwesomeIcon :icon="['fas', player.isPlaying.value ? 'pause' : 'play']" class="text-20" :class="{ 'text-pink-400': player.isPlaying.value }" fixed-width />
            </button>
            <FontAwesomeIcon v-else :icon="['fad', 'spinner-third']" class="text-20" fixed-width spin />
            <button type="button" @click.stop="toggleShowEpisodes">
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
import { computed, ref, watch } from 'vue';
import { FontAwesomeIcon, FontAwesomeLayers, FontAwesomeLayersText } from '@fortawesome/vue-fontawesome';
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
const isFullPlayerVisisble = ref<boolean>(false);
const isShowEpisodesVisible = ref<boolean>(false);

/**
 * ------------------------------------------
 * Methods
 * ------------------------------------------
 */

/**
 * Toggle open/close state of full player.
 *
 * @returns { void }
 */
const toggleFullPlayer = (): void => {
  isFullPlayerVisisble.value = isFullPlayerVisisble.value ? false : true;
}

/**
 * Toggle open/close state of show episodes list.
 *
 * @returns { void }
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
});

/**
 * ------------------------------------------
 * Watchers
 * ------------------------------------------
 */
watch(() => isVisible.value, (value: boolean) => {
  if (value) {
    return;
  }

  isFullPlayerVisisble.value = false;
  isShowEpisodesVisible.value = false;
});
</script>
