<template>
  <div class="border-b border-grya-500 sticky top-0">
    <div class="max-w-3xl mx-auto py-10 px-15 flex items-center justify-between">
      <h1>
        <RouterLink to="/">
          <img src="@/assets/logo.svg" class="h-30" />
        </RouterLink>
      </h1>
      <nav>
        <ul class="flex items-center">
          <li class="px-10 flex items-center">
            <RouterLink to="/">
              <FontAwesomeIcon :icon="['far', 'search']" fixed-width />
            </RouterLink>
          </li>
          <li class="pl-10 flex items-center">
            <Navigation />
          </li>
        </ul>
      </nav>
    </div>
  </div>
  <div class="max-w-3xl mx-auto pt-15 px-15" :class="{ 'pb-76': isPlayerVisible, 'pb-15': !isPlayerVisible }">
    <RouterView @episode="playEpisode" />
  </div>
  <Player :episode-id="playerEpisodeId" @visibility="updatePlayerVisibility" />
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { RouterLink, RouterView } from 'vue-router';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import Navigation from '@/components/layout/Header/Navigation.vue';
import Player from '@/components/Player.vue';

const isPlayerVisible = ref<boolean>(true);
const playerEpisodeId = ref<number|undefined>();

const updatePlayerVisibility = (isVisible: boolean = false) => {
  isPlayerVisible.value = isVisible;
}

const playEpisode = (id: number) => {
  playerEpisodeId.value = id;
}
</script>
