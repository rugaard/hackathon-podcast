<template>
  <button type="button" title="Menu" @click="toggle">
    <FontAwesomeIcon :icon="['far', isOpen ? 'xmark' : 'bars']" fixed-width />
  </button>
  <teleport to="body">
    <div class="w-screen h-screen z-30 backdrop-filter backdrop-blur-sm fixed top-[51px] inset-x" v-if="isOpen"></div>
    <nav class="w-[80%] h-screen mt-[51px] flex flex-col fixed top-0 inset-y-0 z-40 transition-right duration-150 ease-linear shadow bg-stone-800 overflow-y-auto lg:hidden print:hidden" :class="{ '-right-full': !isOpen, 'right-0': isOpen }">
      <header class="sr-only">
        <h3>Mobile navigation</h3>
      </header>
      <div class="bg-white">
        <ul class="divide-y-2">
          <li>
            <RouterLink to="/other" class="p-20 flex items-center justify-between" @click="toggle">
              <span>Nyheder</span>
              <FontAwesomeIcon :icon="['far', 'chevron-right']" class="text-16" />
            </RouterLink>
          </li>
          <li>
            <RouterLink to="/other" class="p-20 flex items-center justify-between" @click="toggle">
              <span>Kultur</span>
              <FontAwesomeIcon :icon="['far', 'chevron-right']" class="text-16" />
            </RouterLink>
          </li>
          <li>
            <RouterLink to="/other" class="p-20 flex items-center justify-between" @click="toggle">
              <span>Mode</span>
              <FontAwesomeIcon :icon="['far', 'chevron-right']" class="text-16" />
            </RouterLink>
          </li>
          <li>
            <RouterLink to="/other" class="p-20 flex items-center justify-between" @click="toggle">
              <span>Samfund</span>
              <FontAwesomeIcon :icon="['far', 'chevron-right']" class="text-16" />
            </RouterLink>
          </li>
        </ul>
      </div>
      <ul class="mt-5">
        <li class="text-white py-12 px-20 flex items-center justify-between">
          <RouterLink to="/other" @click="toggle">
            <span>Podcast</span>
          </RouterLink>
        </li>
        <li class="text-white py-12 px-20 flex items-center justify-between" @click="toggle">
          <RouterLink to="/other">
            <span>Video</span>
          </RouterLink>
        </li>
      </ul>
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
