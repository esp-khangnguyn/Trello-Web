import axios from 'axios'
import { API_ROOT } from '~/utils/constants'

// Board Apu
export const fetchBoardDetailsAPI = async (boardId) => {
  // Xử lý error try catch ở trong Interceptor của Axios , không cần code trong này

  const request = await axios.get(`${API_ROOT}/v1/boards/${boardId}`)
  return request.data
}

// update order column
export const updateBoardDetailsAPI = async (boardId, updateData) => {
  // Xử lý error try catch ở trong Interceptor của Axios , không cần code trong này

  const request = await axios.put(
    `${API_ROOT}/v1/boards/${boardId}`,
    updateData
  )
  return request.data
}

export const moveCardToOtherColumnAPI = async (updateData) => {
  // Xử lý error try catch ở trong Interceptor của Axios , không cần code trong này

  const request = await axios.put(
    `${API_ROOT}/v1/boards/supports/moving_cards`,
    updateData
  )
  return request.data
}

export const updateColumnDetailsAPI = async (columnId, updateData) => {
  // Xử lý error try catch ở trong Interceptor của Axios , không cần code trong này
  console.log('id ', columnId)
  const request = await axios.put(
    `${API_ROOT}/v1/columns/${columnId}`,
    updateData
  )
  return request.data
}

export const deleteColumnDetailsAPI = async (columnId) => {
  // Xử lý error try catch ở trong Interceptor của Axios , không cần code trong này
  console.log('id ', columnId)
  const request = await axios.delete(`${API_ROOT}/v1/columns/${columnId}`)
  return request.data
}

// Column
export const createNewColumnAPI = async (newColumnData) => {
  // Xử lý error try catch ở trong Interceptor của Axios , không cần code trong này

  const request = await axios.post(`${API_ROOT}/v1/columns/`, newColumnData)
  return request.data
}

// Card
export const createNewCardAPI = async (newCardData) => {
  // Xử lý error try catch ở trong Interceptor của Axios , không cần code trong này

  const request = await axios.post(`${API_ROOT}/v1/cards/`, newCardData)
  return request.data
}
