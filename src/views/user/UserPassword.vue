<script setup>
import PageContainer from '../../components/PageContainer.vue';
import { userUpdatePWDService } from '../../api/user'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../../stores'

const formRef = ref()
const router = useRouter()
const userStore = useUserStore()
const pwdValue = ref({
    old_pwd: '',
    new_pwd: '',
    re_pwd: '',
})

const checkOldSame = (rule, value, cb) => {
    if (value === pwdValue.value.old_pwd) {
        cb(new Error('原密码和新密码不能一致！'))
    } else { cb() }
}

const checkNewSame = (rule, value, cb) => {
    if (value !== pwdValue.value.new_pwd) {
        cb(new Error('两次输入的新密码不一致！'))
    } else { cb() }
}

const rules = {
    old_pwd: [
        { required: true, message: '请输入密码', trigger: 'blur'},
        {
            pattern: /^\S{6,15}$/,
            message: '密码长度必须是6-15位的非空字符串',
            trigger: 'blur'
        }
    ],
    new_pwd: [
        { required: true, message: '请输入新密码', trigger: 'blur' },
        {
        pattern: /^\S{6,15}$/,
        message: '密码长度必须是6-15位的非空字符串',
        trigger: 'blur'
        },
        { validator: checkOldSame, trigger: 'blur' }
    ],
    re_pwd: [
        { required: true, message: '请再次确认新密码', trigger: 'blur' },
        {
            pattern: /^\S{6,15}$/,
            message: '密码长度必须是6-15位的非空字符串',
            trigger: 'blur'
        },
        { validator: checkNewSame, trigger: 'blur' }
    ]
}

const onSubmit = async() => {
    const valid = await formRef.value.validate()
    if (valid) {
        await userUpdatePWDService(pwdValue.value)
        ElMessage.success('更换成功')
        userStore.removeToken()
        userStore.setUser({})
        router.push('/login')
    }
}

const onReset = () => {
    formRef.value.resetFields()
}

</script>

<template>
    <PageContainer title="重置密码">
        <el-row>
            <el-col :span="12">
                <el-form label-width="100px" :model="pwdValue" 
                :rules="rules" ref="formRef" size="large">
                    <el-form-item label="原密码" prop="old_pwd">
                        <el-input v-model="pwdValue.old_pwd"></el-input>
                    </el-form-item>
                    <el-form-item label="新密码" prop="new_pwd">
                        <el-input v-model="pwdValue.new_pwd"></el-input>
                    </el-form-item>
                    <el-form-item label="确认新密码" prop="re_pwd">
                        <el-input v-model="pwdValue.re_pwd"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onSubmit" style="width: 100%;">修改密码</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button @click="onReset" style="width: 100%;">重置密码</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
    </PageContainer>
</template>