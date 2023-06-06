<template>
  <nav class="hidden md:block">
    <ul class="flex items-center space-x-30">
      <li class="text-15 leading-15">
        <RouterLink to="/" class="hover:text-pink-400">Forsiden</RouterLink>
      </li>
      <li class="text-15 leading-15">
        <RouterLink to="/article" class="hover:text-pink-400">Artikel</RouterLink>
      </li>
      <li class="text-15 leading-15">
        <RouterLink to="/podcasts" class="hover:text-pink-400">Podcasts</RouterLink>
      </li>
      <li class="text-15 leading-15">
        <RouterLink to="/hackathon" class="hover:text-pink-400">Hackathon</RouterLink>
      </li>
    </ul>
  </nav>
  <button type="button" title="Menu" @click="toggle" class="md:hidden">
    <FontAwesomeIcon :icon="['far', isOpen ? 'xmark' : 'bars']" fixed-width />
  </button>
  <teleport to="body">
    <div class="w-screen h-screen z-30 backdrop-filter backdrop-blur-sm fixed top-[51px] inset-x md:hidden" v-if="isOpen"></div>
    <nav class="w-[80%] h-screen mt-[51px] flex flex-col fixed top-0 inset-y-0 z-40 transition-right duration-150 ease-linear shadow bg-stone-800 overflow-y-auto md:hidden" :class="{ '-right-full': !isOpen, 'right-0': isOpen }">
      <header class="sr-only">
        <h3>Mobile navigation</h3>
      </header>
      <div class="bg-white">
        <ul class="divide-y-2">
          <li>
            <RouterLink to="/" class="p-20 flex items-center justify-between" @click="toggle">
              <span>Forsiden</span>
              <FontAwesomeIcon :icon="['far', 'chevron-right']" class="text-16" />
            </RouterLink>
          </li>
          <li>
            <RouterLink to="/article" class="p-20 flex items-center justify-between" @click="toggle">
              <span>Artikel</span>
              <FontAwesomeIcon :icon="['far', 'chevron-right']" class="text-16" />
            </RouterLink>
          </li>
          <li>
            <RouterLink to="/podcasts" class="p-20 flex items-center justify-between" @click="toggle">
              <span>Podcasts</span>
              <FontAwesomeIcon :icon="['far', 'chevron-right']" class="text-16" />
            </RouterLink>
          </li>
          <li>
            <RouterLink to="/podcasts" class="p-20 flex items-center justify-between" @click="toggle">
              <span>Hackathon</span>
              <FontAwesomeIcon :icon="['far', 'chevron-right']" class="text-16" />
            </RouterLink>
          </li>
        </ul>
      </div>
    </nav>
  </teleport>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { RouterLink } from 'vue-router';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

defineProps({
  data: {
    type: Array,
    //required: true
  }
});

const isOpen = ref<boolean>(false);

const toggle = () => {
  isOpen.value = isOpen.value ? false : true;
}
</script>
