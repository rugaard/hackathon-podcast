<template>
  <section class="pb-10">
    <header class="pb-10 border-b-2">
      <h2 class="text-20 md:text-28 font-semibold text-center">Podcasts</h2>
    </header>
    <div class="grid grid-cols-1 md:grid-cols-3 md:gap-25 md:mt-25 border-b-2 md:border-b-0 divide-y-2 md:divide-y-0">
      <template v-for="show in shows">
        <RouterLink :to="{ name: 'podcast-show', params: { showId: show.id }}" class="px-25 odd:bg-gray-50 md:odd:bg-transparent">
          <article class="col-span-1 py-20 md:py-0">
            <img :src="show.image.original" class="w-full mx-auto rounded-xl" :alt="show.title" />
            <header class="mt-10">
              <h3 class="font-medium">{{ show.title }}</h3>
            </header>
            <p class="text-14 mt-5 line-clamp-2" v-html="show.description.html" />
          </article>
        </RouterLink>
    </template>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { onBeforeMount, ref, type Ref } from 'vue';
import { RouterLink } from 'vue-router';
import { usePodcastApi, type Show } from '@plugins/podcast-player';
import { getPodcastShowIds } from '@/helpers/podcasts';

/**
 * ------------------------------------------------------
 * Composable
 * ------------------------------------------------------
 */
const podcastApi = usePodcastApi();

/**
 * ------------------------------------------------------
 * Refs
 * ------------------------------------------------------
 */
const shows: Ref<Show[]> = ref<Show[]>([]);

/**
 * ------------------------------------------------------
 * Lifecycle
 * ------------------------------------------------------
 */
onBeforeMount(async (): Promise<void> => {
  shows.value = await Promise.all(getPodcastShowIds().map(async (showId: number) => {
    return await podcastApi.show(showId);
  }));
});
</script>
