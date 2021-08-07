<template>
  <div>
    <img
      v-if="advertiseData.code"
      :src="require(`/public/icons/lock.png`)"
      class="icon"
      alt="🔒"
    />
    HR{{ advertiseData.rank }}
  </div>
</template>

<script>
export default {
  props: {
    advertiseData: Object,
  },
};
</script>
