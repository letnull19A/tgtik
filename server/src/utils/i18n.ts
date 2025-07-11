import { Translation, GetTranslationParams } from './types'

const translations: Record<string, Translation> = {
   en: {
      welcome: 'Welcome! Open the WebApp to start.',
      subscribed:
         'You have subscribed to the channel! Bonus: {bonus} {currency}',
      error: 'An error occurred. Please try again.'
   },
   ru: {
      welcome: 'Добро пожаловать! Откройте WebApp, чтобы начать.',
      subscribed: 'Вы подписались на канал! Бонус: {bonus} {currency}',
      error: 'Произошла ошибка. Попробуйте снова.'
   }
}

export function getTranslation(
   languageCode: string | undefined,
   key: keyof Translation,
   params: GetTranslationParams = {}
) {
   const code = languageCode?.toLowerCase()
   console.log('getTranslation:', { code, key, params })
   const lang = code && translations[code] ? code : 'en'
   let text = translations[lang][key] || translations.en[key] || key
   Object.entries(params).forEach(([k, v]) => {
      text = text.replace(`{${k}}`, v.toString())
   })
   return text
}

export { translations }
