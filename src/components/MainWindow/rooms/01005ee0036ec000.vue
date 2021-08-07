<template>
  <div>
    <img
      v-if="advertiseData.bPassword"
      :src="require(`/public/icons/lock.png`)"
      class="icon"
      alt="🔒"
    />
    {{ " " }}
    <img
      v-if="advertiseData.ServerMap"
      :src="require(`/public/icons/ground.png`)"
      class="icon"
      alt="🗺️"
    />
    {{ " " }}
    {{ advertiseData.ServerMap }}
  </div>
</template>

<script>
export default {
  props: {
    advertiseData: Object,
  },
};
</script>
