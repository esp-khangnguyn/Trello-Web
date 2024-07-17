import axios from 'axios'
import { API_ROOT } from '~/utils/constants'

export const fetchBoardDetailsAPI = async (boardId) => {
  // Xử lý error try catch ở trong Interceptor của Axios , không cần code trong này

  const request = await axios.get(`${API_ROOT}/v1/boards/${boardId}`)
  return request.data
}
