<script lang='ts' setup>
import { onMounted, watch, ref, onBeforeUnmount } from 'vue';

const props = defineProps<{
    show: boolean
    src: string
    urlList: string[]
}>()

const emit = defineEmits(['update:show'])

const show = ref(props.show)

const currentIndex = ref(props.urlList.indexOf(props.src) || 0)

const currentSrc = ref(props.src)

const handleKeydown = (e: any) => {
    if (e.key === 'Escape' || e.keyCode === 27) {
        emit('update:show', false)
    }
    if (e.key === 'ArrowLeft') {
        currentIndex.value--
    }
    if (e.key === 'ArrowRight') {
        currentIndex.value++
    }
}

watch(() => props.show, (newVal) => {
    show.value = newVal
})

watch(() => props.src, (newVal) => {
    currentSrc.value = newVal
    currentIndex.value = props.urlList.indexOf(props.src)
})

watch(() => currentIndex.value, () => {
    if (currentIndex.value < 0) {
        currentIndex.value = props.urlList.length - 1
    }
    if (currentIndex.value > props.urlList.length - 1) {
        currentIndex.value = 0
    }
    currentSrc.value = props.urlList[currentIndex.value]
})

onMounted(() => {
    window.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
    window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
    <teleport to='body'>
        <div v-if="show" class="previewContainer">
            <div class="mask" @click="emit('update:show', false)"></div>
            <div class="arrow-right" @click="currentIndex++">{{ '>' }}</div>
            <img class="image" :src="currentSrc">
            <div class="arrow-left" @click="currentIndex--">{{ '<' }}</div>
            </div>
    </teleport>
</template>

<style lang='scss' scoped>
.previewContainer {
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    top: 0;
    width: 100vw;
    height: 100vh;
    z-index: 999;
}

.mask {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: gainsboro;
    opacity: 0.8;
}

.image {
    width: 50%;
    height: auto;
    z-index: 9999;
}

.arrow-left {
    position: absolute;
    top: 45%;
    left: 2%;
    font-size: 2rem;
    cursor: pointer;
}

.arrow-right {
    position: absolute;
    top: 45%;
    right: 2%;
    font-size: 2rem;
    cursor: pointer;
}
</style>