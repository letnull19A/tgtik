# Интеграция с Telegram WebApp API

## Обзор

Этот проект теперь поддерживает получение `BOT_ID` и `USER_ID` через Telegram WebApp API вместо хардкода. Это позволяет приложению работать корректно в контексте Telegram Mini App.

## Что изменилось

### 1. Новые утилиты (`client/src/utils/telegram.ts`)

Создан модуль с функциями для работы с Telegram WebApp API:

- `isTelegramWebApp()` - проверяет, запущено ли приложение в Telegram WebApp
- `initTelegramWebApp()` - инициализирует Telegram WebApp
- `getTelegramData()` - получает все данные из Telegram WebApp
- `getBotId()` - получает botId из Telegram WebApp
- `getUserId()` - получает userId из Telegram WebApp
- `getUserData()` - получает данные пользователя
- `getChatData()` - получает данные чата
- `getStartParam()` - получает start параметр

### 2. Обновленный API (`client/src/api/api.ts`)

- Добавлены функции для автоматического получения ID: `getCurrentBotId()` и `getCurrentUserId()`
- Созданы функции-обертки с суффиксом `Current` для всех API вызовов
- Сохранена обратная совместимость с существующими функциями

### 3. Обновленные компоненты

Все компоненты обновлены для использования новых функций:
- `App.tsx` - использует `getIsRegisteredCurrent`, `registerCurrent`, etc.
- `HomePage.tsx` - использует `getProfileCurrent`, `getVideosCurrent`, etc.
- `BonusPage.tsx` - использует `getReferralsCurrent`, `getReferralUrlCurrent`, etc.

## Как это работает

### Получение данных из Telegram WebApp

1. **botId**: Получается из URL параметров (`?bot_id=123`) или других источников
2. **userId**: Получается из `window.Telegram.WebApp.initDataUnsafe.user.id`

### Fallback для разработки

Если приложение запущено не в Telegram WebApp (например, в браузере), используются значения по умолчанию:
- `BOT_ID`: '7182696236'
- `USER_ID`: '5599145134'

## Использование

### Для новых компонентов

```typescript
import { 
  getIsRegisteredCurrent, 
  getProfileCurrent, 
  doActionCurrent 
} from '../api/api';

// Используйте функции с суффиксом Current
const response = await getIsRegisteredCurrent();
const profile = await getProfileCurrent();
const action = await doActionCurrent({ videoId: 1, action: 'like' });
```

### Для получения ID напрямую

```typescript
import { getCurrentBotId, getCurrentUserId } from '../api/api';

const botId = getCurrentBotId();
const userId = getCurrentUserId();
```

### Для работы с Telegram WebApp

```typescript
import { 
  isTelegramWebApp, 
  initTelegramWebApp, 
  getTelegramData 
} from '../utils/telegram';

// Проверка, что мы в Telegram WebApp
if (isTelegramWebApp()) {
  initTelegramWebApp();
  const data = getTelegramData();
  console.log('Bot ID:', data?.botId);
  console.log('User ID:', data?.userId);
}
```

## Настройка бота

Для корректной работы необходимо настроить бота так, чтобы он передавал `bot_id` в URL при открытии WebApp:

```typescript
// В коде бота при создании кнопки WebApp
const webAppUrl = `https://your-domain.com?bot_id=${botId}`;
```

## Типы TypeScript

Добавлены типы для Telegram WebApp API в `client/src/custom.d.ts`:

- `Window.Telegram.WebApp` - основной объект WebApp
- `initDataUnsafe` - данные инициализации
- `user` - данные пользователя
- `chat` - данные чата

## Обратная совместимость

Все существующие функции API сохранены и продолжают работать. Новые функции с суффиксом `Current` предоставляют автоматическое получение ID.

## Отладка

Для отладки в браузере (не в Telegram):

1. Приложение будет использовать fallback значения
2. Все функции будут работать как раньше
3. В консоли можно увидеть предупреждения о том, что данные не получены из Telegram WebApp

## Безопасность

- Данные из Telegram WebApp проверяются на валидность
- Fallback значения используются только для разработки
- В продакшене рекомендуется настроить валидацию данных от Telegram 