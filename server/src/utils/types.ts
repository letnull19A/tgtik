import { Generated } from 'kysely'

export interface Database {
   bots: {
      token: string
      botId: string
      country: string
      channelId: string
      likReward: number
      dislikeReward: number
      channelInviteLink: string
      referralReward: number // Changed from float to number
      signupBonus: number // Changed from float to number
      withdrawalLimit: number // Changed from float to number
      currency: string
      dailyVideoLimit: number
      status: 'running' | 'stopped'
      offset: number
   }
   users: {
      telegramId: string
      username: string
      botId: string
      balance: number // Changed from float to number
      country: string
      trackingId: string | null
      isSubscribed: boolean
      hasBonus: boolean
      createdAt: Date
      isRegistered: boolean
      age?: number
      sex?: 'male' | 'female' | 'other'
   }
   videos: {
      id: Generated<number>
      botId: string
      description: string
      profileId: string
      likeReward: number
      dislikeReward: number
      likes: number
      dislikes: number
      url: string
      hashtags: string
      redirectChannelUrl: string
   }
   actions: {
      id: Generated<number>
      userId: string
      botId: string
      videoId: number
      action: 'like' | 'dislike'
      date: string
   }
   referrals: {
      referrerId: string
      referredId: string
      botId: string
   }
   withdrawals: {
      id: Generated<number>
      userId: string
      botId: string
      amount: number // Changed from float to number
      cardNumber: string
      status: 'pending' | 'completed' | 'failed'
      createdAt: Date
   }
}

export interface BotConfig {
   token: string
   country: string
   channelId: string
   likReward: number
   dislikeReward: number
   referralReward: number
   signupBonus: number
   withdrawalLimit: number
   currency: string
   dailyVideoLimit: number
   status: 'running' | 'stopped'
   channelInviteLink: string
}

export interface Translation {
   welcome: string
   subscribed: string
   error: string
}

export type GetTranslationParams = Record<string, string | number>

export type UserAction = {
   botId: string
   userId: string
   action: 'like' | 'dislike'
   videoId: number
}

export type DoWithdraw = {
   botId: string
   userId: string
   amount: number
   cardNumber: string
}

export type AddReferral = {
   referrerId: string
   referredId: string
   botId: string
}

export type GetBalance = {
   botId: string
   userId: string
}

export type AddVideo = {
   token: string
   url: string
   hashtags: string[]
   description: string
   profileId: string
   likeReward: number
   dislikeReward: number
   likes: number
   dislikes: number
   redirectChannelUrl: string
}

export type GetVideos = {
   userId: string
   botId: string
}

export type GetReferralUri = {
   userId: string
   botId: string
}
