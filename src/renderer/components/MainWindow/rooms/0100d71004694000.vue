<template>
  <div>
    🌍
    {{ advertiseData.world }}
    {{ " " }}
    ({{ advertiseData.version }})
  </div>
</template>

<script>
export default {
  props: {
    advertiseData: Object,
  },
};
</script>
