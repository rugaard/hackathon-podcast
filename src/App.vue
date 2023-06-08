<template>
  <div class="border-b sticky top-0 z-50 bg-white shadow-sm">
    <div class="max-w-3xl mx-auto py-10 px-15 flex items-center justify-between">
      <h1>
        <RouterLink to="/" class="flex items-center gap-x-10" @click="isOpen = false">
          <img src="@/assets/logo.svg" class="h-30" />
          <span class="text-20 font-semibold uppercase">Podcast</span>
        </RouterLink>
      </h1>
      <nav class="hidden md:block">
        <ul class="flex items-center space-x-30">
          <li class="text-15 leading-15">
            <RouterLink to="/" class="hover:text-pink-400" v-slot="{ isActive }">
              <span :class="{ 'text-pink-400 font-medium': isActive }">Forsiden</span>
            </RouterLink>
          </li>
          <li class="text-15 leading-15">
            <RouterLink to="/article" class="hover:text-pink-400" v-slot="{ isActive }">
              <span :class="{ 'text-pink-400 font-medium': isActive }">Artikel</span>
            </RouterLink>
          </li>
          <li class="text-15 leading-15">
            <RouterLink to="/podcasts" class="hover:text-pink-400" v-slot="{ isActive }">
              <span :class="{ 'text-pink-400 font-medium': isActive || currentRoute.name === 'podcast-show' }">Podcasts</span>
            </RouterLink>
          </li>
          <li class="text-15 leading-15">
            <RouterLink to="/hackathon" class="hover:text-pink-400" v-slot="{ isActive }">
              <span :class="{ 'text-pink-400 font-medium': isActive }">Hackathon</span>
            </RouterLink>
          </li>
        </ul>
      </nav>
      <button type="button" title="Menu" @click="toggle" class="md:hidden">
        <FontAwesomeIcon :icon="['far', isOpen ? 'xmark' : 'bars']" fixed-width />
      </button>
      <teleport to="body">
        <div class="w-screen h-screen z-30 bg-white/70 backdrop-filter backdrop-blur-md fixed top-[51px] inset-x md:hidden" v-if="isOpen"></div>
        <nav class="w-[80%] h-screen mt-[51px] flex flex-col fixed top-0 inset-y-0 z-40 transition-right duration-150 ease-linear shadow bg-white overflow-y-auto md:hidden" :class="{ '-right-full': !isOpen, 'right-0': isOpen }">
          <header class="sr-only">
            <h3>Mobile navigation</h3>
          </header>
          <ul class="border-b-2 divide-y-2">
            <li>
              <RouterLink to="/" class="p-20 flex items-center justify-between" @click="toggle" v-slot="{ isActive }">
                <span :class="{ 'text-pink-400 font-medium': isActive }">Forsiden</span>
                <FontAwesomeIcon :icon="['far', 'chevron-right']" class="text-16" />
              </RouterLink>
            </li>
            <li>
              <RouterLink to="/article" class="p-20 flex items-center justify-between" @click="toggle" v-slot="{ isActive }">
                <span :class="{ 'text-pink-400 font-medium': isActive }">Artikel</span>
                <FontAwesomeIcon :icon="['far', 'chevron-right']" class="text-16" />
              </RouterLink>
            </li>
            <li>
              <RouterLink to="/podcasts" class="p-20 flex items-center justify-between" @click="toggle" v-slot="{ isActive }">
                <span :class="{ 'text-pink-400 font-medium': isActive || currentRoute.name === 'podcast-show' }">Podcasts</span>
                <FontAwesomeIcon :icon="['far', 'chevron-right']" class="text-16" />
              </RouterLink>
            </li>
            <li>
              <RouterLink to="/hackathon" class="p-20 flex items-center justify-between" @click="toggle" v-slot="{ isActive }">
                <span :class="{ 'text-pink-400 font-medium': isActive }">Hackathon</span>
                <FontAwesomeIcon :icon="['far', 'chevron-right']" class="text-16" />
              </RouterLink>
            </li>
          </ul>
        </nav>
      </teleport>
    </div>
  </div>
  <div class="max-w-3xl mx-auto pt-15" :class="{ 'pb-[76px]': isVisible, 'pb-15': !isVisible }">
    <RouterView />
  </div>
  <Player />
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import { RouterLink, RouterView, useRoute } from 'vue-router';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { usePodcastPlayer } from '@/plugins/podcast-player';

import Player from '@/components/Player.vue';

/**
 * ------------------------------------------------------
 * Composable
 * ------------------------------------------------------
 */
const currentRoute = useRoute();
const podcastPlayer = usePodcastPlayer();

/**
 * ------------------------------------------------------
 * Refs
 * ------------------------------------------------------
 */
const isOpen = ref<boolean>(false);

/**
 * ------------------------------------------------------
 * Methods
 * ------------------------------------------------------
 */
const toggle = () => {
  isOpen.value = isOpen.value ? false : true;
}

/**
 * ------------------------------------------
 * Computed
 * ------------------------------------------
 */
const isVisible = computed<boolean>((): boolean => {
  return podcastPlayer.episode.value !== null;
});
</script>
