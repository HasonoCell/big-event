<script setup>
import { Plus } from "@element-plus/icons-vue";
import { nextTick, ref } from "vue";
import ChannelSelect from "./ChannelSelect.vue";
import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
import {
  artEditService,
  artGetDetailService,
  artPublishService,
} from "../api/article";
import { baseURL, imageUrlToFile } from "../utils/request";

const visibleDrawer = ref(false);
const formRef = ref();
const editor = ref();
const imgUrl = ref("");

const defaultForm = {
  title: "",
  cate_id: "",
  cover_img: "",
  content: "",
  state: "",
};

const formModel = ref({ ...defaultForm });

const emit = defineEmits(["success"]);

const open = async (row) => {
  visibleDrawer.value = true;
  await nextTick(() => {
    if (formRef.value) {
      formRef.value.resetFields();
    }
  });
  if (row.id) {
    const res = await artGetDetailService(row.id);
    formModel.value = res.data.data;
    imgUrl.value = baseURL + formModel.value.cover_img;
    formModel.value.cover_img = await imageUrlToFile(
      imgUrl.value,
      formModel.value.cover_img
    );
  } else {
    formModel.value = { ...defaultForm };
    imgUrl.value = "";
    await nextTick(() => {
      if (editor.value) {
        editor.value.setHTML("");
      }
    });
  }
};

const onUploadFile = (file) => {
  imgUrl.value = URL.createObjectURL(file.raw) // 生成预览URL
  formModel.value.cover_img = file.raw // 保存原始文件对象
};

const onPublish = async (state) => {
  formModel.value.state = state;
  const formdata = new FormData();
  for (let key in formModel.value) {
    formdata.append(key, formModel.value[key]);
  }

  if (formModel.value.id) {
    await artEditService(formdata);
    ElMessage.success("编辑成功");
    visibleDrawer.value = false;
    emit("success", "edit");
  } else {
    await artPublishService(formdata);
    ElMessage.success("添加成功");
    visibleDrawer.value = false;
    emit("success", "add");
  }
};

defineExpose({
  open,
});
</script>

<template>
  <el-drawer
    v-model="visibleDrawer"
    :title="formModel.id ? '编辑文章' : '添加文章'"
    direction="rtl"
    size="50%"
  >
    <el-form :model="formModel" ref="formRef" label-width="100px">
      <el-form-item label="文章标题" prop="title">
        <el-input v-model="formModel.title" placeholder="请输入标题"></el-input>
      </el-form-item>
      <el-form-item label="文章分类" prop="cate_id">
        <ChannelSelect v-model="formModel.cate_id" width="100%"></ChannelSelect>
      </el-form-item>
      <el-form-item label="文章封面" prop="cover_img">
        <el-upload
          class="avatar-uploader"
          :auto-upload="false"
          :show-file-list="false"
          :on-change="onUploadFile"
        >
          <img :src="imgUrl" v-if="imgUrl" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label="文章内容" prop="content">
        <div class="editor">
          <QuillEditor
            theme="snow"
            contentType="html"
            v-model:content="formModel.content"
            ref="editor"
          ></QuillEditor>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onPublish('已发布')">发布</el-button>
        <el-button type="info" @click="onPublish('草稿')">草稿</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>

<style lang="scss" scoped>
.avatar-uploader {
  :deep() {
    .avatar {
      width: 178px;
      height: 178px;
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
      width: 178px;
      height: 178px;
      text-align: center;
    }
  }
}

.editor {
  width: 100%;

  :deep(.ql-editor) {
    min-height: 200px;
  }
}
</style>
