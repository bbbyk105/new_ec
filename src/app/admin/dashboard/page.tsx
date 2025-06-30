// app/admin/dashboard/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  TrendingUp,
  Users,
  DollarSign,
  Download,
  Search,
  Plus,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
} from "recharts";

// ダミーデータ
const salesData = [
  { month: "1月", sales: 200000, orders: 400 },
  { month: "2月", sales: 250000, orders: 500 },
  { month: "3月", sales: 300000, orders: 650 },
  { month: "4月", sales: 280000, orders: 580 },
  { month: "5月", sales: 350000, orders: 720 },
  { month: "6月", sales: 320000, orders: 680 },
  { month: "7月", sales: 380000, orders: 780 },
  { month: "8月", sales: 420000, orders: 850 },
  { month: "9月", sales: 450000, orders: 920 },
];

const orderStatusData = [
  { name: "衣類", value: 60, color: "#10B981" },
  { name: "食品", value: 50, color: "#F59E0B" },
  { name: "電化製品", value: 40, color: "#8B5CF6" },
  { name: "その他", value: 30, color: "#06B6D4" },
];

const productAds = [
  { code: "食品 1212", status: "稼働中", color: "bg-green-500" },
  { code: "衣類 4312", status: "稼働中", color: "bg-green-500" },
  { code: "衣類 4313", status: "保留中", color: "bg-yellow-500" },
  { code: "衣類 4314", status: "稼働中", color: "bg-green-500" },
  { code: "衣類 4315", status: "保留中", color: "bg-yellow-500" },
  { code: "衣類 4316", status: "停止", color: "bg-red-500" },
];

export default function DashboardOverview() {
  return (
    <div className="p-6">
      {/* ヘッダー */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">
            ダッシュボード概要
          </h1>
          <p className="text-slate-400">ECストアの運営状況を確認できます</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              placeholder="検索"
              className="pl-10 bg-slate-800 border-slate-700 text-white w-80"
            />
          </div>
          <Button className="bg-emerald-500 hover:bg-emerald-600">
            <Download className="w-4 h-4 mr-2" />
            エクスポート
          </Button>
        </div>
      </div>

      {/* KPIカード */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 border-none">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-white" />
                  <span className="text-white/80 text-sm">総売上</span>
                </div>
                <div className="text-2xl font-bold text-white mb-1">
                  ¥3,423,234
                </div>
                <div className="text-white/80 text-sm">
                  30%増加 • 2025年1月12日
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-400 to-teal-500 border-none">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <Users className="w-5 h-5 text-white" />
                  <span className="text-white/80 text-sm">訪問者数</span>
                </div>
                <div className="text-2xl font-bold text-white mb-1">
                  453,432
                </div>
                <div className="text-white/80 text-sm">
                  70%コンバージョン • 30%離脱
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 border-none">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <DollarSign className="w-5 h-5 text-white" />
                  <span className="text-white/80 text-sm">収益</span>
                </div>
                <div className="text-2xl font-bold text-white mb-1">
                  ¥2,034,320
                </div>
                <div className="text-white/80 text-sm">
                  10%増加 • 2025年1月12日
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* チャートとサイド情報 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* 売上グラフ */}
        <Card className="lg:col-span-2 bg-slate-800 border-slate-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white">売上グラフ</CardTitle>
              <div className="flex space-x-2">
                <Select defaultValue="2024">
                  <SelectTrigger className="w-20 bg-slate-700 border-slate-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2023">2023</SelectItem>
                    <SelectItem value="2024">2024</SelectItem>
                    <SelectItem value="2025">2025</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue="2025">
                  <SelectTrigger className="w-20 bg-slate-700 border-slate-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2024">2024</SelectItem>
                    <SelectItem value="2025">2025</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                  }}
                  labelStyle={{ color: "#FFFFFF" }}
                  itemStyle={{ color: "#10B981" }}
                />
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="#10B981"
                  strokeWidth={3}
                  dot={{ fill: "#10B981", strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* 注文グラフ */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">注文グラフ</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <RechartsPieChart>
                <Pie
                  data={orderStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {orderStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                    color: "#FFFFFF",
                  }}
                />
              </RechartsPieChart>
            </ResponsiveContainer>
            <div className="flex justify-center space-x-4 mt-4">
              {orderStatusData.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-slate-400">{item.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 下部セクション */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 商品追加 */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white">商品追加</CardTitle>
              <Button size="sm" className="bg-slate-700 hover:bg-slate-600">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="aspect-square bg-slate-700 rounded-lg flex items-center justify-center hover:bg-slate-600 cursor-pointer transition-colors"
                >
                  <Plus className="w-8 h-8 text-slate-400" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 商品広告 */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">商品広告</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between text-sm font-medium text-slate-300">
                <span>商品コード</span>
                <span>状態</span>
              </div>
              {productAds.map((ad, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm text-slate-300">{ad.code}</span>
                  <Badge
                    className={`${ad.color} text-white text-xs`}
                    variant="secondary"
                  >
                    {ad.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 顧客情報 */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">顧客情報</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-lime-200 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-slate-900">60%</div>
                <div className="text-sm text-slate-700">女性</div>
              </div>
              <div className="bg-blue-200 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-slate-900">40%</div>
                <div className="text-sm text-slate-700">男性</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
