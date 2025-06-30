// app/admin/dashboard/analytics/page.tsx
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import {
  TrendingUp,
  Users,
  ShoppingCart,
  DollarSign,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

// ダミーデータ
const salesTrendData = [
  { month: "1月", sales: 2000000, orders: 400, customers: 320 },
  { month: "2月", sales: 2500000, orders: 500, customers: 410 },
  { month: "3月", sales: 3000000, orders: 650, customers: 520 },
  { month: "4月", sales: 2800000, orders: 580, customers: 480 },
  { month: "5月", sales: 3500000, orders: 720, customers: 590 },
  { month: "6月", sales: 3200000, orders: 680, customers: 550 },
];

const categoryPerformanceData = [
  { category: "衣類", sales: 1200000, percentage: 35 },
  { category: "電化製品", sales: 800000, percentage: 23 },
  { category: "アクセサリー", sales: 600000, percentage: 18 },
  { category: "靴", sales: 500000, percentage: 15 },
  { category: "その他", sales: 300000, percentage: 9 },
];

const customerSegmentData = [
  { name: "新規顧客", value: 30, color: "#10B981" },
  { name: "リピーター", value: 45, color: "#F59E0B" },
  { name: "VIP顧客", value: 25, color: "#8B5CF6" },
];

const conversionFunnelData = [
  { stage: "サイト訪問", visitors: 10000, rate: 100 },
  { stage: "商品閲覧", visitors: 7500, rate: 75 },
  { stage: "カート追加", visitors: 3000, rate: 30 },
  { stage: "購入完了", visitors: 900, rate: 9 },
];

const topProductsData = [
  { name: "サマードレス", sales: 450000, units: 120 },
  { name: "デニムジャケット", sales: 380000, units: 95 },
  { name: "コットンTシャツ", sales: 320000, units: 180 },
  { name: "スポーツスニーカー", sales: 280000, units: 75 },
  { name: "ワイヤレスイヤホン", sales: 245000, units: 89 },
];

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("6months");

  const kpis = [
    {
      title: "総売上",
      value: "¥18,400,000",
      change: "+15.2%",
      changeType: "increase",
      icon: DollarSign,
      description: "前月比較",
    },
    {
      title: "注文数",
      value: "4,530",
      change: "+8.7%",
      changeType: "increase",
      icon: ShoppingCart,
      description: "前月比較",
    },
    {
      title: "新規顧客",
      value: "890",
      change: "+23.1%",
      changeType: "increase",
      icon: Users,
      description: "前月比較",
    },
    {
      title: "コンバージョン率",
      value: "2.8%",
      change: "-0.3%",
      changeType: "decrease",
      icon: TrendingUp,
      description: "前月比較",
    },
  ];

  return (
    <div className="p-6">
      {/* ヘッダー */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">
            分析ダッシュボード
          </h1>
          <p className="text-slate-400">
            詳細な分析データと売上パフォーマンスを確認できます
          </p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-48 bg-slate-800 border-slate-700">
            <SelectValue placeholder="期間を選択" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1month">過去1ヶ月</SelectItem>
            <SelectItem value="3months">過去3ヶ月</SelectItem>
            <SelectItem value="6months">過去6ヶ月</SelectItem>
            <SelectItem value="1year">過去1年</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* KPIカード */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {kpis.map((kpi, index) => {
          const Icon = kpi.icon;
          const isIncrease = kpi.changeType === "increase";

          return (
            <Card key={index} className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Icon className="w-5 h-5 text-slate-400" />
                      <span className="text-slate-400 text-sm">
                        {kpi.title}
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">
                      {kpi.value}
                    </div>
                    <div className="flex items-center space-x-1">
                      {isIncrease ? (
                        <ArrowUp className="w-4 h-4 text-green-400" />
                      ) : (
                        <ArrowDown className="w-4 h-4 text-red-400" />
                      )}
                      <span
                        className={`text-sm ${
                          isIncrease ? "text-green-400" : "text-red-400"
                        }`}
                      >
                        {kpi.change}
                      </span>
                      <span className="text-slate-400 text-sm">
                        {kpi.description}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* チャートセクション */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* 売上トレンド */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">売上トレンド</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={salesTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                    color: "#FFFFFF",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke="#10B981"
                  fill="url(#salesGradient)"
                  strokeWidth={2}
                />
                <defs>
                  <linearGradient
                    id="salesGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* カテゴリ別パフォーマンス */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">カテゴリ別売上</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="category" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                    color: "#FFFFFF",
                  }}
                />
                <Bar dataKey="sales" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* 顧客セグメント */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">顧客セグメント</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <RechartsPieChart>
                <Pie
                  data={customerSegmentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {customerSegmentData.map((entry, index) => (
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
            <div className="space-y-2 mt-4">
              {customerSegmentData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm text-slate-300">{item.name}</span>
                  </div>
                  <span className="text-sm text-slate-400">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* コンバージョンファネル */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">コンバージョンファネル</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {conversionFunnelData.map((stage, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-300">
                      {stage.stage}
                    </span>
                    <span className="text-sm text-slate-400">
                      {stage.rate}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div
                      className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${stage.rate}%` }}
                    />
                  </div>
                  <div className="text-xs text-slate-400">
                    {stage.visitors.toLocaleString()}人
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* トップ商品 */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">売上トップ商品</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProductsData.map((product, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">
                        {product.name}
                      </p>
                      <p className="text-xs text-slate-400">
                        {product.units}個販売
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-white">
                      ¥{product.sales.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
