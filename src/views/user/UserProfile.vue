<script setup>
import { ref } from 'vue'
import PageContainer from '../../components/PageContainer.vue'
import { userUpdateInfoService } from '../../api/user'
import { useUserStore } from '../../stores'

const { user: { username, nickname, email, id } } = useUserStore()
const { getUser } = useUserStore()
const formRef = ref(null)
const userInfo = ref({
    username,
    nickname,
    email,
    id
})

// 校验规则
const rules = {
    nickname: [
        { required: true, message: '昵称不能为空', trigger: 'blur' },
        {
            min: 2,
            max: 10,
            message: '长度需在2到10个字符之间',
            trigger: 'blur'
        },
        {
            pattern: /\S/,
            message: '昵称不能包含空格',
            trigger: 'blur'
        }
    ],
    email: [
        { required: true, message: '邮箱不能为空', trigger: 'blur' },
        {
            type: 'email',
            message: '请输入正确的邮箱格式',
            trigger: ['blur', 'change']
        }
    ]
}

const submitForm = async() => {
    const valid = await formRef.value.validate()
    if (valid) {
        await userUpdateInfoService(userInfo.value)
        await getUser()
        ElMessage.success('修改成功')
    }
}
</script>

<template>
    <PageContainer title="个人资料">
        <el-form :model="userInfo" :rules="rules" ref="formRef" 
        label-width="100px" style="max-width: 500px" size="large">
            <!-- 登录名称 -->
            <el-form-item label="登录名称">
                <el-input v-model="userInfo.username" disabled />
            </el-form-item>

            <!-- 用户昵称 -->
            <el-form-item label="用户昵称" prop="nickname">
                <el-input v-model="userInfo.nickname" placeholder="请输入2-10位昵称" clearable />
            </el-form-item>

            <!-- 用户邮箱 -->
            <el-form-item label="用户邮箱" prop="email">
                <el-input v-model="userInfo.email" placeholder="请输入有效邮箱" clearable />
            </el-form-item>

            <!-- 提交按钮 -->
            <el-form-item>
                <el-button type="primary" @click="submitForm">提交修改</el-button>
            </el-form-item>
        </el-form>
    </PageContainer>
</template>