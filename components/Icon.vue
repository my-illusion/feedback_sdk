<template>
    <i :class="`iconfont ${className}`" :style="{ fontSize: `${size || 14}px` }"></i>
</template>
<script>
export default {
    props:['className', 'size']
}
</script>