<script setup>
import PageContainer from '../../components/PageContainer.vue'
import { artGetChannelService, artDelChannelService } from '../../api/article'
import { onMounted, ref } from 'vue'
import { Delete, Edit } from '@element-plus/icons-vue'
import ChannelEdit from '../../components/ChannelEdit.vue'

const channelList = ref([])
const loading = ref(false)
const dialog = ref()

const getChannelList = async() => {
    loading.value = true
    const res = await artGetChannelService()
    channelList.value = res.data.data
    loading.value = false
}
const handleAddChannel = () => {
    dialog.value.open({})
}
const handleEditChannel = (row) => {
    dialog.value.open(row)
}
const handleSuccess = () => {
    getChannelList()
}
const handleDelChannel = async (row) => {
    await ElMessageBox.confirm('你确定删除该分类信息吗？', '温馨提示', {
        type: 'warning',
        confirmButtonText: '确认',
        cancelButtonText: '取消'
    })
    await artDelChannelService(row.id)
    ElMessage({ type: 'success', message: '删除成功' })
    getChannelList()
}

onMounted(() => getChannelList())
</script>

<template>
    <PageContainer title="文章分类">
        <template #extra>
            <el-button type="primary" @click="handleAddChannel">添加分类</el-button>
        </template>
        <el-table :data="channelList" style="width: 100%" v-loading="loading"
        :cell-style="{ height: '80px' }">
            <el-table-column label="序号" width="100" type="index"></el-table-column>
            <el-table-column label="分类名称" prop="cate_name"></el-table-column>
            <el-table-column label="分类别名" prop="cate_alias"></el-table-column>
            <el-table-column label="操作" width="100">
                <template #default="{ row }">
                    <el-button :icon="Edit"
                        circle
                        plain
                        type="primary"
                        @click="handleEditChannel(row)"
                    ></el-button>
                    <el-button :icon="Delete"
                        circle
                        plain
                        type="danger"
                        @click="handleDelChannel(row)"
                    ></el-button>
                </template>
            </el-table-column>
            <template #empty>
                <el-empty description="没有数据" />
            </template>
        </el-table>
        <ChannelEdit ref="dialog" @success="handleSuccess"></ChannelEdit>
    </PageContainer>
</template>