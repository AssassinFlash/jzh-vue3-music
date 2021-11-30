import axios from 'axios'

const ERR_OK = 0
const baseURL = '/'
axios.defaults.baseURL = baseURL

// 对axios.get做一层封装，随后通过访问接口的get就能拿到结果
export function get (url, params) {
  return axios.get(url, {
    params
  }).then(res => {
    const serverData = res.data
    if (serverData.code === ERR_OK) {
      return serverData.result
    }
  }).catch(err => {
    console.log(err)
  })
}
