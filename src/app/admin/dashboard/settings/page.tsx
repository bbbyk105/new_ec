// app/admin/dashboard/settings/page.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Store,
  Bell,
  Shield,
  CreditCard,
  Truck,
  Mail,
  Save,
} from "lucide-react";

export default function SettingsPage() {
  const [notifications, setNotifications] = useState({
    orderNotifications: true,
    stockAlerts: true,
    customerMessages: false,
    promotionalEmails: true,
  });

  const [security, setSecurity] = useState({
    twoFactorAuth: false,
    sessionTimeout: "30",
    ipRestriction: false,
  });

  return (
    <div className="p-6">
      {/* ヘッダー */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">設定</h1>
          <p className="text-slate-400">システムとストアの設定を管理できます</p>
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6 bg-slate-800">
          <TabsTrigger
            value="general"
            className="data-[state=active]:bg-slate-700"
          >
            <Store className="w-4 h-4 mr-2" />
            一般
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="data-[state=active]:bg-slate-700"
          >
            <Bell className="w-4 h-4 mr-2" />
            通知
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="data-[state=active]:bg-slate-700"
          >
            <Shield className="w-4 h-4 mr-2" />
            セキュリティ
          </TabsTrigger>
          <TabsTrigger
            value="payment"
            className="data-[state=active]:bg-slate-700"
          >
            <CreditCard className="w-4 h-4 mr-2" />
            決済
          </TabsTrigger>
          <TabsTrigger
            value="shipping"
            className="data-[state=active]:bg-slate-700"
          >
            <Truck className="w-4 h-4 mr-2" />
            配送
          </TabsTrigger>
          <TabsTrigger
            value="email"
            className="data-[state=active]:bg-slate-700"
          >
            <Mail className="w-4 h-4 mr-2" />
            メール
          </TabsTrigger>
        </TabsList>

        {/* 一般設定 */}
        <TabsContent value="general">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">ストア情報</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="storeName" className="text-slate-300">
                    ストア名
                  </Label>
                  <Input
                    id="storeName"
                    defaultValue="ECストア"
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="storeDescription" className="text-slate-300">
                    ストア説明
                  </Label>
                  <Textarea
                    id="storeDescription"
                    defaultValue="高品質な商品を提供するオンラインストアです。"
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="storeUrl" className="text-slate-300">
                    ストアURL
                  </Label>
                  <Input
                    id="storeUrl"
                    defaultValue="https://my-ec-store.com"
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="currency" className="text-slate-300">
                    通貨
                  </Label>
                  <Select defaultValue="jpy">
                    <SelectTrigger className="bg-slate-700 border-slate-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="jpy">円 (JPY)</SelectItem>
                      <SelectItem value="usd">ドル (USD)</SelectItem>
                      <SelectItem value="eur">ユーロ (EUR)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">連絡先情報</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="contactEmail" className="text-slate-300">
                    メールアドレス
                  </Label>
                  <Input
                    id="contactEmail"
                    defaultValue="contact@my-ec-store.com"
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="contactPhone" className="text-slate-300">
                    電話番号
                  </Label>
                  <Input
                    id="contactPhone"
                    defaultValue="03-1234-5678"
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="address" className="text-slate-300">
                    住所
                  </Label>
                  <Textarea
                    id="address"
                    defaultValue="東京都渋谷区〇〇1-2-3"
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="timezone" className="text-slate-300">
                    タイムゾーン
                  </Label>
                  <Select defaultValue="asia-tokyo">
                    <SelectTrigger className="bg-slate-700 border-slate-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="asia-tokyo">アジア/東京</SelectItem>
                      <SelectItem value="america-new_york">
                        アメリカ/ニューヨーク
                      </SelectItem>
                      <SelectItem value="europe-london">
                        ヨーロッパ/ロンドン
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 通知設定 */}
        <TabsContent value="notifications">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">通知設定</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-medium">注文通知</h3>
                  <p className="text-slate-400 text-sm">
                    新しい注文が入った時に通知を受け取る
                  </p>
                </div>
                <Switch
                  checked={notifications.orderNotifications}
                  onCheckedChange={(checked) =>
                    setNotifications({
                      ...notifications,
                      orderNotifications: checked,
                    })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-medium">在庫アラート</h3>
                  <p className="text-slate-400 text-sm">
                    商品の在庫が少なくなった時に通知を受け取る
                  </p>
                </div>
                <Switch
                  checked={notifications.stockAlerts}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, stockAlerts: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-medium">顧客メッセージ</h3>
                  <p className="text-slate-400 text-sm">
                    顧客からのメッセージを通知する
                  </p>
                </div>
                <Switch
                  checked={notifications.customerMessages}
                  onCheckedChange={(checked) =>
                    setNotifications({
                      ...notifications,
                      customerMessages: checked,
                    })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-medium">
                    プロモーションメール
                  </h3>
                  <p className="text-slate-400 text-sm">
                    マーケティングメールの配信通知
                  </p>
                </div>
                <Switch
                  checked={notifications.promotionalEmails}
                  onCheckedChange={(checked) =>
                    setNotifications({
                      ...notifications,
                      promotionalEmails: checked,
                    })
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* セキュリティ設定 */}
        <TabsContent value="security">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">セキュリティ設定</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-medium">二段階認証</h3>
                  <p className="text-slate-400 text-sm">
                    ログイン時の追加セキュリティ
                  </p>
                </div>
                <Switch
                  checked={security.twoFactorAuth}
                  onCheckedChange={(checked) =>
                    setSecurity({ ...security, twoFactorAuth: checked })
                  }
                />
              </div>
              <div>
                <Label htmlFor="sessionTimeout" className="text-slate-300">
                  セッションタイムアウト（分）
                </Label>
                <Select
                  value={security.sessionTimeout}
                  onValueChange={(value) =>
                    setSecurity({ ...security, sessionTimeout: value })
                  }
                >
                  <SelectTrigger className="bg-slate-700 border-slate-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15分</SelectItem>
                    <SelectItem value="30">30分</SelectItem>
                    <SelectItem value="60">1時間</SelectItem>
                    <SelectItem value="120">2時間</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-medium">IP制限</h3>
                  <p className="text-slate-400 text-sm">
                    特定のIPアドレスからのみアクセスを許可
                  </p>
                </div>
                <Switch
                  checked={security.ipRestriction}
                  onCheckedChange={(checked) =>
                    setSecurity({ ...security, ipRestriction: checked })
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 決済設定 */}
        <TabsContent value="payment">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">決済方法</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                    <span className="text-white">クレジットカード</span>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                    <span className="text-white">PayPal</span>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                    <span className="text-white">銀行振込</span>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                    <span className="text-white">代引き</span>
                    <Switch />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">決済設定</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="taxRate" className="text-slate-300">
                    消費税率（%）
                  </Label>
                  <Input
                    id="taxRate"
                    defaultValue="10"
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="shippingFee" className="text-slate-300">
                    配送料（円）
                  </Label>
                  <Input
                    id="shippingFee"
                    defaultValue="500"
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="freeShippingThreshold"
                    className="text-slate-300"
                  >
                    送料無料の最低金額（円）
                  </Label>
                  <Input
                    id="freeShippingThreshold"
                    defaultValue="5000"
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 配送設定 */}
        <TabsContent value="shipping">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">配送設定</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-white font-medium">配送業者</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                      <span className="text-white">ヤマト運輸</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                      <span className="text-white">佐川急便</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                      <span className="text-white">日本郵便</span>
                      <Switch />
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-white font-medium">配送オプション</h3>
                  <div>
                    <Label htmlFor="processingTime" className="text-slate-300">
                      処理時間（営業日）
                    </Label>
                    <Select defaultValue="1-2">
                      <SelectTrigger className="bg-slate-700 border-slate-600">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1営業日</SelectItem>
                        <SelectItem value="1-2">1-2営業日</SelectItem>
                        <SelectItem value="3-5">3-5営業日</SelectItem>
                        <SelectItem value="1week">1週間</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="shippingZones" className="text-slate-300">
                      配送エリア
                    </Label>
                    <Select defaultValue="nationwide">
                      <SelectTrigger className="bg-slate-700 border-slate-600">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="nationwide">全国</SelectItem>
                        <SelectItem value="limited">限定エリア</SelectItem>
                        <SelectItem value="custom">カスタム設定</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* メール設定 */}
        <TabsContent value="email">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">SMTP設定</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="smtpHost" className="text-slate-300">
                    SMTPホスト
                  </Label>
                  <Input
                    id="smtpHost"
                    placeholder="smtp.gmail.com"
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="smtpPort" className="text-slate-300">
                    SMTPポート
                  </Label>
                  <Input
                    id="smtpPort"
                    placeholder="587"
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="smtpUsername" className="text-slate-300">
                    ユーザー名
                  </Label>
                  <Input
                    id="smtpUsername"
                    placeholder="your-email@gmail.com"
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="smtpPassword" className="text-slate-300">
                    パスワード
                  </Label>
                  <Input
                    id="smtpPassword"
                    type="password"
                    placeholder="••••••••"
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">メールテンプレート</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="fromName" className="text-slate-300">
                    送信者名
                  </Label>
                  <Input
                    id="fromName"
                    defaultValue="ECストア"
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="fromEmail" className="text-slate-300">
                    送信者メールアドレス
                  </Label>
                  <Input
                    id="fromEmail"
                    defaultValue="noreply@my-ec-store.com"
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="replyToEmail" className="text-slate-300">
                    返信先メールアドレス
                  </Label>
                  <Input
                    id="replyToEmail"
                    defaultValue="support@my-ec-store.com"
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">メールテンプレート</Label>
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      className="w-full justify-start border-slate-600 text-slate-300"
                    >
                      注文確認メール
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start border-slate-600 text-slate-300"
                    >
                      配送通知メール
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start border-slate-600 text-slate-300"
                    >
                      パスワードリセットメール
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* 保存ボタン */}
      <div className="flex justify-end space-x-4 mt-8">
        <Button variant="outline" className="border-slate-600 text-slate-300">
          キャンセル
        </Button>
        <Button className="bg-emerald-500 hover:bg-emerald-600">
          <Save className="w-4 h-4 mr-2" />
          設定を保存
        </Button>
      </div>
    </div>
  );
}
