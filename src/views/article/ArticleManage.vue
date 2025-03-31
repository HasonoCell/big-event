<script setup>
import { Edit, Delete } from "@element-plus/icons-vue";
import PageContainer from "../../components/PageContainer.vue";
import ChannelSelect from "../../components/ChannelSelect.vue";
import { onMounted, ref } from "vue";
import { artGetListService, artDelListService } from "../../api/article";
import { formatTime } from "@/utils/format";
import ArticleEdit from "../../components/ArticleEdit.vue";

const loading = ref(false);
const params = ref({
  pagenum: 1,
  pagesize: 10,
  cate_id: "",
  state: "",
});
const articleList = ref([]);
const total = ref(0);
const articleEditRef = ref();

const getArticleList = async () => {
  loading.value = true;
  const res = await artGetListService(params.value);
  articleList.value = res.data.data;
  total.value = res.data.total;
  loading.value = false;
};

const onSizeChange = (size) => {
  params.value.pagenum = 1;
  params.value.pagesize = size;
  getArticleList();
};
const onCurrentChange = (page) => {
  params.value.pagenum = page;
  getArticleList();
};

const onSearch = () => {
  params.value.pagenum = 1;
  getArticleList();
};

const onReset = () => {
  params.value.pagenum = 1;
  params.value.cate_id = "";
  params.value.state = "";
  getArticleList();
};

const onDeleteArticle = async (row) => {
  await ElMessageBox.confirm("你确定删除该文章信息吗？", "温馨提示", {
    type: "warning",
    confirmButtonText: "确认",
    cancelButtonText: "取消",
  });
  await artDelListService(row.id);
  ElMessage.success("删除成功");
  getArticleList();
};

const onAddArticle = () => {
  articleEditRef.value.open({});
};

const onEditArticle = (row) => {
  articleEditRef.value.open(row);
};

const onSuccess = (type) => {
  if (type === "add") {
    const lastPage = Math.ceil((total.value + 1) / params.value.pagesize);
    params.value.pagenum = lastPage;
  }
  getArticleList();
};

onMounted(() => getArticleList());
</script>

<template>
  <PageContainer title="文章管理">
    <template #extra>
      <el-button type="primary" @click="onAddArticle">发布文章</el-button>
    </template>

    <el-form inline>
      <el-form-item label="文章分类:">
        <ChannelSelect v-model="params.cate_id"></ChannelSelect>
      </el-form-item>
      <el-form-item label="发布状态:">
        <el-select v-model="params.state" :style="{ width: '200px' }">
          <el-option label="已发布" value="已发布" />
          <el-option label="草稿" value="草稿" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSearch">搜索</el-button>
        <el-button @click="onReset">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table
      :data="articleList"
      v-loading="loading"
      :cell-style="{ height: '80px' }"
    >
      <el-table-column label="文章标题" prop="title">
        <template #default="{ row }">
          <el-link type="primary" :underline="false">{{ row.title }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="分类" prop="cate_name" />
      <el-table-column label="发表时间">
        <template #default="{ row }">
          {{ formatTime(row.pub_date) }}
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="state" />
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button
            :icon="Edit"
            circle
            plain
            type="primary"
            @click="onEditArticle(row)"
          ></el-button>
          <el-button
            :icon="Delete"
            circle
            plain
            type="danger"
            @click="onDeleteArticle(row)"
          ></el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="没有数据" />
      </template>
    </el-table>

    <el-pagination
      v-model:current-page="params.pagenum"
      v-model:page-size="params.pagesize"
      :page-sizes="[2, 3, 5, 10]"
      :background="true"
      layout="jumper, total, sizes, prev, pager, next"
      :total="total"
      @size-change="onSizeChange"
      @current-change="onCurrentChange"
    />

    <ArticleEdit ref="articleEditRef" @success="onSuccess"></ArticleEdit>
  </PageContainer>
</template>

<style scoped lang="scss">
.el-pagination {
  margin-top: 20px;
  justify-content: flex-end;
}
</style>
