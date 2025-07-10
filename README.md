# Turborepo Full-Stack Project

Bu proje, modern web geliştirme için **Turborepo** monorepo yapısı kullanarak **Next.js** frontend ve **NestJS** backend'i birleştiren tam yığın bir uygulamadır.

## 🚀 Teknoloji Yığını

### Frontend (Next.js)

- **Framework**: Next.js 14 (App Router)
- **UI Library**: Mantine UI
- **Styling**: Tailwind CSS
- **TypeScript**: Tam tip güvenliği

### Backend (NestJS)

- **Framework**: NestJS
- **Database**: Prisma ORM
- **Authentication**: Passport.js
  - JWT Strategy
  - JWT Refresh Strategy
  - Local Strategy
- **Validation**: Zod
- **TypeScript**: Tam tip güvenliği

### Monorepo Yapısı

- **Build System**: Turborepo
- **Package Management**: npm workspaces
- **Shared Types**: Ortak tip tanımları

## 📁 Proje Yapısı

```
.
├── apps/
│   ├── backend/          # NestJS API
│   │   ├── src/
│   │   │   ├── auth/     # Authentication modülü
│   │   │   ├── user/     # User modülü
│   │   │   └── database/ # Database konfigürasyonu
│   │   └── prisma/       # Prisma schema ve migrations
│   └── web/              # Next.js frontend
│       ├── app/
│       │   ├── (auth)/   # Auth sayfaları
│       │   │   ├── login/
│       │   │   └── register/
│       │   ├── (user)/   # Kullanıcı sayfaları
│       │   └── (admin)/  # Admin sayfaları
│       └── components/   # UI bileşenleri
├── packages/
│   ├── shared-types/     # Ortak tip tanımları
│   ├── eslint-config/    # ESLint konfigürasyonu
│   └── typescript-config/ # TypeScript konfigürasyonu
└── turbo.json           # Turborepo konfigürasyonu
```

## 🔧 Kurulum

### Gereksinimler

- Node.js 18+
- npm 9+
- PostgreSQL (veya tercih ettiğiniz veritabanı)

### Adımlar

1. **Projeyi klonlayın**

   ```bash
   git clone <repository-url>
   cd turborepo-project
   ```

2. **Bağımlılıkları yükleyin**

   ```bash
   npm install
   ```

3. **Ortam değişkenlerini ayarlayın**

   ```bash
   # Backend için .env dosyası oluşturun
   cd apps/backend
   cp .env.example .env
   # Gerekli değişkenleri düzenleyin
   ```

4. **Veritabanını kurun**

   ```bash
   cd apps/backend
   npx prisma generate
   npx prisma migrate dev
   ```

5. **Geliştirme sunucularını başlatın**
   ```bash
   # Ana dizinden
   npm run dev
   ```

## 🚀 Geliştirme

### Mevcut Komutlar

```bash
# Tüm uygulamaları geliştirme modunda çalıştır
npm run dev

# Tüm uygulamaları build et
npm run build

# Linting kontrolleri
npm run lint

# Tip kontrolleri
npm run type-check
```

### Backend API Endpoints

```
POST /auth/login      # Kullanıcı girişi
POST /auth/register   # Kullanıcı kaydı
POST /auth/refresh    # Token yenileme
```

## 🔐 Authentication Flow

1. **Kayıt/Giriş**: Kullanıcı `/auth/register` veya `/auth/login` sayfasından işlem yapar
2. **JWT Token**: Başarılı authentication sonrası JWT token ve refresh token alır
3. **Token Yenileme**: Access token süresi dolduğunda refresh token ile yeniler
4. **Korumalı Rotalar**: JWT token ile korumalı sayfalara erişim

## 🎨 UI Bileşenleri

### Mevcut Sayfalar

- ✅ **Login Sayfası** (`/auth/login`)
- ✅ **Register Sayfası** (`/auth/register`)
- 🚧 **Dashboard** (geliştirilme aşamasında)
- 🚧 **Admin Panel** (geliştirilme aşamasında)

### Mantine UI Bileşenleri

- Form validasyonu
- Responsive tasarım
- Tema desteği
- Özelleştirilmiş telefon input
- Sosyal medya login butonları

## 🔧 Konfigürasyon

### Turborepo

- **Pipeline**: Build, lint, type-check görevleri
- **Caching**: Hızlı build'ler için akıllı önbellekleme
- **Parallelization**: Çoklu görev paralel çalıştırma

### ESLint & Prettier

- Tutarlı kod formatlaması
- Otomatik kod düzeltme
- Import sıralaması

## 🚀 Deployment

### Backend

```bash
cd apps/backend
npm run build
npm run start:prod
```

### Frontend

```bash
cd apps/web
npm run build
npm run start
```

---

**Proje Durumu**: 🚧 Aktif Geliştirme
