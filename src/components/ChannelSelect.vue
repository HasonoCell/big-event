<script setup>
import { artGetChannelService } from "@/api/article";
import { ref } from "vue";

defineProps({
  modelValue: {
    type: [Number, String],
  },
});

const emit = defineEmits(["update:modelValue"]);

const channelList = ref([]);
const getChannelList = async () => {
  const res = await artGetChannelService();
  channelList.value = res.data.data;
};
getChannelList();
</script>

<template>
  <el-select
    :modelValue="modelValue"
    @update:modelValue="emit('update:modelValue', $event)"
  >
    <el-option
      v-for="channel in channelList"
      :key="channel.id"
      :label="channel.cate_name"
      :value="channel.id"
    />
  </el-select>
</template>

<style scoped lang="scss">
.el-select {
  width: 200px;
}
</style>
