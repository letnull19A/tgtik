import axios from "axios";
import { GetIsRegisterdResponse, GetProfileResponse, GetRateWithBalanceResponse, RegisterRequest, Video, UserActionRequest } from "./types";

const api = axios.create({
    withCredentials: true,
    baseURL: 'http://localhost:3001'
})

const BOT_ID = '7182696236'
const USER_ID = '5599145134'

const getIsRegistered = (botId: string, userId: string) => {
    return api.get<GetIsRegisterdResponse>(`/api/webapp/${userId}/isRegistered/${botId}`)
}

const register = (data: RegisterRequest) => {
    return api.post<GetIsRegisterdResponse>('/api/webapp/register', data)
}

const getProfile = (botId: string, userId: string) => {
    return api.get<GetProfileResponse>(`/api/webapp/${botId}/profile/${userId}`)
}

const getVideos = (botId: string, userId: string) => {
    return api.get<Video[]>(`/api/bot/${botId}/videos/${userId}`)
}

const getRateWithBalance = (botId: string, userId: string) => {
    return api.get<{ balance: number, rate: number, maxVideos: number }>(`/api/user/${userId}/rate-balance/${botId}`)
}

const doAction = (data: UserActionRequest) => {
    return api.post<{status: string, newBalance: number}>('/api/webapp/' + data.botId + '/action', data);
}

const addSignupBonus = (botId: string, userId: string) => {
    return api.post<{ status: number, bonus: number }>(`/api/webapp/add-signup-bonus`, { userId, botId });
}

const getReferralUrl = (botId: string, userId: string) => {
    return api.get<{status: 'success',
    referralLink: string}>(`/api/webapp/${botId}/referral/${userId}`);
}

const getReferrals = (botId: string, userId: string) => {
    return api.get<{referredId: string,
        username: string,
        bonus: number}>(`/api/webapp/${botId}/referrals/${userId}`)
}

export { api, getIsRegistered, BOT_ID, USER_ID, register, getProfile, getVideos, getRateWithBalance, doAction, addSignupBonus, getReferralUrl, getReferrals }