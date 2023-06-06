<template>
  <article class="px-15">
    <header>
      <img src="https://imgix.elle.dk/2023-06-02/microsoftteams-image-27.png?ixlib=vue-2.9.1&auto=format&ar=940%3A530&fit=crop&fp-x=0.5&fp-y=0.5&w=940" class="w-full mb-15 rounded-lg" alt="" />
      <h1 class="text-17 font-medium italic text-center">For 22 år siden slog Lina Rafn et slag for musikbranchen: "Jeg tabte i Højesteret med en farce af en retssag"</h1>
    </header>
    <div class="text-14 leading-22 mt-15 space-y-22">
      <p>Da Lina Rafn i 2010 endeligt tabte en skattesag for at have indberettet makeup-produkter og mode som en del af sit arbejde som musiker, skabte det ikke bare overskrifter i diverse medier – det gav også genlyd i underholdningsindustrien.</p>
      <p>Vi skal helt tilbage til 1990’erne, hvor Lina Rafn var danser. Til sit job skulle hun bruge til netstrømper, makeup og hårprodukter, og da det var noget, der skulle bruges til scenen, var sangeren og produceren sikker på, det kunne trækkes i skat.</p>
      <div class="max-w-[375px] mx-auto flex items-center justify-between bg-pink-100 rounded-lg" v-if="episode">
        <div class="flex items-center">
          <div class="w-[70px] h-[70px] rounded-lg flex-none flex items-center justify-center bg-contain bg-center" :style="'background-image: url(\'' + episode.image.original + '\')'">
            <div class="w-full h-full p-8 bg-white/40 backdrop-filter backdrop-blur rounded-lg">
              <img :src="episode.image.original" class="h-[54px]" alt="" />
            </div>
          </div>
          <div class="flex flex-col justify-center px-8">
            <strong class="text-13 leading-18 font-semibold line-clamp-1">{{ episode?.title }}</strong>
            <span class="text-13 leading-18 inline-block mt-4">{{ episode?.show.title }} | {{ (episode?.duration / 60000).toFixed(0) }} min.</span>
          </div>
        </div>
        <div class="flex-none flex items-center pr-20">
          <template v-if="episode && podcastPlayer.isEpisodePlaying(episode.id)">
            <button type="button" @click="podcastPlayer.togglePlayPause" v-if="podcastPlayer.isPlayable.value">
              <FontAwesomeIcon :icon="['fas', podcastPlayer.isPlaying.value ? 'pause-circle': 'play-circle']" class="text-30" :class="{ 'text-pink-400': podcastPlayer.isPlaying.value }" fixed-width />
            </button>
            <FontAwesomeIcon v-else :icon="['fad', 'spinner-third']" class="text-30" fixed-width spin />
          </template>
          <template v-else>
            <button type="button" @click="podcastPlayer.playEpisode(episode?.id)" v-if="episode">
              <FontAwesomeIcon :icon="['fas', 'play-circle']" class="text-30" />
            </button>
            <FontAwesomeIcon v-else :icon="['far', 'xmark']" class="text-30" fixed-width />
          </template>
        </div>
      </div>
      <p>“Det er ikke sådan, at hende jeg dansede for, kom med sminke og hvad ved jeg. Det forventedes, at jeg selv kom med det. Det er jo en del af mit job, det må jeg kunne trække fra. Og det endte altid med, at jeg skulle betale de penge, og det synes jeg simpelthen ikke, kunne være rigtigt,” fortæller Lina Rafn i det nye afsnit af ELLEs podcast 'Klædt På', hvor hun fortæller om, hvordan sagen påvirkede både hende og branchen.</p>
      <p>Da Infernal i 00’erne går fra at være upcoming til at være et kendt navn både hjemme og i udlandet, får Rafn stadig brug for essentielle ting til garderoben og makeuppen for at fuldende sine vilde performances. Men da Skat stadig ikke anerkender tingene som en del af hendes arbejde, tager hun den videre.</p>
      <RouterLink :to="{ name: 'podcast-show', params: { showId: show.id }}"  class="w-[300px] h-[300px] mx-auto rounded-lg bg-contain bg-center relative block" :style="'background-image: url(\'' + show.image.original + '\')'" v-if="show">
        <div class="w-full h-full p-50 bg-white/40 backdrop-filter backdrop-blur rounded-lg">
          <img :src="show.image.original" class="h-[200px]" alt="" />
        </div>
        <div class="py-8 px-15 rounded-full flex items-center gap-x-5 bg-white absolute left-1/2 -translate-x-1/2 bottom-35">
          <FontAwesomeIcon :icon="['fas', 'headphones']" class="text-14" fixed-width />
          <span class="text-12 leading-14 font-medium">Hør podcast</span>
        </div>
      </RouterLink>
      <p>“For skatteåret 2001 siger jeg: “Godt, nu tager jeg den videre. Den kommer først i Skatteankenævnet, så i den ene og det andet indtil den kommer i Landsretten, hvor jeg taber med et brag.”</p>
      <p>Det er her, pressen for alvor opsnapper historien. Men mens Rafn er bange for at blive stemplet som "hende sangeren med stjernenykker, der ikke vil betale sin skat", sker der noget uventet.</p>
      <p>“Sagen begynder at få så meget momentum, at Dansk Artist Forbund siger: “Din sag er vigtig for alle vores medlemmer – Vi vil gerne køre den videre.” Og jeg siger til dem igen og igen, at vi ikke kommer til at vinde,” fortæller Infernal-forsangeren.</p>
    </div>
  </article>
</template>

<script lang="ts" setup>
import { onBeforeMount, ref, type Ref } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { type Episode, type Show, usePodcastApi, usePodcastPlayer } from '@plugins/podcast-player';

/**
 * ------------------------------------------
 * Composables
 * ------------------------------------------
 */
const podcastApi = usePodcastApi();
const podcastPlayer = usePodcastPlayer();

/**
 * ------------------------------------------
 * Refs
 * ------------------------------------------
 */
const show: Ref<Show|undefined> = ref<Show>();
const episode: Ref<Episode|undefined> = ref<Episode>();

/**
 * ------------------------------------------
 * Lifecycle
 * ------------------------------------------
 */
onBeforeMount(async () => {
  show.value = await podcastApi.show(5755252);
  episode.value = await podcastApi.episode(53996751);
})
</script>
