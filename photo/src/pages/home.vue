<script lang='ts' setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router'
import { throttle } from 'lodash-es';
import ImagePreview from '../components/ImagePreview.vue'
import LoadingDot from '../components/LoadingDot.vue'
import { getPhotoList, getTopPhoto } from '../apis.ts/photos';
import { ITableDataItem } from '../types';

const router = useRouter()

const go2Add = () => {
    router.push('/add')
}

const imageUrl = ref('')
const showPreview = ref(false)

const previewImage = (url: string) => {
    imageUrl.value = url
    showPreview.value = true
}

// const rowHeight = ref(Math.ceil((window.innerHeight - 20 * 3) / 4))

// const handleResize = () => {
//     rowHeight.value = Math.ceil((window.innerHeight - 20 * 3) / 4)
// }

const photoList = ref<ITableDataItem[]>([])

const urlList = ref(photoList.value.length > 0 ? photoList.value.map(photo => photo.photoSrc) : [])

const current = ref<number>(1)
const count = ref<number>(0)

const loading = ref<boolean>(false)

const getData = async () => {
    loading.value = true
    let res
    if (current.value === 1) {
        photoList.value = []
        const topRes = await getTopPhoto()
        res = await getPhotoList(19, current.value)
        const topRecords = topRes.data.data.records
        if (topRecords) {
            photoList.value.push(topRecords)
        }
    } else {
        res = await getPhotoList(20, current.value)
    }
    photoList.value = [...photoList.value, ...res.data.data.records]
    count.value = res.data.data.count
    if (photoList.value.length > 0) {
        urlList.value = photoList.value.map(photo => photo?.photoSrc)
    }
    loading.value = false
}

const imageLoad = (e: Event, src: string) => {
    // @ts-ignore
    e.target.src = src
}

watch(() => current.value, async () => {
    if ((current.value - 1) * 20 > count.value) {
        return
    }
    await getData()
})


const handleScroll = () => {
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;

    if (scrollTop + clientHeight >= scrollHeight) {
        // 滚动到底部，加载更多图片
        current.value++
    } else if (scrollTop <= 0) {
        // 滚动到顶部，刷新页面
        current.value = 1
    }
}

onMounted(async () => {
    await getData()
    window.addEventListener('scroll', throttle(handleScroll, 500))
    // window.addEventListener('resize', throttle(handleResize, 500));
})

onBeforeUnmount(() => {
    window.removeEventListener('scroll', handleScroll);
    // window.removeEventListener('resize', handleResize);
})
</script>

<template>
    <div v-if="photoList.length > 0" class="photo">
        <div v-for="photo in photoList" :key="photo?.photoOrder" class="photo-item">
            <div v-if="photo?.isTop === 1" class="photo-item-top">置顶</div>
            <img src="../../public/loadingImg.png" class="photo-item-image" @click="previewImage(photo.photoSrc)"
                @load="(e) => imageLoad(e, photo.photoSrc)">
        </div>
        <LoadingDot :show="loading" />
    </div>
    <div v-else class="no-photos">暂时没有图片~~</div>
    <div class="upload-button" @click="go2Add">上传</div>
    <ImagePreview v-model:show="showPreview" :src="imageUrl" :url-list="urlList" />
</template>

<style lang='scss' scoped>
.no-photos {
    width: 70%;
    display: flex;
    justify-content: center;
    margin-top: 2rem;
}

.photo {
    width: 70%;
    display: grid;
    height: 100vh;
    overflow-y: scroll;
    grid-template-columns: repeat(5, 1fr);
    grid-auto-rows: auto;
    grid-gap: 1.25rem;
    margin-top: 2rem;
    padding: 2rem;

    &-item {
        position: relative;
        background-color: rgba(198, 194, 194, 0.323);
        padding: 2rem;
        border-radius: 2rem;

        &-top {
            position: absolute;
            top: 0;
            left: 0;
            max-width: 80%;
            background-color: rgba(225, 11, 11, 0.775);
            color: #fff;
            padding: 0.2rem 1rem;
            border-radius: 2rem 2rem 2rem 0;
            z-index: 99;
        }

        &-image {
            position: relative;
            width: 100%;
            height: 100%;
            object-fit: cover;
            cursor: pointer;

            &:hover {
                transform: scale(1.1);
                transition: all 200ms linear;
            }
        }
    }
}

.upload-button {
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    bottom: 10rem;
    width: 10rem;
    height: 4rem;
    background-color: rgb(127, 225, 255);
    border-radius: 1rem;
    font-weight: 400;
    font-size: larger;
    letter-spacing: 1rem;
    cursor: pointer;
}


@media screen and (max-width: 2680px) {
    .photo {
        width: 100%;
        grid-template-columns: repeat(4, 1fr);
    }
}

@media screen and (max-width: 1920px) {
    .photo {
        width: 100%;
        grid-template-columns: repeat(3, 1fr);
    }
}

@media screen and (max-width: 1280px) {
    .photo {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media screen and (max-width: 768px) {
    .photo {
        grid-template-columns: repeat(1, 1fr);
    }
}
</style>