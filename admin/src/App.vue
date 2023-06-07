<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import Sortable from 'sortablejs'
import { deletePhotos, getPhotoList, updatePhotoOrder, updatePhotoStatus, updateTopPhoto } from './apis/photo';
import { IPhotoOrderItem, ITableDataItem } from './types';
// @ts-ignore
import { ElMessage } from 'element-plus'

const tableData = ref<ITableDataItem[]>([])

const sortTable = ref(null)

const urlList = computed(() => tableData.value.map(item => item.photoSrc))

const initializeSortable = () => {
  const elTable = document.querySelector('.el-table__body-wrapper tbody') as HTMLElement
  Sortable.create(elTable, {
    animation: 150,
    onUpdate: async (evt) => {
      const { newIndex, oldIndex } = evt;
      if (newIndex === undefined || oldIndex === undefined) return
      const oldOrder = tableData.value.map(item => item.photoOrder)

      const movedItem = tableData.value.splice(oldIndex, 1)[0];
      tableData.value.splice(newIndex, 0, movedItem);
      tableData.value = tableData.value.map((item, index) => ({
        ...item,
        photoOrder: oldOrder[index]
      }))
      const data = tableData.value.map((item) => ({
        id: item.id,
        photoOrder: item.photoOrder
      }))
      await updateOrder(data)
    }
  });
}

const count = ref<number>(0)

const current = ref(1)

const getData = async () => {
  const res = await getPhotoList(10, current.value)
  tableData.value = res.data.data.records
  count.value = res.data.data.count
}

const updatePhoto = async (id: number, status: number) => {
  await updatePhotoStatus(id, status)
  ElMessage({
    message: '更新成功',
    type: 'success'
  })
  await getData()
}

const topPhoto = async (id: number) => {
  await updateTopPhoto(id)
  ElMessage({
    message: '置顶成功',
    type: 'success'
  })
  await getData()
}

const updateOrder = async (photoItem: IPhotoOrderItem[]) => {
  await updatePhotoOrder(photoItem)
  ElMessage({
    message: '更新成功',
    type: 'success'
  })
  await getData()
}

const delPhoto = async (id: number) => {
  await deletePhotos([id])
  ElMessage({
    message: '删除成功',
    type: 'success'
  })
  await getData()
}

watch(() => current.value, async () => {
  await getData()
})

onMounted(async () => {
  initializeSortable()
  await getData()
})
</script>

<template>
  <div class="container">
    <div class="table">
      <el-table ref="sortTable" :data="tableData" row-key="id"
        :default-sort="{ prop: 'photoOrder', order: 'descending' }">
        <el-table-column type="index" width="50" />
        <el-table-column label="图片" align="center">
          <template #default="scope">
            <el-image :src="scope.row.photoSrc" class="table-photo" :preview-src-list="urlList" :z-index="99999"
              preview-teleported>
              <template #viewer>
                <div class="table-photo-status">
                  <el-button v-if="scope.row.status === 0" type="primary" size="large">通过</el-button>
                  <el-button v-else type="danger" size="large">禁用</el-button>
                </div>
              </template>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column label="置顶" align="center">
          <template #default="scope">
            <el-tag v-if="scope.row.isTop === 1" type="danger" size="large">置顶</el-tag>
            <div v-else>-</div>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="状态" align="center">
          <template #default="scope">
            <el-tag v-if="scope.row.status === 1" @click="updatePhoto(scope.row.id, 1)" type="success"
              size="large">通过</el-tag>
            <el-tag v-else @click="updatePhoto(scope.row.id, 0)" type="danger" size="large">禁用</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template #default="scope">
            <el-button v-if="scope.row.status === 0" type="primary" @click="updatePhoto(scope.row.id, 1)">通过</el-button>
            <el-button v-else @click="updatePhoto(scope.row.id, 0)" type="danger">禁用</el-button>
            <el-button v-if="scope.row.isTop === 0" type="warning" @click="topPhoto(scope.row.id)">置顶</el-button>
            <el-button type="danger" @click="delPhoto(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-model:current-page="current" class="table-pagination" background layout="prev, pager, next"
        :page-size="10" :total="count" @current-change="" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.container {
  width: 100vw;
  display: flex;
  justify-content: center;
  background-color: azure;

  .table {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1rem;
    height: 100vh;
    width: 60vw;

    &-photo {
      width: 5rem;

      &-status {
        width: 100%;
        position: fixed;
        bottom: 6rem;
        display: flex;
        justify-content: center;
      }
    }

    &-pagination {
      margin-top: 2rem;
    }
  }
}


@media screen and (max-width: 1920px) {
  .container {
    .table {
      width: 100%;
    }
  }
}
</style>
