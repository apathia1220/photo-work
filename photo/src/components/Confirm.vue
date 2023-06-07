<script lang='ts' setup>
import { onBeforeUnmount, onMounted } from 'vue';

defineProps<{
    show: boolean
    content: string
    successMsg: string
    closeMsg: string
}>()

const emit = defineEmits(['confirm', 'close', 'update:show'])

const handleClose = () => {
    emit('close')
    emit('update:show', false)
}

const handleConfirm = () => {
    emit('confirm')
    emit('update:show', false)
}

const handleKeydown = (e: any) => {
    if (e.key === 'Escape' || e.keyCode === 27) {
        emit('update:show', false)
    }
}

onMounted(() => {
    window.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
    window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
    <teleport to="body">
        <div v-if="show" class="toast">
            <div class="toast-mask" @click="emit('update:show', false)"></div>
            <div class="toast-body">
                <div class="toast-body-content">{{ content }}</div>
                <div class="toast-body-button">
                    <div class="toast-body-button-success" @click="handleConfirm">{{ successMsg }}</div>
                    <div class="toast-body-button-close" @click="handleClose">{{ closeMsg }}</div>
                </div>
            </div>
        </div>
    </teleport>
</template>

<style lang='scss' scoped>
.toast {
    display: flex;
    justify-content: center;
    position: fixed;
    top: 0;
    width: 100vw;
    height: 100vh;
    z-index: 999;
    color: #000;

    .toast-body {
        display: flex;
        align-items: center;
        flex-direction: column;
        width: 30%;
        height: 25%;
        margin-top: 15vh;
        background-color: rgba(255, 255, 255, 1);
        z-index: 9999;
        padding: 5vh 2vw;
        box-sizing: border-box;
        border-radius: 1rem;

        .toast-body-content {
            height: 60%;
            display: flex;
            align-items: center;
            font-size: 2rem;
        }

        .toast-body-button {
            height: 40%;
            width: 100%;
            display: flex;
            justify-content: space-evenly;
            align-items: center;

            div {
                width: 30%;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 1rem 0;
                border-radius: 0.5rem;
                color: rgba(255, 255, 255, 1);
                cursor: pointer;
            }

            div:hover {
                opacity: 0.7;
            }

            .toast-body-button-success {
                background-color: rgba(0, 174, 236, 1);
            }

            .toast-body-button-close {
                background-color: rgba(248, 90, 84, 1);
            }
        }
    }

    .toast-mask {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(241, 242, 243, 0.5);
        opacity: 0.8;
    }
}

@media screen and (max-width: 1920px) {
    .toast {
        .toast-body {
            width: 90%;

            .toast-body-content {
                font-size: 1rem;
            }

            .toast-body-button {
                div {
                    padding: 0.5rem 0;
                }
            }
        }
    }
}

@media screen and (max-width: 1280px) {
    .toast {
        .toast-body {
            width: 60%;
            height: 30%;

            .toast-body-content {
                font-size: 1rem;
            }

            .toast-body-button {
                div {
                    padding: 0.5rem 0;
                }
            }
        }
    }
}

@media screen and (max-width: 768px) {
    .toast {
        .toast-body {
            width: 90%;

            .toast-body-content {
                font-size: 1rem;
            }

            .toast-body-button {
                div {
                    padding: 0.5rem 0;
                }
            }
        }
    }
}

@media screen and (max-width: 768px) {
    .toast {
        .toast-body {

            .toast-body-button {
                font-size: 0.2rem;
            }
        }
    }
}
</style>