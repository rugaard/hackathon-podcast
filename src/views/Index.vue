<template>
  <div class="home">
    <div class="flex items-center justify-between bg-pink-100 rounded-lg" v-if="episode">
      <div class="w-70 h-70 rounded-lg flex-none flex items-center justify-center relative overflow-hidden">
        <div class="rounded-lg relative" style="filter:blur(3px); -webkit-filter:blur(3px)">
          <img :src="episode?.image_url ?? 'https://dummyimage.com/40x40'" class="h-[70px]" alt="" />
        </div>
        <img :src="episode?.image_url ?? 'https://dummyimage.com/40x40'" class="h-[60px] absolute z-1" alt="" />
      </div>
      <div class="flex flex-col justify-center px-8">
        <strong class="text-13 leading-18 font-semibold line-clamp-1">{{ episode?.title }}</strong>
        <span class="text-13 leading-18 inline-block mt-4">{{ episode?.show.title }} | {{ (episode?.duration / 60000).toFixed(0) }} min.</span>
      </div>
      <div class="flex-none flex items-center pr-20">
        <button type="button" v-if="playingEpisodeId === episode.episode_id">
          <FontAwesomeIcon :icon="['fas', isPlaying ? 'pause-circle': 'play-circle']" class="text-30" />
        </button>
        <button type="button" @click="playEpisode(52361215)" v-else>
          <FontAwesomeIcon :icon="['fas', 'play-circle']" class="text-30" />
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onBeforeMount, ref } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { useSpreaker } from '@plugins/spreaker-api';

const emit = defineEmits(['episode']);

const spreaker = useSpreaker();
const episode = ref<any>();
const playingEpisodeId = ref<number>();
const isPlaying = ref<boolean>(false);

onBeforeMount(async () => {
  const data = await spreaker.episode(52361215);
  episode.value = data.response.episode;
});

const playEpisode = (id: number) => {
  emit('episode', id);
}
</script>
