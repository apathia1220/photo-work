<script lang='ts' setup>
withDefaults(defineProps<
    {
        show: boolean
        text?: string
    }
>(), { text: '加载中...' }
)
</script>

<template>
    <div v-if="show" id="loading" class="loading-container">
        <div class="loading-spinner">
            <div class="loading-circle"></div>
            <div class="loading-text">{{ text }}</div>
        </div>
    </div>
</template>

<style lang='scss' scoped>
.loading-container {
    position: fixed;
    top: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #fff;
    height: 100vh;
    width: 100vw;
    opacity: 0.8;
    z-index: 99999;

    .loading-spinner {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .loading-circle {
        width: 60px;
        height: 60px;
        border: 8px solid rgba(0, 0, 0, 0.1);
        border-top-color: rgba(0, 174, 236, 1);
        border-radius: 50%;
        animation: spin 1s infinite linear;
    }

    .loading-text {
        margin-top: 16px;
        font-size: 18px;
        color: #888;
        animation: fade 1s infinite alternate;
    }
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

@keyframes fade {
    0% {
        opacity: 0.4;
    }

    100% {
        opacity: 1;
    }
}
</style>