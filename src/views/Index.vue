<template>
  <div class="px-15 space-y-15 lg:space-y-25">
    <RouterLink :to="{ name: 'article' }" class="inline-block">
      <article class="bg-white p-10 rounded-lg md:p-15 md:rounded-xl">
        <img src="https://imgix.elle.dk/2023-06-02/microsoftteams-image-27.png?ixlib=vue-2.9.1&auto=format&ar=940%3A530&fit=crop&fp-x=0.5&fp-y=0.5&w=940" alt="For 22 år siden slog Lina Rafn et slag for musikbranchen: 'Jeg tabte i Højesteret med en farce af en retssag'" />
        <header class="mt-6">
          <h3 class="text-15 lg:text-18 font-medium text-center line-clamp-2">For 22 år siden slog Lina Rafn et slag for musikbranchen: "Jeg tabte i Højesteret med en farce af en retssag"</h3>
        </header>
      </article>
    </RouterLink>
    <div class="flex items-start justify-between gap-x-20">
      <RouterLink :to="{ name: 'article' }" class="basis-1/2 inline-block">
        <article class="bg-white p-10 rounded-lg md:p-15 md:rounded-xl">
          <img src="https://imgix.viunge.dk/2023-06-06/copy-of-splitscreen-main-2.png?ixlib=vue-2.9.1&auto=format&ar=1%3A1&fit=crop&fp-x=0.52&fp-y=0.23&w=380" alt="Taylor Swift og Matty Healy er fortid" />
          <header class="mt-6">
            <h3 class="text-15 lg:text-18 font-medium text-center line-clamp-2">Taylor Swift og Matty Healy er fortid</h3>
          </header>
        </article>
      </RouterLink>
      <RouterLink :to="{ name: 'article' }" class="basis-1/2 inline-block">
        <article class="bg-white p-10 rounded-lg md:p-15 md:rounded-xl">
          <img src="https://imgix.viunge.dk/2023-05-23/header.png?ixlib=vue-2.9.1&auto=format&ar=1%3A1&fit=crop&fp-x=0.5&fp-y=0.5&w=380" alt="Christopher følte sig tit på dybt vand i Netflix-film" />
          <header class="mt-6">
            <h3 class="text-15 lg:text-18 font-medium text-center line-clamp-2">Christopher følte sig tit på dybt vand i Netflix-film</h3>
          </header>
        </article>
      </RouterLink>
    </div>
    <section class="p-10 rounded-lg md:p-15 md:rounded-xl bg-white">
      <header>
        <h2 class="text-16 font-semibold text-pink-400">Vores podcastserier</h2>
      </header>
      <div class="flex items-center gap-x-15 overflow-x-auto pt-8 pb-15">
        <template v-if="shows">
          <RouterLink :to="{ name: 'podcast-show', params: { showId: show.id }}" class="max-w-[125px] md:max-w-[200px] shrink-0 flex flex-col" v-for="show in shows">
            <section>
              <img :src="show.image.original" class="w-[120px] md:w-[200px] rounded-xl" :alt="show.title" />
              <header class="mt-5 lg:mt-8 flex flex-col">
                <h3 class="text-13 md:text-15 font-medium line-clamp-1">{{ show.title }}</h3>
                <span class="text-12 md:text-14 text-gray-500">{{ show.episodes_count || 0 }} episoder</span>
              </header>
            </section>
          </RouterLink>
        </template>
      </div>
    </section>
    <RouterLink :to="{ name: 'article' }" class="inline-block">
      <article class="bg-white p-10 rounded-lg md:p-15 md:rounded-xl">
        <img src="https://dk-femina-backend.imgix.net/2023-06-06/MEGA752967_001.jpg?auto=format,compress&fit=crop&ar=940:530&fp-x=0.44&fp-y=0.28&w=940" alt="Lily Collins er tilbage i København. Og man skulle tro, hun var fra Jylland?" />
        <header class="mt-6">
          <h3 class="text-15 lg:text-18 font-medium text-center">Lily Collins er tilbage i København. Og man skulle tro, hun var fra Jylland?</h3>
        </header>
      </article>
    </RouterLink>
    <div class="flex items-start justify-between gap-x-20">
      <RouterLink :to="{ name: 'article' }" class="basis-1/2 inline-block">
        <article class="bg-white p-10 rounded-lg md:p-15 md:rounded-xl">
          <img src="https://imgix.viunge.dk/2023-06-02/20230520-102324-l-1920x1279we.jpg?ixlib=vue-2.9.1&auto=format&ar=1%3A1&fit=crop&fp-x=0.5&fp-y=0.5&w=380" alt="Dua Lipa viser sig første gang offentligt med sin nye kæreste i Cannes – men hvem er han?" />
          <header class="mt-6">
            <h3 class="text-15 lg:text-18 font-medium text-center line-clamp-2">Dua Lipa viser sig første gang offentligt med sin nye kæreste i Cannes – men hvem er han?</h3>
          </header>
        </article>
      </RouterLink>
      <RouterLink :to="{ name: 'article' }" class="basis-1/2 inline-block">
        <article class="bg-white p-10 rounded-lg md:p-15 md:rounded-xl">
          <img src="https://imgix.viunge.dk/2023-06-02/22281812348880-1920x2880we.jpg?ixlib=vue-2.9.1&auto=format&ar=1%3A1&fit=crop&fp-x=0.56&fp-y=0.13&w=380" alt="Christopher følte sig tit på dybt vand i Netflix-film" />
          <header class="mt-6">
            <h3 class="text-15 lg:text-18 font-medium text-center line-clamp-2">Kylie Jenner og Timothée Chalamet spottet sammen for første gang</h3>
          </header>
        </article>
      </RouterLink>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onBeforeMount, ref, type Ref } from 'vue';
import { RouterLink } from 'vue-router';
import { type Show, usePodcastApi } from '@plugins/podcast-player';
import { getPodcastShowIds } from '@/helpers/podcasts';

/**
 * ------------------------------------------
 * Composables
 * ------------------------------------------
 */
const podcastApi = usePodcastApi();

/**
 * ------------------------------------------------------
 * Refs
 * ------------------------------------------------------
 */
const shows: Ref<ShowWithEpisodeCount[]> = ref<ShowWithEpisodeCount[]>([]);

/**
 * ------------------------------------------------------
 * Lifecycle
 * ------------------------------------------------------
 */
onBeforeMount(async (): Promise<void> => {
  shows.value = await Promise.all(getPodcastShowIds().map(async (showId: number) => {
    // Get show by ID.
    let show = await podcastApi.show(showId) as ShowWithEpisodeCount;

    // Get all episodes in show.
    const episodes = await podcastApi.showEpisodes(show.id);

    // Add episodes count to show object.
    show.episodes_count = episodes.items.length || 0;

    return show;
  }));
});

type ShowWithEpisodeCount = Show & {
  episodes_count?: number
};
</script>
