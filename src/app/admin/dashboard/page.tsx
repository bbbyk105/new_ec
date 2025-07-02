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
    <div className="p-4 sm:p-6">
      {/* ヘッダー */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white mb-1 sm:mb-2">
            売上ダッシュボード
          </h1>
          <p className="text-sm sm:text-base text-slate-400">
            ECストアの売上状況を確認できます
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              placeholder="検索"
              className="pl-10 bg-slate-800 border-slate-700 text-white w-full sm:w-64 lg:w-80"
            />
          </div>
          <Button className="bg-emerald-500 hover:bg-emerald-600 w-full sm:w-auto">
            <Download className="w-4 h-4 mr-2" />
            エクスポート
          </Button>
        </div>
      </div>

      {/* 売上KPIカード */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {/* 今日の売上 */}
        <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 border-none">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-start justify-between">
              <div className="w-full">
                <div className="flex items-center space-x-2 mb-2">
                  <CalendarDays className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  <span className="text-white/80 text-xs sm:text-sm">
                    今日の売上
                  </span>
                </div>
                <div className="text-xl sm:text-2xl font-bold text-white mb-1">
                  ¥123,450
                </div>
                <div className="text-white/80 text-xs sm:text-sm">
                  +12%増加 • 2025年6月30日
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 今月の総売上 */}
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 border-none">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-start justify-between">
              <div className="w-full">
                <div className="flex items-center space-x-2 mb-2">
                  <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  <span className="text-white/80 text-xs sm:text-sm">
                    今月の総売上
                  </span>
                </div>
                <div className="text-xl sm:text-2xl font-bold text-white mb-1">
                  ¥2,847,230
                </div>
                <div className="text-white/80 text-xs sm:text-sm">
                  +18%増加 • 2025年6月
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 全体の売上 */}
        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 border-none sm:col-span-2 lg:col-span-1">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-start justify-between">
              <div className="w-full">
                <div className="flex items-center space-x-2 mb-2">
                  <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  <span className="text-white/80 text-xs sm:text-sm">
                    全体の売上
                  </span>
                </div>
                <div className="text-xl sm:text-2xl font-bold text-white mb-1">
                  ¥15,423,890
                </div>
                <div className="text-white/80 text-xs sm:text-sm">
                  累計売上 • 2025年1月〜現在
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* チャートセクション */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {/* 売上グラフ */}
        <Card className="xl:col-span-2 bg-slate-800 border-slate-700">
          <CardHeader className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <CardTitle className="text-white text-lg sm:text-xl">
                売上推移グラフ
              </CardTitle>
              <div className="flex space-x-2">
                <Select defaultValue="2024">
                  <SelectTrigger className="w-20 bg-slate-700 border-slate-600 text-white text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2023">2023</SelectItem>
                    <SelectItem value="2024">2024</SelectItem>
                    <SelectItem value="2025">2025</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue="2025">
                  <SelectTrigger className="w-20 bg-slate-700 border-slate-600 text-white text-sm">
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
          <CardContent className="p-4 sm:p-6 pt-0">
            <ResponsiveContainer
              width="100%"
              height={250}
              className="sm:h-[300px]"
            >
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  dataKey="month"
                  stroke="#9CA3AF"
                  fontSize={12}
                  tick={{ fontSize: 12 }}
                />
                <YAxis stroke="#9CA3AF" fontSize={12} tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                    fontSize: "14px",
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
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-white text-lg sm:text-xl">
              カテゴリ別売上
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <ResponsiveContainer
              width="100%"
              height={180}
              className="sm:h-[200px]"
            >
              <RechartsPieChart>
                <Pie
                  data={orderStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                  className="sm:inner-radius-[60] sm:outer-radius-[80]"
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
                    fontSize: "14px",
                  }}
                />
              </RechartsPieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mt-4">
              {orderStatusData.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-xs sm:text-sm text-slate-400">
                    {item.name}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 商品管理セクション */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* 商品追加 */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <CardTitle className="text-white text-lg sm:text-xl">
                商品管理
              </CardTitle>
              <Button
                size="sm"
                className="bg-emerald-500 hover:bg-emerald-600 w-full sm:w-auto"
              >
                <Plus className="w-4 h-4 mr-2" />
                商品追加
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="aspect-square bg-slate-700 rounded-lg flex items-center justify-center hover:bg-slate-600 cursor-pointer transition-colors"
                >
                  <Plus className="w-6 h-6 sm:w-8 sm:h-8 text-slate-400" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 売上サマリー */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-white text-lg sm:text-xl">
              売上サマリー
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="space-y-3 sm:space-y-4">
              <div className="flex justify-between items-center p-3 bg-slate-700 rounded-lg">
                <span className="text-slate-300 text-sm sm:text-base">
                  平均注文単価
                </span>
                <span className="text-white font-semibold text-sm sm:text-base">
                  ¥4,580
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-700 rounded-lg">
                <span className="text-slate-300 text-sm sm:text-base">
                  今月の注文数
                </span>
                <span className="text-white font-semibold text-sm sm:text-base">
                  621件
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-700 rounded-lg">
                <span className="text-slate-300 text-sm sm:text-base">
                  売上成長率
                </span>
                <span className="text-emerald-400 font-semibold text-sm sm:text-base">
                  +18.2%
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-700 rounded-lg">
                <span className="text-slate-300 text-sm sm:text-base">
                  リピート率
                </span>
                <span className="text-blue-400 font-semibold text-sm sm:text-base">
                  67%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
