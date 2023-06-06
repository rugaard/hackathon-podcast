<template>
  <section>
    <div class="flex flex-col md:flex-row gap-x-20 px-20 md:px-0">
      <img :src="show?.image.original" class="w-full md:h-250 rounded-xl" :alt="show?.title" />
      <header class="flex flex-col mt-10 md:mt-0">
        <h2 class="text-24 font-semibold">{{ show?.title }}</h2>
        <p class="text-14 mt-10" v-html="show?.description.html" />
      </header>
    </div>
    <div class="pt-30 pb-10">
      <h5 class="text-17 lg:text-18 font-semibold pb-5 px-10">{{ showEpisodes?.length || 0 }} episoder</h5>
      <div class="border-y divide-y">
        <div class="p-10 flex items-center justify-between gap-20 odd:bg-gray-50" :class="[podcastPlayer.isPlaying.value && podcastPlayer.isEpisodePlaying(item.id!) ? 'bg-white/90' : 'odd:bg-gray-100/40']" v-for="item in showEpisodes">
          <div class="pr-10 py-1 flex flex-col justify-center gap-y-6" :class="{ 'text-pink-400': podcastPlayer.isPlaying.value && podcastPlayer.isEpisodePlaying(item.id!) }">
            <span class="text-14 leading-20 font-semibold line-clamp-2">{{ item.title }}</span>
            <span class="text-13 leading-14">{{ (new Date(item.published_at!)).toLocaleDateString() }} | {{ (item.duration! / 60000).toFixed(0) }} min.</span>
          </div>
          <div class="flex-none">
            <template v-if="podcastPlayer.isEpisodePlaying(item.id!)">
              <button type="button" @click="podcastPlayer.togglePlayPause" v-if="podcastPlayer.isPlayable.value">
                <FontAwesomeIcon :icon="['fas', podcastPlayer.isPlaying.value ? 'pause-circle': 'play-circle']" class="text-30" :class="{ 'text-pink-400': podcastPlayer.isPlaying.value }" fixed-width />
              </button>
              <FontAwesomeIcon v-else :icon="['fad', 'spinner-third']" class="text-30" fixed-width spin />
            </template>
            <button type="button" @click="podcastPlayer.playEpisode(item.id!)" v-else>
              <FontAwesomeIcon :icon="['fas', 'play-circle']" class="text-30" fixed-width />
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { onBeforeMount, ref, type Ref } from 'vue';
import { useRoute } from 'vue-router';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { type Episode, type Show, usePodcastApi, usePodcastPlayer } from '@plugins/podcast-player';


/**
 * ------------------------------------------------------
 * Composable
 * ------------------------------------------------------
 */
const route = useRoute();
const podcastApi = usePodcastApi();
const podcastPlayer = usePodcastPlayer();

/**
 * ------------------------------------------------------
 * Refs
 * ------------------------------------------------------
 */
const show: Ref<Show|undefined> = ref<Show>();
const showEpisodes: Ref<Partial<Episode>[]|undefined> = ref<Partial<Episode>[]>();

/**
 * ------------------------------------------------------
 * Lifecycle
 * ------------------------------------------------------
 */
onBeforeMount(async (): Promise<void> => {
  show.value = await podcastApi.show(parseInt(route.params.showId as string));
  showEpisodes.value = (await podcastApi.showEpisodes(show.value.id)).items;
});
</script>
