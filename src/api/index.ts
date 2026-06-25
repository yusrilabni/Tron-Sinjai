import axios from 'axios'

// Ganti dengan URL Web App dari Google Apps Script Anda setelah di-deploy
const API_URL = 'https://script.google.com/macros/s/AKfycbz2xMjXWGVa-KUQX19P5FmJASFwfzWlV88YkhPaKvKwYkC5esf12EOZYuZtd9tLWZllpA/exec'

const api = axios.create({
  baseURL: '',
  timeout: 120000, // 120 detik untuk menangani file besar di Google Apps Script
  headers: { 'Content-Type': 'text/plain;charset=utf-8' }
})

const handleApiResponse = (data: any, action?: string) => {
  if (data && data.success === false && data.message && (data.message.includes('Akses ditolak') || data.message.includes('tidak sah'))) {
    console.warn(`[API] Session expired or access denied on action: ${action || 'unknown'}, logging out...`);
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_user')
    window.location.href = '/login?expired=1'
  }
  return data
}

export const post = async (action: string, payload: any = {}, config: any = {}) => {
  try {
    console.log(`[API] Calling action: ${action}`, { ...payload, chunkData: payload.chunkData ? '(truncated)' : undefined });
    const adminToken = localStorage.getItem('admin_token') || ''
    const response = await api.post(API_URL, {
      action,
      admin_token: adminToken,
      payload
    }, config)
    console.log(`[API] Response for ${action}:`, response.data);
    return handleApiResponse(response.data, action)
  } catch (error: any) {
    console.error(`[API] Error in ${action}:`, error.response?.data || error.message)
    throw error
  }
}

export const submitPengajuan = async (data: any, onProgress: (pct: number) => void) => {
  return post('submitPengajuan', data, {
    onUploadProgress: (progressEvent: any) => {
      const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
      onProgress(percentCompleted)
    }
  })
}

export const adminLogin = async (payload: any) => {
  return post('adminLogin', payload)
}

export const uploadGallery = async (payload: any) => {
  return post('uploadGallery', payload)
}

export const updateSubmissionStatus = async (payload: any) => {
  return post('updateSubmissionStatus', payload)
}

export const deleteSubmission = async (no_registrasi: string) => {
  return post('deleteSubmission', { no_registrasi })
}

export const resetSubmissions = async () => {
  return post('resetSubmissions', {})
}

export const checkStatus = async (noRegistrasi: string) => {
  const response = await axios.get(`${API_URL}?action=checkStatus&no_registrasi=${noRegistrasi}`)
  return response.data
}

export const getGallery = async () => {
  const response = await axios.get(`${API_URL}?action=getGallery`)
  return response.data
}

export const getSubmissions = async () => {
  const token = localStorage.getItem('admin_token') || ''
  const response = await axios.get(`${API_URL}?action=getSubmissions&admin_token=${token}`)
  return handleApiResponse(response.data, 'getSubmissions')
}

export const getPublicLogs = async () => {
  const response = await axios.get(`${API_URL}?action=getPublicLogs`)
  return response.data
}

export const getSettings = async () => {
  const token = localStorage.getItem('admin_token') || ''
  const response = await api.get(`${API_URL}?action=getSettings&admin_token=${token}`)
  return handleApiResponse(response.data, 'getSettings')
}

export const updateSettings = async (payload: any) => {
  return post('updateSettings', payload)
}

export const getLogs = async () => {
  const token = localStorage.getItem('admin_token') || ''
  const response = await axios.get(`${API_URL}?action=getLogs&admin_token=${token}`)
  return handleApiResponse(response.data, 'getLogs')
}

export const getGroups = async () => {
  const response = await axios.get(`${API_URL}?action=getGroups`)
  return response.data
}

export const createGroup = async (payload: any) => {
  return post('createGroup', payload)
}

export const updateGroupItems = async (payload: any) => {
  return post('updateGroupItems', payload)
}

export const deleteGroup = async (id: string) => {
  return post('deleteGroup', { id })
}
