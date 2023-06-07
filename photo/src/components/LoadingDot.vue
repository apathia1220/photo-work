<template>
    <div v-if="show" id="loading" class="loading-container">
        <div class="loading-dots">
            <div class="loading-dot dot1"></div>
            <div class="loading-dot dot2"></div>
            <div class="loading-dot dot3"></div>
        </div>
        <div class="loading-text">加载中...</div>
    </div>
</template>

<script lang='ts' setup>
defineProps<{
    show: boolean
}>()
</script>
<style lang='scss' scoped>
.loading-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;


    .loading-text {
        margin-top: 1rem;
        color: #888;
        animation: hide 1s infinite linear,
    }

    .loading-dots {
        display: flex;
        align-items: center;
    }

    .loading-dot {
        width: 1rem;
        height: 1rem;
        margin: 0 0.5rem;
        background-color: #888;
        border-radius: 50%;
        opacity: 0.3;
    }


    .dot1 {
        animation: jump 1s infinite linear, hide 1s infinite linear;
    }

    .dot2 {
        animation: jump 1s infinite linear 0.2s, hide 1s infinite linear 0.2s;
    }

    .dot3 {
        animation: jump 1s infinite linear 0.4s, hide 1s infinite linear 0.4s;
    }

}

@keyframes hide {
    0% {
        opacity: 0.3;
    }

    50% {
        opacity: 1;
    }

    100% {
        opacity: 0.3;
    }
}

@keyframes jump {
    0% {
        transform: translateY(0);
    }

    50% {
        transform: translateY(-10px);
    }

    100% {
        transform: translateY(0);
    }
}
</style>