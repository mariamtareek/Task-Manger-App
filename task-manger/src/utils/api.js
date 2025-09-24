import axios from 'axios'

const ANON_KEY = import.meta.env.VITE_ANON_KEY

const api = axios.create({
    baseURL: 'https://kbybdtacoqvgcijrkzkv.supabase.co/rest/v1',
    headers: {
        Authorization: `Bearer ${ANON_KEY}`,
        apikey: ANON_KEY,
        'Content-Type': 'application/json',
        Prefer: 'return=representation',
    },
})

export default api
