<script setup>
import PageContainer from '../../components/PageContainer.vue'
import { ref } from 'vue'
import { Plus, Upload } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores'
import { userUpdateAvatarService } from '../../api/user'

const userStore = useUserStore()
const imgUrl = ref(userStore.user.user_pic)
const uploadRef = ref()

const onUploadFile = (file) => {
    const reader = new FileReader()
    reader.readAsDataURL(file.raw)
    reader.onload = () => {
        imgUrl.value = reader.result
    }
}

const onUpdateAvatar = async() => {
    await userUpdateAvatarService(imgUrl.value)
    await userStore.getUser()
    ElMessage.success('更换头像成功')
}
</script>

<template>
    <PageContainer title="更换头像">
        <el-row>
            <el-col :span="12">
                <el-upload ref="uploadRef" class="avatar-uploader"
                :auto-upload="false" :show-file-list="false" 
                :on-change="onUploadFile">
                    <img :src="imgUrl" class="avatar" v-if="imgUrl" />
                    <img src="@/assets/avatar.jpg" width="278px" class="avatar" v-else />
                </el-upload>
                <br />
                <el-button type="primary" :icon="Plus" size="large" 
                @click="uploadRef.$el.querySelector('input').click()">选择图片</el-button>
                <el-button type="success" :icon="Upload" size="large"
                @click="onUpdateAvatar">上传头像</el-button>
            </el-col>
        </el-row>
    </PageContainer>
</template>

<style lang="scss" scoped>
.avatar-uploader {
    :deep() {
        .avatar {
            width: 278px;
            height: 278px;
            display: block;
        }

        .el-upload {
            border: 1px dashed var(--el-border-color);
            border-radius: 6px;
            cursor: pointer;
            position: relative;
            overflow: hidden;
            transition: var(--el-transition-duration-fast);
        }

        .el-upload:hover {
            border-color: var(--el-color-primary);
        }

        .el-icon.avatar-uploader-icon {
            font-size: 28px;
            color: #8c939d;
            width: 278px;
            height: 278px;
            text-align: center;
        }
    }
}
</style>