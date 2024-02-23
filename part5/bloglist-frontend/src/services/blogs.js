import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = (newToken) => {
  token = `bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = async ({ newTitle, newAuthor, newUrl }) => {
  const response = await axios.post(baseUrl, {
    'title': newTitle,
    'author': newAuthor,
    'url': newUrl
  }, { headers: {
    'Authorization': token
  } })
  return response.data
}

const findSelf = async () => {
  const response = await axios.get(baseUrl + '/self', { headers: {
    'Authorization': token
  } })
  return response.data
}

const like = async ({ id, data }) => {
  const response = await axios.put(baseUrl + '/' + id, data)
  return response.data
}

const remove = async ({ id }) => {
  const response = await axios.delete(baseUrl + '/' + id, { headers: {
    'Authorization': token
  } })
}

export default { getAll, setToken, findSelf, create, like, remove }