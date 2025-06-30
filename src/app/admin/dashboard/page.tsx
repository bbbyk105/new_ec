// app/admin/dashboard/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  CalendarDays,
  BarChart3,
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

export default function DashboardOverview() {
  return (
    <div className="p-6">
      {/* ヘッダー */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">
            売上ダッシュボード
          </h1>
          <p className="text-slate-400">ECストアの売上状況を確認できます</p>
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

      {/* 売上KPIカード */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* 今日の売上 */}
        <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 border-none">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <CalendarDays className="w-5 h-5 text-white" />
                  <span className="text-white/80 text-sm">今日の売上</span>
                </div>
                <div className="text-2xl font-bold text-white mb-1">
                  ¥123,450
                </div>
                <div className="text-white/80 text-sm">
                  +12%増加 • 2025年6月30日
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 今月の総売上 */}
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 border-none">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-white" />
                  <span className="text-white/80 text-sm">今月の総売上</span>
                </div>
                <div className="text-2xl font-bold text-white mb-1">
                  ¥2,847,230
                </div>
                <div className="text-white/80 text-sm">
                  +18%増加 • 2025年6月
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 全体の売上 */}
        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 border-none">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <BarChart3 className="w-5 h-5 text-white" />
                  <span className="text-white/80 text-sm">全体の売上</span>
                </div>
                <div className="text-2xl font-bold text-white mb-1">
                  ¥15,423,890
                </div>
                <div className="text-white/80 text-sm">
                  累計売上 • 2025年1月〜現在
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* チャートセクション */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* 売上グラフ */}
        <Card className="lg:col-span-2 bg-slate-800 border-slate-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white">売上推移グラフ</CardTitle>
              <div className="flex space-x-2">
                <Select defaultValue="2024">
                  <SelectTrigger className="w-20 bg-slate-700 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2023">2023</SelectItem>
                    <SelectItem value="2024">2024</SelectItem>
                    <SelectItem value="2025">2025</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue="2025">
                  <SelectTrigger className="w-20 bg-slate-700 border-slate-600 text-white">
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

        {/* カテゴリ別売上グラフ */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">カテゴリ別売上</CardTitle>
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

      {/* 商品管理セクション */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 商品追加 */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white">商品管理</CardTitle>
              <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600">
                <Plus className="w-4 h-4 mr-2" />
                商品追加
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {[1, 2].map((i) => (
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

        {/* 売上サマリー */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">売上サマリー</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-slate-700 rounded-lg">
                <span className="text-slate-300">平均注文単価</span>
                <span className="text-white font-semibold">¥4,580</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-700 rounded-lg">
                <span className="text-slate-300">今月の注文数</span>
                <span className="text-white font-semibold">621件</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-700 rounded-lg">
                <span className="text-slate-300">売上成長率</span>
                <span className="text-emerald-400 font-semibold">+18.2%</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-700 rounded-lg">
                <span className="text-slate-300">リピート率</span>
                <span className="text-blue-400 font-semibold">67%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
