import { sql } from 'kysely'
import { ApplicationDatabase } from '../database/database'
import {
   AddReferral,
   UserAction,
   DoWithdraw,
   GetBalance,
   GetReferralUri
} from '../utils/types'
import { BotManager } from './bot.manager'
import { error } from 'console'

export class UserService {
   constructor(
      private readonly db: ApplicationDatabase,
      private readonly botManager: BotManager
   ) {}

   public async doAction(data: UserAction) {
      const bot = await this.db.pool
         .selectFrom('bots')
         .selectAll()
         .where('botId', '=', data.botId)
         .executeTakeFirst()
      if (!bot) return { error: 'Bot not found', status: 404 }

      const user = await this.db.pool
         .selectFrom('users')
         .selectAll()
         .where('telegramId', '=', data.userId)
         .where('botId', '=', data.botId)
         .executeTakeFirst()
      if (!user) return { error: 'User not found', status: 404 }

      const video = await this.db.pool
         .selectFrom('videos')
         .selectAll()
         .where('id', '=', data.videoId)
         .executeTakeFirst()
      if (!video) return { error: 'Video not found', status: 404 }

      const doneAction = await this.db.pool
         .selectFrom('actions')
         .selectAll()
         .where('userId', '=', data.userId)
         .where('botId', '=', data.botId)
         .where('videoId', '=', data.videoId)
         .executeTakeFirst()

      if (doneAction) {
         return { error: 'Video already action', status: 404 }
      }

      const today = new Date().toISOString().slice(0, 10)
      const actionsToday = await this.db.pool
         .selectFrom('actions')
         .select(sql<string>`count(*)`.as('count'))
         .where('userId', '=', data.userId)
         .where('botId', '=', data.botId)
         .where('date', '=', today)
         .executeTakeFirst()

      if (parseInt(actionsToday?.count || '0') >= bot.dailyVideoLimit) {
         return { error: 'Daily video limit reached', status: 403 }
      }

      const reward = data.action === 'like' ? bot.likeReward : bot.dislikeReward
      await this.db.pool
         .updateTable('users')
         .set({ balance: sql`balance + ${reward}` })
         .where('telegramId', '=', data.userId)
         .where('botId', '=', data.botId)
         .execute()
      await this.db.pool
         .insertInto('actions')
         .values({
            userId: data.userId,
            botId: data.botId,
            videoId: data.videoId,
            action: data.action,
            date: today
         })
         .execute()

      return { status: 'success', newBalance: user.balance + reward }
   }

   public async withdraw(data: DoWithdraw) {
      const { botId, userId, amount, cardNumber } = data
      const bot = await this.db.pool
         .selectFrom('bots')
         .selectAll()
         .where('botId', '=', botId)
         .executeTakeFirst()
      if (!bot) return { error: 'Bot not found', status: 404 }

      const user = await this.db.pool
         .selectFrom('users')
         .selectAll()
         .where('telegramId', '=', userId)
         .where('botId', '=', botId)
         .executeTakeFirst()
      if (!user) return { error: 'User not found', status: 404 }
      if (user.balance < bot.withdrawalLimit) {
         return { error: 'Minimum withdrawal limit not reached', status: 403 }
      }
      if (user.balance < amount) {
         return { error: 'Insufficient balance', status: 403 }
      }

      await this.db.pool
         .updateTable('users')
         .set({ balance: sql`balance - ${amount}` })
         .where('telegramId', '=', userId)
         .where('botId', '=', botId)
         .execute()
      await this.db.pool
         .insertInto('withdrawals')
         .values({
            userId,
            botId,
            amount,
            cardNumber,
            status: 'pending',
            createdAt: new Date()
         })
         .execute()

      return { status: 'success', message: 'Withdrawal request submitted' }
   }

   public async addReferal(data: AddReferral) {
      const { botId, referrerId, referredId } = data
      const bot = await this.db.pool
         .selectFrom('bots')
         .selectAll()
         .where('botId', '=', botId)
         .executeTakeFirst()
      if (!bot) return { error: 'Bot not found', status: 404 }

      await this.db.pool
         .insertInto('referrals')
         .values({ referrerId, referredId, botId })
         .onConflict(oc => oc.doNothing())
         .execute()
      await this.db.pool
         .updateTable('users')
         .set({ balance: sql`balance + ${bot.referralReward}` })
         .where('telegramId', '=', referrerId)
         .where('botId', '=', botId)
         .execute()

      return { status: 'success' }
   }

   public async getBalance(data: GetBalance) {
      const user = await this.db.pool
         .selectFrom('users')
         .select(['balance'])
         .where('telegramId', '=', data.userId)
         .where('botId', '=', data.botId)
         .executeTakeFirst()
      if(!user) {
         return {error: 'User not found', status: 404}
      }
      return { balance: user?.balance }
   }

   public async getReferralUri(data: GetReferralUri) {
      const { userId, botId } = data

      // Проверяем существование пользователя
      const userExists = await this.db.pool
         .selectFrom('users')
         .select(['telegramId'])
         .where('telegramId', '=', userId)
         .where('botId', '=', botId)
         .executeTakeFirst()

      if (!userExists) {
         return { error: 'User not found', status: 404 }
      }
      const botFromDb = await this.db.pool
         .selectFrom('bots')
         .select(['token'])
         .where('botId', '=', botId)
         .executeTakeFirst()
      
      if (!botFromDb) {
         return { error: 'Bot not found', status: 404 }
      }
   
      const botName = await this.botManager.getName(botFromDb.token)
      console.log(botName)
      if (!botName) {
         return { error: 'Bot not found', status: 404 }
      }

      // Формируем реферальную ссылку
      const referralLink = `https://t.me/${botName}?start=trackingId_ref_${userId}`

      return {
         status: 'success',
         referralLink
      }
   }

   public async getProfile({ userId, botId }: { userId: string, botId: string }) {
      const user = await this.db.pool
         .selectFrom('users')
         .selectAll()
         .where('telegramId', '=', userId)
         .where('botId', '=', botId)
         .executeTakeFirst();
      if (!user) {
         return { error: 'User not found', status: 404 };
      }
      // Количество приглашённых друзей
      const invited = await this.db.pool
        .selectFrom('referrals')
        .select(sql<number>`COUNT(*)`.as('count'))
        .where('referrerId', '=', userId)
        .where('botId', '=', botId)
        .executeTakeFirst();
    
      // Количество лайков
      const likes = await this.db.pool
        .selectFrom('actions')
        .select(sql<number>`COUNT(*)`.as('count'))
        .where('userId', '=', userId)
        .where('botId', '=', botId)
        .where('action', '=', 'like')
        .executeTakeFirst();
    
      // Количество дизлайков
      const dislikes = await this.db.pool
        .selectFrom('actions')
        .select(sql<number>`COUNT(*)`.as('count'))
        .where('userId', '=', userId)
        .where('botId', '=', botId)
        .where('action', '=', 'dislike')
        .executeTakeFirst();
    
      // Баланс (Earnings)
      const earnings = user?.balance ?? 0;
      return {
        username: user?.username ?? null,
        registrationDate: user?.createdAt ?? null, // если есть поле createdAt
        invitedFriends: Number(invited?.count ?? 0),
        likes: Number(likes?.count ?? 0),
        dislikes: Number(dislikes?.count ?? 0),
        earnings,
      };
    }

   public async getReferralsByUserId(userId: string, botId: string) {
      // Проверяем, существует ли пользователь
      const user = await this.db.pool
         .selectFrom('users')
         .select(['telegramId'])
         .where('telegramId', '=', userId)
         .where('botId', '=', botId)
         .executeTakeFirst();
      if (!user) {
         return { error: 'User not found', status: 404 };
      }
      // Получаем бонус за реферала из таблицы bots
      const bot = await this.db.pool
         .selectFrom('bots')
         .select(['referralReward'])
         .where('botId', '=', botId)
         .executeTakeFirst();

      const referrals = await this.db.pool
         .selectFrom('referrals')
         .select(['referredId', 'botId'])
         .where('referrerId', '=', userId)
         .where('botId', '=', botId)
         .execute();

      const result = [];
      for (const ref of referrals) {
         const user = await this.db.pool
            .selectFrom('users')
            .select(['telegramId', 'username'])
            .where('telegramId', '=', ref.referredId)
            .where('botId', '=', botId)
            .executeTakeFirst();

         result.push({
            referredId: ref.referredId,
            username: user?.username ?? null,
            bonus: bot?.referralReward ?? 0
         });
      }
      return result;
   }

   public async getIsRegistered(userId: string, botId: string) {
      const user = await this.db.pool
         .selectFrom('users')
         .select(['isRegistered'])
         .where('telegramId', '=', userId)
         .where('botId', '=', botId)
         .executeTakeFirst();
      if (!user) {
         return { isRegistered: false };
      }
      return { isRegistered: !!user.isRegistered };
   }

   public async register(userId: string, botId: string, age: number, sex: string) {
      // Проверка на существование пользователя
      const user = await this.db.pool
         .selectFrom('users')
         .select(['telegramId'])
         .where('telegramId', '=', userId)
         .where('botId', '=', botId)
         .executeTakeFirst();
      if (!user) {
         return { error: 'User not found', status: 404 };
      }
      const sexValue = (['male', 'female', 'other'].includes(sex) ? sex : undefined) as 'male' | 'female' | 'other' | undefined;
      const result = await this.db.pool
         .updateTable('users')
         .set({ age, isRegistered: true, sex: sexValue })
         .where('telegramId', '=', userId)
         .where('botId', '=', botId)
         .execute();
      if (!result || result.length === 0) {
         return { error: 'User not found', status: 404 };
      }
      return { status: true };
   }

   public async getRateWithBalance(botId: string, userId: string) {
      // Получаем баланс пользователя
      const user = await this.db.pool
         .selectFrom('users')
         .select(['balance'])
         .where('telegramId', '=', userId)
         .where('botId', '=', botId)
         .executeTakeFirst();
      if (!user) {
         return { error: 'User not found', status: 404 };
      }
      // Получаем количество оценённых видео за сегодня
      const today = new Date().toISOString().slice(0, 10);
      const rateResult = await this.db.pool
         .selectFrom('actions')
         .select(sql<number>`count(*)`.as('rate'))
         .where('userId', '=', userId)
         .where('botId', '=', botId)
         .where('date', '=', today)
         .executeTakeFirst();
      // Получаем максимальное количество видео из таблицы bots
      const bot = await this.db.pool
         .selectFrom('bots')
         .select(['dailyVideoLimit'])
         .where('botId', '=', botId)
         .executeTakeFirst();
      return {
         balance: user.balance,
         rate: Number(rateResult?.rate || 0),
         maxVideos: bot?.dailyVideoLimit ?? null
      };
   }

   public async addSignupBonus(userId: string, botId: string): Promise<{ status: number, bonus?: number }> {
      // Получаем пользователя и бота
      const user = await this.db.pool
         .selectFrom('users')
         .select(['isSubscribed', 'hasBonus'])
         .where('telegramId', '=', userId)
         .where('botId', '=', botId)
         .executeTakeFirst();
      if (!user || !user.isSubscribed || user.hasBonus) return { status: 403 };
      const bot = await this.db.pool
         .selectFrom('bots')
         .select(['signupBonus'])
         .where('botId', '=', botId)
         .executeTakeFirst();
      if (!bot) return { status: 403 };
      await this.db.pool
         .updateTable('users')
         .set({
            balance: sql`balance + ${bot.signupBonus}`,
            hasBonus: true
         })
         .where('telegramId', '=', userId)
         .where('botId', '=', botId)
         .execute();
      return { status: 200, bonus: bot.signupBonus };
   }
}
