import axios from "axios"
import router from "../router"
import { useUserStore } from "../stores"
import { ElMessage } from "element-plus"

const baseURL = 'http://big-event-vue-api-t.itheima.net'

const instance = axios.create({
    baseURL,
    timeout: 10000
})

instance.interceptors.request.use(
    (config) => {
        const userStore = useUserStore()
        if (userStore.token) {
            config.headers.Authorization = userStore.token
        }
        return config
    },
    (err) => Promise.reject(err)
)

instance.interceptors.response.use(
    (res) => {
        if (res.data.code === 0) {
            return res
        }
        ElMessage.error(res.data.message || '服务器异常')
        return Promise.reject(res.data)
    },
    (err) => {
        if (err.response?.status === 401) {
            router.push('/login')
        }
        ElMessage.error(err.response?.data?.message || '服务器异常')
        return Promise.reject(err)
    }
)

// 将网络图片地址转换为File对象
async function imageUrlToFile(url, fileName) {
  try {
    // 第一步：使用axios获取网络图片数据
    const response = await axios.get(url, { responseType: "arraybuffer" });
    const imageData = response.data;

    // 第二步：将图片数据转换为Blob对象
    const blob = new Blob([imageData], {
      type: response.headers["content-type"],
    });

    // 第三步：创建一个新的File对象
    const file = new File([blob], fileName, { type: blob.type });

    return file;
  } catch (error) {
    console.error("将图片转换为File对象时发生错误:", error);
    throw error;
  }
}

export default instance
export { baseURL, imageUrlToFile }