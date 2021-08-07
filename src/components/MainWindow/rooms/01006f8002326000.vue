<template>
  <div>
    <img
      v-if="advertiseData.code"
      :src="require(`/public/icons/island-code.png`)"
      class="icon"
      alt="🏝️🔒"
    />
    <img
      v-else
      :src="require(`/public/icons/island.png`)"
      class="icon"
      alt="🏝️"
    />
    {{ " " }}
    <strong>{{ advertiseData.island }}</strong>
  </div>
</template>

<script>
export default {
  props: {
    advertiseData: Object,
  },
};
</script>
