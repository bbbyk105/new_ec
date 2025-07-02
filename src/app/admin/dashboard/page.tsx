"use client";

import { useState, useEffect } from "react";
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
  RefreshCw,
  AlertCircle,
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

// 型定義
interface DashboardData {
  monthlySales: Array<{
    month: string;
    sales: number;
    orders: number;
  }>;
  categoryData: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  kpis: {
    todaySales: number;
    monthlyTotal: number;
    yearlyTotal: number;
    monthlyOrders: number;
    yearlyOrders: number;
    avgOrderValue: number;
    totalSales: number;
    repeatRate: number;
  };
  availableYears: number[];
}

export default function DashboardOverview() {
  // 現在年度をデフォルトにする
  const currentYear = new Date().getFullYear();

  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [selectedYear, setSelectedYear] = useState<number>(currentYear); // 現在年度をデフォルト

  // データ取得関数
  const fetchDashboardData = async (year?: number) => {
    try {
      setLoading(true);
      setError(null);

      const targetYear = year || selectedYear;
      const response = await fetch(`/api/dashboard?year=${targetYear}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        setDashboardData(result.data);
        setLastUpdated(new Date());
      } else {
        throw new Error(result.error || "Failed to fetch data");
      }
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  // 年度変更ハンドラー
  const handleYearChange = (year: string) => {
    const yearNumber = parseInt(year);
    setSelectedYear(yearNumber);
    fetchDashboardData(yearNumber);
  };

  // 初回データ取得
  useEffect(() => {
    fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 手動更新
  const handleRefresh = () => {
    fetchDashboardData();
  };

  // 年度のラベル生成関数
  const getYearLabel = (year: number) => {
    const serviceStartYear = 2025;

    if (year < serviceStartYear) {
      return `${year}年`;
    } else {
      return `${year}年`;
    }
  };

  // エラー状態の表示
  if (error) {
    return (
      <div className="p-4 sm:p-6">
        <Card className="bg-red-900/20 border-red-500/50">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-6 h-6 text-red-400" />
              <div>
                <h3 className="text-lg font-semibold text-red-400">
                  データの取得に失敗しました
                </h3>
                <p className="text-red-300 mt-1">{error}</p>
                <Button
                  onClick={handleRefresh}
                  className="mt-3 bg-red-600 hover:bg-red-700"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  再試行
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ローディング状態の表示
  if (loading || !dashboardData) {
    return (
      <div className="p-4 sm:p-6">
        <div className="animate-pulse">
          {/* ヘッダーのスケルトン */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <div className="h-8 bg-slate-700 rounded w-64 mb-2"></div>
              <div className="h-4 bg-slate-700 rounded w-48"></div>
            </div>
            <div className="flex space-x-4">
              <div className="h-10 bg-slate-700 rounded w-64"></div>
              <div className="h-10 bg-slate-700 rounded w-32"></div>
            </div>
          </div>

          {/* KPIカードのスケルトン */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-slate-700 rounded-lg"></div>
            ))}
          </div>

          {/* チャートのスケルトン */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2 h-96 bg-slate-700 rounded-lg"></div>
            <div className="h-96 bg-slate-700 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      {/* ヘッダー */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white mb-1 sm:mb-2">
            売上ダッシュボード ({getYearLabel(selectedYear)})
          </h1>
          <p className="text-sm sm:text-base text-slate-400">
            ECストアの売上状況を確認できます
          </p>
          <p className="text-xs text-slate-500 mt-1">
            最終更新: {lastUpdated.toLocaleString("ja-JP")}
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
          <div className="flex space-x-2">
            <Button
              onClick={handleRefresh}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <RefreshCw
                className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
              />
              更新
            </Button>
            <Button className="bg-emerald-500 hover:bg-emerald-600">
              <Download className="w-4 h-4 mr-2" />
              エクスポート
            </Button>
          </div>
        </div>
      </div>

      {/* 売上KPIカード */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {/* 当日の売上または選択年度の情報 */}
        <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 border-none">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-start justify-between">
              <div className="w-full">
                <div className="flex items-center space-x-2 mb-2">
                  <CalendarDays className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  <span className="text-white/80 text-xs sm:text-sm">
                    {selectedYear === currentYear
                      ? "当日の売上"
                      : `${selectedYear}年 平均注文単価`}
                  </span>
                </div>
                <div className="text-xl sm:text-2xl font-bold text-white mb-1">
                  {selectedYear === currentYear
                    ? `¥${dashboardData.kpis.todaySales.toLocaleString()}`
                    : `¥${Math.round(
                        dashboardData.kpis.avgOrderValue
                      ).toLocaleString()}`}
                </div>
                <div className="text-white/80 text-xs sm:text-sm">
                  {selectedYear === currentYear
                    ? new Date().toLocaleDateString("ja-JP")
                    : `${selectedYear}年のデータ`}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 月間売上または月平均売上 */}
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 border-none">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-start justify-between">
              <div className="w-full">
                <div className="flex items-center space-x-2 mb-2">
                  <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  <span className="text-white/80 text-xs sm:text-sm">
                    {selectedYear === currentYear
                      ? `${new Date().getMonth() + 1}月の売上`
                      : `${selectedYear}年 月平均売上`}
                  </span>
                </div>
                <div className="text-xl sm:text-2xl font-bold text-white mb-1">
                  ¥
                  {selectedYear === currentYear
                    ? dashboardData.kpis.monthlyTotal.toLocaleString()
                    : Math.round(
                        dashboardData.kpis.yearlyTotal / 12
                      ).toLocaleString()}
                </div>
                <div className="text-white/80 text-xs sm:text-sm">
                  {selectedYear === currentYear
                    ? `${dashboardData.kpis.monthlyOrders.toLocaleString()}件の注文`
                    : `月平均 ${Math.round(
                        dashboardData.kpis.yearlyOrders / 12
                      ).toLocaleString()}件の注文`}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 年間売上 */}
        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 border-none sm:col-span-2 lg:col-span-1">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-start justify-between">
              <div className="w-full">
                <div className="flex items-center space-x-2 mb-2">
                  <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  <span className="text-white/80 text-xs sm:text-sm">
                    {selectedYear}年の売上
                  </span>
                </div>
                <div className="text-xl sm:text-2xl font-bold text-white mb-1">
                  ¥{dashboardData.kpis.yearlyTotal.toLocaleString()}
                </div>
                <div className="text-white/80 text-xs sm:text-sm">
                  {dashboardData.kpis.yearlyOrders.toLocaleString()}件の注文 •
                  リピート率 {dashboardData.kpis.repeatRate}%
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
                {selectedYear}年 売上推移グラフ
              </CardTitle>
              <div className="flex space-x-2">
                <Select
                  value={selectedYear.toString()}
                  onValueChange={handleYearChange}
                >
                  <SelectTrigger className="w-32 bg-slate-700 border-slate-600 text-white text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {dashboardData.availableYears.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {getYearLabel(year)}
                      </SelectItem>
                    ))}
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
              <LineChart data={dashboardData.monthlySales}>
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
                  formatter={(value: number, name: string) => [
                    name === "sales"
                      ? `¥${value.toLocaleString()}`
                      : `${value}件`,
                    name === "sales" ? "売上" : "注文数",
                  ]}
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
              {selectedYear}年 カテゴリ別売上
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
                  data={dashboardData.categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                  className="sm:inner-radius-[60] sm:outer-radius-[80]"
                >
                  {dashboardData.categoryData.map((entry, index) => (
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
                  formatter={(value: number) => [
                    `¥${value.toLocaleString()}k`,
                    "売上",
                  ]}
                />
              </RechartsPieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mt-4">
              {dashboardData.categoryData.map((item, index) => (
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
              {selectedYear}年 売上サマリー
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="space-y-3 sm:space-y-4">
              <div className="flex justify-between items-center p-3 bg-slate-700 rounded-lg">
                <span className="text-slate-300 text-sm sm:text-base">
                  平均注文単価
                </span>
                <span className="text-white font-semibold text-sm sm:text-base">
                  ¥
                  {Math.round(
                    dashboardData.kpis.avgOrderValue
                  ).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-700 rounded-lg">
                <span className="text-slate-300 text-sm sm:text-base">
                  {selectedYear}年の注文数
                </span>
                <span className="text-white font-semibold text-sm sm:text-base">
                  {dashboardData.kpis.yearlyOrders.toLocaleString()}件
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-700 rounded-lg">
                <span className="text-slate-300 text-sm sm:text-base">
                  {selectedYear === currentYear
                    ? "当日の売上"
                    : `${selectedYear}年 最高月売上`}
                </span>
                <span className="text-emerald-400 font-semibold text-sm sm:text-base">
                  {selectedYear === currentYear
                    ? `¥${dashboardData.kpis.todaySales.toLocaleString()}`
                    : `¥${Math.max(
                        ...dashboardData.monthlySales.map((m) => m.sales)
                      ).toLocaleString()}`}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-700 rounded-lg">
                <span className="text-slate-300 text-sm sm:text-base">
                  リピート率
                </span>
                <span className="text-blue-400 font-semibold text-sm sm:text-base">
                  {dashboardData.kpis.repeatRate}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
