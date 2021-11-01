<template>
  <div></div>
</template>

<script>
export default {
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (Object.keys(to.params).length) {
        vm.$router.replace({
          name: from.name,
          params: to.params
        })
      } else {
        vm.$router.replace({
          path: from.path,
          query: to.query
        })
      }
    })
  }
}
</script>

<style lang="scss" scoped></style>
