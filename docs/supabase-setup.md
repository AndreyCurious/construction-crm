# Supabase

Supabase предоставляет PostgreSQL, вход пользователей и API. Текущий проект [construction-crm](https://supabase.com/dashboard/project/zftcfwujzmldxbzbnszk) уже настроен и заполнен. Тариф Free, регион `eu-central-1`.

## Локальные настройки

| Файл                   | Содержимое                                |
| ---------------------- | ----------------------------------------- |
| `.env.local`           | URL проекта и публичный ключ приложения   |
| `.env.seed`            | Административный ключ для заполнения базы |
| `.env.provisioning`    | Пароль базы текущего проекта              |
| `demo-credentials.txt` | Доступы постановщика и двух исполнителей  |

Все четыре файла исключены из Git. В переменные `VITE_*` разрешён только публичный publishable/anon key; secret/service_role даёт административный доступ.

## Подключить приложение к существующему проекту

Скопируйте `.env.example` в `.env.local` и заполните:

```dotenv
VITE_DATA_SOURCE=supabase
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLIC_KEY
```

Для текущей базы Project URL — `https://zftcfwujzmldxbzbnszk.supabase.co`. Перезапустите `npm run dev` после изменения окружения.

## Развернуть новую пустую базу

1. Создайте проект в организации на тарифе Free.
2. Примените единственную начальную миграцию и настройки через CLI 3.0.0:

```sh
npx supabase@3.0.0 login
npx supabase@3.0.0 link YOUR_PROJECT_REF
npx supabase@3.0.0 db push --remote
npx supabase@3.0.0 config diff --remote
npx supabase@3.0.0 config push --remote
```

Конфигурация оставляет вход по email/password включённым, запрещает регистрацию и анонимный вход. Схема `private` не должна быть доступна через Data API. Перед `config push` задайте свой адрес приложения в `auth.site_url` и проверьте показанные изменения.

3. Скопируйте `.env.seed.example` в `.env.seed`. Заполните URL, публичный и административный ключи проекта. Пустой `DEMO_PASSWORD` означает случайный пароль; собственный должен содержать минимум 12 символов.
4. Выполните `npm run seed:demo`. Скрипт создаст три аккаунта, три объекта и шесть задач. Роли назначит административный клиент, доступы сохранит в `demo-credentials.txt`.
5. Заполните `.env.local` и пройдите [приёмку](acceptance.md).

Заполнение предназначено для пустой базы и не имеет автоматического отката. После частичного сбоя сохраните файл доступов и проверьте созданные записи перед повторным запуском.
