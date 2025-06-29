# ECサイト管理システム

管理者専用のECサイト管理システムです。商品の追加・編集・削除などを行える管理画面を提供します。

## 🚀 プロジェクト概要

このプロジェクトは、管理者のみがアクセス可能なECサイトの管理システムです。セキュアな認証機能と直感的な管理画面を提供し、商品管理を効率的に行うことができます。

### 特徴

- **管理者専用システム**: 新規登録は無効化されており、管理者のみがアクセス可能
- **セキュアな認証**: NextAuthを使用したCredentials認証
- **モダンなUI**: shadcn/ui + Tailwind CSSによる美しいデザイン
- **型安全性**: TypeScriptによる完全な型サポート
- **高速データベース**: Prisma + PostgreSQL (Prisma Accelerate対応)
- **SEO対応**: 管理画面は検索エンジンからの除外設定済み

## 🛠 技術構成

### フロントエンド
- **Next.js 15** - React フレームワーク
- **TypeScript** - 型安全な開発
- **Tailwind CSS** - ユーティリティファーストCSS
- **shadcn/ui** - モダンなUIコンポーネント
- **Lucide React** - アイコンライブラリ

### バックエンド
- **NextAuth.js** - 認証ライブラリ
- **Prisma ORM** - データベースアクセス
- **PostgreSQL** - データベース (Prisma Postgres)
- **bcryptjs** - パスワードハッシュ化

### デプロイメント・ツール
- **Prisma Accelerate** - データベース接続プール・キャッシュ
- **ESLint** - コード品質管理
- **Prettier** - コードフォーマット

## 📦 データベース設計

### 主要なテーブル

#### Users（管理者）
- 管理者アカウント情報
- ロールベースのアクセス制御

#### Products（商品）
- 商品名、説明、価格
- 在庫管理
- 画像URL
- アクティブ状態の管理

#### Sessions & Accounts
- NextAuth.jsによる認証情報管理

## 🚦 セットアップ手順

### 1. 環境要件
- Node.js 18.18.0 以上
- npm または yarn

### 2. プロジェクトのクローン
```bash
git clone <repository-url>
cd my_ec_site
```

### 3. パッケージインストール
```bash
npm install
```

### 4. 環境変数の設定
`.env.local`ファイルを作成：
```bash
DATABASE_URL="your-prisma-postgres-url"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-generated-secret-key"
```

### 5. データベースのセットアップ
```bash
# マイグレーション実行
npx prisma migrate dev --name init

# Prismaクライアント生成
npx prisma generate

# 管理者アカウント作成
npm run setup:admin
```

### 6. 開発サーバー起動
```bash
npm run dev
```

## 🔐 初回ログイン

管理者アカウントが自動作成されます：

- **URL**: `http://localhost:3000/admin/login`
- **Email**: `admin@example.com`
- **Password**: `admin123`

> ⚠️ **重要**: 本番環境では必ずパスワードを変更してください

## 📁 プロジェクト構造

```
my_ec_site/
├── src/
│   ├── app/
│   │   ├── admin/
│   │   │   ├── login/           # ログインページ
│   │   │   └── dashboard/       # 管理ダッシュボード
│   │   ├── api/
│   │   │   └── auth/            # NextAuth APIルート
│   │   ├── layout.tsx           # ルートレイアウト
│   │   └── providers.tsx        # セッションプロバイダー
│   ├── components/
│   │   └── ui/                  # shadcn/uiコンポーネント
│   ├── lib/
│   │   ├── auth.ts              # NextAuth設定
│   │   └── prisma.ts            # Prismaクライアント
│   └── types/
│       └── next-auth.d.ts       # NextAuth型定義
├── prisma/
│   └── schema.prisma            # データベーススキーマ
├── scripts/
│   └── setup-admin.ts           # 管理者アカウント作成
└── middleware.ts                # 認証ミドルウェア
```

## 🎯 機能概要

### 現在の機能
- ✅ 管理者ログイン・ログアウト
- ✅ セッション管理
- ✅ セキュアなルーティング
- ✅ レスポンシブデザイン

### 今後実装予定の機能
- 🔄 商品の追加・編集・削除
- 🔄 商品一覧・検索・フィルタリング
- 🔄 在庫管理
- 🔄 注文管理
- 🔄 売上統計・ダッシュボード
- 🔄 画像アップロード機能

## 🛡 セキュリティ機能

- **認証必須**: 全ての管理画面は認証が必要
- **ロールベース**: ADMINロールのみアクセス可能
- **新規登録無効**: 管理者以外の登録を防止
- **パスワードハッシュ化**: bcryptjsによる安全なパスワード保存
- **セッション管理**: JWTベースのセキュアなセッション
- **SEO除外**: 管理画面の検索エンジンクロール無効化

## 📝 利用可能なスクリプト

```bash
# 開発サーバー起動
npm run dev

# 本番ビルド
npm run build

# 本番サーバー起動
npm run start

# リンター実行
npm run lint

# Prismaクライアント生成
npm run db:generate

# データベーススキーマ同期
npm run db:push

# マイグレーション実行
npm run db:migrate

# Prisma Studio起動
npm run db:studio

# 管理者アカウント作成
npm run setup:admin
```

## 🤝 コントリビューション

1. このリポジトリをフォーク
2. フィーチャーブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add some amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## 📄 ライセンス

このプロジェクトはMITライセンスの下で公開されています。

## 🆘 トラブルシューティング

### よくある問題

**Node.jsバージョンエラー**
```bash
# Node.js 18.18.0以上にアップデート
nvm install 18.18.0
nvm use 18.18.0
```

**データベース接続エラー**
- `.env.local`の`DATABASE_URL`を確認
- Prisma Postgresの接続状況を確認

**認証エラー**
- `NEXTAUTH_SECRET`が設定されているか確認
- 管理者アカウントが作成されているか確認

## 📞 サポート

問題や質問がある場合は、以下の方法でお気軽にお問い合わせください：

- GitHub Issues
- Pull Requests

---

**開発者**: あなたの名前  
**最終更新**: 2025年6月29日
