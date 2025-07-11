// Утилиты для работы с Telegram WebApp API

export interface TelegramData {
  botId: string;
  userId: string;
  user?: {
    id: number;
    first_name: string;
    last_name?: string;
    username?: string;
    language_code?: string;
    is_premium?: boolean;
    photo_url?: string;
  };
  chat?: {
    id: number;
    type: 'group' | 'supergroup' | 'channel';
    title: string;
    username?: string;
    photo_url?: string;
  };
  startParam?: string;
}

/**
 * Проверяет, запущено ли приложение в Telegram WebApp
 */
export const isTelegramWebApp = (): boolean => {
  return typeof window !== 'undefined' && 
         window.Telegram?.WebApp !== undefined;
};

/**
 * Инициализирует Telegram WebApp
 */
export const initTelegramWebApp = (): void => {
  if (isTelegramWebApp()) {
    window.Telegram!.WebApp!.ready();
  }
};

/**
 * Получает данные из Telegram WebApp
 * @returns Объект с botId, userId и другими данными пользователя
 */
export const getTelegramData = (): TelegramData | null => {
  if (!isTelegramWebApp()) {
    return null;
  }

  const webApp = window.Telegram!.WebApp!;
  const initData = webApp.initDataUnsafe;

  // Получаем botId из URL или других источников
  const botId = getBotIdFromUrl() || getBotIdFromInitData(initData);
  
  // Получаем userId из данных пользователя
  const userId = initData.user?.id?.toString() || '';

  if (!botId || !userId) {
    console.warn('Не удалось получить botId или userId из Telegram WebApp');
    return null;
  }

  return {
    botId,
    userId,
    user: initData.user,
    chat: initData.chat,
    startParam: initData.start_param
  };
};

/**
 * Получает botId из URL
 */
const getBotIdFromUrl = (): string | null => {
  if (typeof window === 'undefined') return null;
  
  const urlParams = new URLSearchParams(window.location.search);
  const botId = urlParams.get('bot_id') || urlParams.get('botId');
  
  return botId;
};

/**
 * Получает botId из initData (если доступно)
 */
const getBotIdFromInitData = (initData: any): string | null => {
  // В некоторых случаях botId может быть в initData
  // Это зависит от того, как настроен бот
  return null;
};

/**
 * Получает только userId
 */
export const getUserId = (): string | null => {
  try {
    return window.Telegram?.WebApp?.initDataUnsafe?.user?.id?.toString() || null;
  } catch {
    return null;
  }
};

/**
 * Получает только botId
 */
export const getBotId = (): string | null => {
  try {
    // Сначала из initDataUnsafe (если вдруг есть)
    const fromInitData = window.Telegram?.WebApp?.initDataUnsafe?.bot_id;
    if (fromInitData) return fromInitData.toString();
    // Потом из URL
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('bot_id') || urlParams.get('botId') || null;
  } catch {
    return null;
  }
};

/**
 * Получает country из URL
 */
export const getCountry = (): string | null => {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('country') || null;
  } catch {
    return null;
  }
};

/**
 * Получает данные пользователя
 */
export const getUserData = () => {
  const data = getTelegramData();
  return data?.user || null;
};

/**
 * Получает данные чата
 */
export const getChatData = () => {
  const data = getTelegramData();
  return data?.chat || null;
};

/**
 * Получает start параметр
 */
export const getStartParam = (): string | null => {
  const data = getTelegramData();
  return data?.startParam || null;
};

/**
 * Открывает ссылку в Telegram
 */
export const openTelegramLink = (url: string): void => {
  if (isTelegramWebApp() && window.Telegram?.WebApp?.openTelegramLink) {
    window.Telegram.WebApp.openTelegramLink(url);
  } else {
    // Fallback для браузера
    window.open(url, '_blank');
  }
};

/**
 * Отправляет данные обратно в бот
 */
export const sendDataToBot = (data: string): void => {
  if (isTelegramWebApp() && window.Telegram?.WebApp?.sendData) {
    window.Telegram.WebApp.sendData(data);
  }
};

/**
 * Закрывает WebApp
 */
export const closeWebApp = (): void => {
  if (isTelegramWebApp() && window.Telegram?.WebApp?.close) {
    window.Telegram.WebApp.close();
  }
}; 