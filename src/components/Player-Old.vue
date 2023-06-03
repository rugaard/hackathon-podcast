<template>
  <div class="w-full h-screen inset-x z-90 backdrop-filter backdrop-blur-xl pt-25 pb-[66px] transition-all duration-300 fixed" :class="{ 'top-full': state !== 'list', 'top-0': state === 'list' }">
    <div class="max-w-3xl mx-auto relative">
      <button type="button" class="absolute top-5 right-25" @click="setState('compact')">
        <FontAwesomeIcon :icon="['far', 'xmark']" class="text-23" />
      </button>
      <h3 class="text-16 px-30 font-semibold text-center">Episoder</h3>
      <div class="flex py-30 px-50">
        <img :src="episode?.image_url ?? 'https://dummyimage.com/40x40'" class="h-60 flex-none rounded-lg" alt="" />
        <div class="flex flex-col justify-center pl-15">
          <strong class="text-15 leading-18 font-semibold line-clamp-1">{{ episode?.show.title }}</strong>
          <span class="text-15 leading-18">{{ showEpisodes.length }} episoder</span>
        </div>
      </div>
      <div class="mt-15 border-y divide-y">
        <div class="py-5 px-30 flex items-center justify-between gap-20" v-for="item in showEpisodes">
          <div class="pr-10 py-1 flex flex-col justify-center gap-y-6" :class="{ 'text-pink-400': isPlaying && playingEpisodeId === item.episode_id }">
            <span class="text-14 leading-20 font-semibold line-clamp-2">{{ item.title }}</span>
            <span class="text-13 leading-14">{{ (new Date(item.published_at)).toLocaleDateString() }} | {{ (item.duration / 60000).toFixed(0) }} min.</span>
          </div>
          <div class="flex-none">
            <button type="button" @click="togglePlayPause" v-if="playingEpisodeId === item.episode_id">
              <FontAwesomeIcon :icon="['fas', isPlaying ? 'pause-circle': 'play-circle']" class="text-30" :class="{ 'text-pink-400': isPlaying }" />
            </button>
            <button type="button" @click="loadEpisode(item.episode_id)" v-else>
              <FontAwesomeIcon :icon="['fas', 'play-circle']" class="text-30" />
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
            <img :src="episode?.image_url ?? 'https://dummyimage.com/40x40'" class="h-40 flex-none rounded-lg" alt="" />
            <div class="flex flex-col justify-center px-8">
              <strong class="text-13 leading-18 font-semibold line-clamp-1">{{ episode?.title }}</strong>
              <span class="text-13 leading-18">{{ episode?.show.title }}</span>
            </div>
          </div>
          <div class="flex-none pr-5 flex items-center gap-x-10">
            <button type="button" @click="togglePlayPause">
              <FontAwesomeIcon :icon="['fas', isPlaying ? 'pause' : 'play']" class="text-20" :class="{ 'text-pink-400': isPlaying }" fixed-width />
            </button>
            <button type="button" @click="toggleEpisodesList()">
              <FontAwesomeIcon :icon="['far', 'list']" class="text-20" fixed-width />
            </button>
          </div>
        </div>
        <div class="w-full h-3 absolute left-0 right-0 bottom-0 bg-gray-300">
          <div class="h-3 bg-pink-400" :style="'width:' + playedInPercentage + '%'" />
        </div>
      </template>
      <div v-else class="h-40 flex items-center">
        <span class="text-16 font-semibold px-10">Indlæser ...</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { useSpreaker } from '@plugins/spreaker-api';

const props = defineProps({
  episodeId: {
    type: Number,
  }
});

const spreaker = useSpreaker();

/**
 * --------------------------------------------------
 * Emits
 * --------------------------------------------------
 */
const emit = defineEmits([
  'visibility'
]);

/**
 * --------------------------------------------------
 * Refs
 * --------------------------------------------------
 */
const isLoading = ref<boolean>(false);
const isVisible = ref<boolean>(false);
const state = ref<'compact'|'full'|'list'>('compact');

const episode = ref<any>();
const showEpisodes = ref<any[]>([]);

/**
 * --------------------------------------------------
 * Methods
 * --------------------------------------------------
 */
const setVisibility = (value: boolean): void => {
  isVisible.value = value;
  emit('visibility', value);
}

const setState = (value: 'compact'|'full'|'list'): void => {
  state.value = value;
}

const toggleEpisodesList = (): void => {
  state.value !== 'list' ? setState('list') : setState('compact');
}

/**
 * Watchers
 */
watch(() => props.episodeId, async (episodeId: number|undefined) => {
  await loadEpisode(episodeId);
});

/**
 * Watchers
 */
watch(() => episode.value, async (episode: any) => {
  await loadShowEpisodes(episode.show.show_id);
});

/**
 * --------------------------------------------------
 * Episode load
 * --------------------------------------------------
 */
const loadEpisode = async (episodeId: number|undefined) => {
  if (!episodeId) {
    return;
  }

  isLoading.value = true;

  const data = await spreaker.episode(episodeId).finally(() => isLoading.value = false);
  if (!data.response.episode) {
    return;
  }

  episode.value = data.response.episode;

  setVisibility(true);
  setEpisodeAndPlay();
}

const loadShowEpisodes = async (showId: number) => {
  isLoading.value = true;

  const data = await spreaker.showEpisodes(showId).finally(() => isLoading.value = false);
  if (!data.response.items) {
    return;
  }

  showEpisodes.value = data.response.items;
}

/**
 * --------------------------------------------------
 * Player stuff.
 * --------------------------------------------------
 */
const fileUrl = 'https://api.spreaker.com/v2/episodes/53996751/play.mp3';
const player = ref<HTMLAudioElement>(new Audio(fileUrl));

const isPlaying = ref<boolean>(false);
const playingEpisodeId = ref<number>();
const playedInPercentage = ref<number>(0);
const playedInSeconds = ref<number>(0);
const playedTime = ref<string>('00:00:00');
const remainingTimeInSeconds = ref<number>(0);
const remainingTime = ref<string>('00:00:00');

const setEpisodeAndPlay = () => {
  player.value.src = episode.value.playback_url;
  player.value.load();
  play();
}

player.value.addEventListener('loadedmetadata', () => {
  remainingTimeInSeconds.value = player.value.duration - player.value.currentTime;
  remainingTime.value = '-' + convertSecondsToHumanReadable(player.value.duration - player.value.currentTime);
});

player.value.addEventListener('timeupdate', () => {
  // Update played time.
  playedInSeconds.value = player.value.currentTime;
  playedTime.value = convertSecondsToHumanReadable(player.value.currentTime);

  // Update remaining time.
  remainingTimeInSeconds.value = player.value.duration - player.value.currentTime;
  remainingTime.value = '-' + convertSecondsToHumanReadable(player.value.duration - player.value.currentTime);

  // Update percentage pllayed.
  playedInPercentage.value = player.value.currentTime * 100 / player.value.duration;
});

/**
 * Methods
 */
const togglePlayPause = () => {
  !player.value.paused ? pause() : play();
  //isPlaying.value = !player.value.paused;
}

const play = () => {
  player.value.play();
  isPlaying.value = true;
  playingEpisodeId.value = episode.value.episode_id;
}

const pause = () => {
  player.value.pause();
  isPlaying.value = false;
}

/**
 * Human readables
 */
const convertSecondsToHumanReadable = (value: number) => {
  let hours = Math.floor(value / 3600).toFixed(0);
  let minutes = Math.floor(value % 3600 / 60).toFixed(0);
  let seconds = Math.floor(value % 3600 % 60).toFixed(0);
  return leadingZero(hours) + ':' + leadingZero(minutes) + ':' + leadingZero(seconds);
};

const leadingZero = (value: string) => {
  return value.length < 2 ? '0' + value : value;
}
</script>
