<script lang='ts' setup>
import { ref } from 'vue';
import uploadIcon from '../assets/upload.svg'
import Confirm from '../components/Confirm.vue'
import { useRouter } from 'vue-router'
import { uploadPhotos } from '../apis.ts/photos'
import Loading from '../components/Loading.vue'

const router = useRouter()

const inputEl = ref<HTMLInputElement | null>(null)

const selectFile = () => {
    inputEl.value?.click()
}

const handleFileChange = (e: Event) => {
    //@ts-ignore
    const files = e.target?.files
    if (files.length === 0) return
    for (const file of files) {
        previewFile(file)
    }
}

const previewList = ref<{ file: File, url: string }[]>([])

const previewFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
        previewList.value.push({
            file,
            url: reader.result as string
        })
    };
    reader.readAsDataURL(file);
}

const delPreviewImage = (index: number) => {
    previewList.value.splice(index, 1)
}

const back2Home = () => {
    previewList.value = []
    router.push('/')
}

const continueUpload = () => {
    previewList.value = []
}

const showComfirm = ref(false)

const isUploading = ref(false)

const handleSubmit = async () => {
    try {
        const files = previewList.value.map(item => item.file)
        if (files.length === 0) {
            alert('请选择照片')
            return
        }
        isUploading.value = true
        await uploadPhotos(files)
        isUploading.value = false
        showComfirm.value = true
    } catch (e) {
        isUploading.value = false
        alert('上传失败')
    }
}
</script>

<template>
    <div class="upload">
        <div class="upload-button">
            <div class="upload-button-icon" @click="selectFile"> <img :src="uploadIcon" alt=""> </div>
            <input ref="inputEl" :style="{ display: 'none' }" type="file" multiple accept=".jpg, .png, .gif"
                @change="handleFileChange">
        </div>
        <div class="upload-preview">
            <div v-for="(photo, index) in previewList" class="upload-preview-container">
                <div class="upload-preview-container-close" @click="delPreviewImage(index)">✖️</div>
                <img :src="photo.url" class="upload-preview-container-image">
            </div>
        </div>
        <div class="upload-submit" @click="handleSubmit">
            <div class="upload-submit-button">保存</div>
        </div>
        <div class="upload-submit upload-back" @click="back2Home">
            <div class="upload-submit-button">返回</div>
        </div>
    </div>
    <Loading :show="isUploading" text="图片上传中" />
    <Confirm v-model:show="showComfirm" :success-msg="'继续上传'" :close-msg="'回到展示页'" content="上传成功,是否继续上传照片"
        @close="back2Home" @confirm="continueUpload" />
</template>

<style lang='scss' scoped>
.upload {
    width: 70%;
    margin-top: 2rem;
    padding: 0 2rem;

    &-button {
        width: 100%;

        &-icon {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 6rem;
            border-radius: 0.5rem;
            border: 5px dashed gray;
            opacity: 0.5;
            color: #000;
            padding: 2rem;

            &:hover {
                opacity: 1;
                transition: all 0.2s linear;
            }

            img {
                width: 100%;
                height: 100%;
            }
        }
    }

    &-preview {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        grid-gap: 20px;
        width: 100%;
        margin: 1rem 0;

        &-container {
            position: relative;
            border-radius: 1rem;
            padding: 2rem;
            background-color: rgba(104, 211, 204, 0.317);

            &-close {
                position: absolute;
                right: 0.5rem;
                top: 0.5rem;
                font-size: 1.5rem;
                opacity: 0.7;
                cursor: pointer;

                &:hover {
                    opacity: 1;
                }
            }

            &-image {
                position: relative;
                width: 100%;
                height: 100%;
                object-fit: cover;
                cursor: pointer;
            }
        }
    }

    &-submit {
        display: flex;
        justify-content: center;
        width: 100%;
        height: 6rem;
        background-color: rgba(15, 133, 223, 0.559);
        border-radius: 0.5rem;
        cursor: pointer;
        opacity: 1;

        &-button {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 80%;
            font-size: 3rem;
            color: rgb(26, 23, 23);
        }

        &:hover {
            opacity: 0.7;
        }
    }

    &-back {
        margin-top: 1rem;
        background-color: #d2cdcd;
    }
}

@media screen and (max-width: 1920px) {
    .upload {
        &-preview {
            grid-template-columns: repeat(3, 1fr);
        }
    }
}

@media screen and (max-width: 1280px) {
    .upload {
        width: 100%;

        &-preview {
            grid-template-columns: repeat(2, 1fr);
        }
    }
}

@media screen and (max-width: 768px) {
    .upload {
        &-preview {
            grid-template-columns: repeat(1, 1fr);
        }
    }
}
</style>