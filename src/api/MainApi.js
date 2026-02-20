import axios from 'axios'
const FALLBACK_API_BASE_URL = 'https://athletic-victory-production-b8f6.up.railway.app'
const configuredBaseUrl = process.env.NEXT_PUBLIC_BASE_URL?.trim()
export const baseUrl = (configuredBaseUrl || FALLBACK_API_BASE_URL).replace(/\/+$/, '')

const MainApi = axios.create({
    baseURL: baseUrl,
})

MainApi.interceptors.request.use(function (config) {
    let zoneId = undefined
    let token = undefined
    let language = undefined
    let currentLocation = undefined
    let software_id = 33571750
    let hostname = process.env.NEXT_CLIENT_HOST_URL

    if (typeof window !== 'undefined') {
        zoneId = localStorage.getItem('zoneid')
        token = localStorage.getItem('token')
        language = localStorage.getItem('language')
        currentLocation = JSON.parse(localStorage.getItem('currentLatLng'))
    }
    config.headers.latitude = currentLocation?.lat || 0
    config.headers.longitude = currentLocation?.lng || 0
    if (zoneId) config.headers.zoneId = zoneId
    if (token) config.headers.authorization = `Bearer ${token}`
    if (language) config.headers['X-localization'] = language
    if (hostname) config.headers['origin'] = hostname
    config.headers['X-software-id'] = software_id
    config.headers["ngrok-skip-browser-warning"] = true;

    return config
})
export default MainApi
