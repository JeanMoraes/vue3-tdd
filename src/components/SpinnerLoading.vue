<template>
     <p
     class="spinner-border"
     :class="{'spinner-border-sm' : size === 'small'}"
     role="status"></p>
</template>

<script>
export default {
     props: {
          size: {
               type: String,
               default: 'small'
          }
     }
}
</script>