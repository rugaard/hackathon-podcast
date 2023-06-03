<template>
  <CompactPlayer />
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import useLocalStorage from '@composables/localStorage';

import CompactPlayer from '@components/player/Compact.vue';
</script>
