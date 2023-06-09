<template>
  <div class="max-w-screen-sm p-12 mx-auto mt-10 bg-gray-50 rounded-md shadow-lg">
    <h1 class="text-2xl">Welcome {{ username }}!</h1>
    <Button class="mt-2" @click="$emit('logout')">Log Out</Button>
  </div>
  <div class="max-w-screen-sm p-12 mx-auto my-12 bg-gray-50 rounded-md shadow-lg">
  <h2 class="text-xl my-8"> Star Wars Person for No Reason</h2>
  <code>
    {{ starWarsPerson ?? 'loading...' }}
  </code>
</div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import Button from './CyButton.vue';

defineProps({
  username: String,
});

defineEmits<{
  (e: 'logout'): void;
}>();

const starWarsPerson = ref(null)

onMounted(() => {
  fetch('https://swapi.dev/api/people/1/')
    .then(function (res) {
      return res.json()
    })
    .then((data) => {
      starWarsPerson.value = data
    })
})

</script>

<style></style>
