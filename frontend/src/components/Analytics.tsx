import { User } from '../types';
import { mockAnalytics } from '../lib/mockData';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { ArrowLeft, TrendingUp, TrendingDown } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface AnalyticsProps {
  user: User;
  onNavigate: (view: string) => void;
}

export function Analytics({ user, onNavigate }: AnalyticsProps) {
  const data = mockAnalytics;

  const pieData = [
    { name: 'Approved', value: data.approvedChecks, color: '#059669' },
    { name: 'Rejected', value: data.rejectedChecks, color: '#f97316' },
    { name: 'In Review', value: data.totalChecks - data.approvedChecks - data.rejectedChecks, color: '#6b7280' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Button variant="ghost" onClick={() => onNavigate('admin-dashboard')} className="mb-2">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-2xl">Analytics & Reports</h1>
          <p className="text-sm text-muted-foreground">System-wide quality metrics and insights</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Quality Checks</CardDescription>
              <CardTitle className="text-3xl">{data.totalChecks}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-emerald-600">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span>+12% from last week</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Average AI Score</CardDescription>
              <CardTitle className="text-3xl">{data.averageScore}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-emerald-600">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span>+2.3 from last week</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Approval Rate</CardDescription>
              <CardTitle className="text-3xl">
                {Math.round((data.approvedChecks / data.totalChecks) * 100)}%
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-emerald-600">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span>+5% from last week</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Avg Processing Time</CardDescription>
              <CardTitle className="text-3xl">{data.avgProcessingTime}m</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-orange-600">
                <TrendingDown className="w-4 h-4 mr-1" />
                <span>-0.8m from last week</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Quality Trends */}
          <Card>
            <CardHeader>
              <CardTitle>Quality Check Trends (7 Days)</CardTitle>
              <CardDescription>Daily approved vs rejected submissions</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data.trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    stroke="#6b7280"
                  />
                  <YAxis stroke="#6b7280" />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="approved" stroke="#059669" strokeWidth={2} name="Approved" />
                  <Line type="monotone" dataKey="rejected" stroke="#f97316" strokeWidth={2} name="Rejected" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Status Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Status Distribution</CardTitle>
              <CardDescription>Breakdown of all quality checks</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Kitchen Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Kitchen Performance</CardTitle>
              <CardDescription>Average quality scores by kitchen</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.kitchenPerformance}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="kitchen" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip />
                  <Bar dataKey="avgScore" fill="#059669" name="Avg Score" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Rejection Reasons */}
          <Card>
            <CardHeader>
              <CardTitle>Top Rejection Reasons</CardTitle>
              <CardDescription>Most common quality issues identified</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.rejectionReasons} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis type="number" stroke="#6b7280" />
                  <YAxis dataKey="reason" type="category" width={120} stroke="#6b7280" />
                  <Tooltip />
                  <Bar dataKey="count" fill="#f97316" name="Count" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Kitchen Performance Table */}
        <Card>
          <CardHeader>
            <CardTitle>Kitchen Performance Breakdown</CardTitle>
            <CardDescription>Detailed metrics for each kitchen location</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Kitchen</th>
                    <th className="text-right py-3 px-4">Approved</th>
                    <th className="text-right py-3 px-4">Rejected</th>
                    <th className="text-right py-3 px-4">Total</th>
                    <th className="text-right py-3 px-4">Approval Rate</th>
                    <th className="text-right py-3 px-4">Avg Score</th>
                  </tr>
                </thead>
                <tbody>
                  {data.kitchenPerformance.map((kitchen) => {
                    const total = kitchen.approved + kitchen.rejected;
                    const approvalRate = Math.round((kitchen.approved / total) * 100);
                    
                    return (
                      <tr key={kitchen.kitchen} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">{kitchen.kitchen}</td>
                        <td className="text-right py-3 px-4 text-emerald-600">{kitchen.approved}</td>
                        <td className="text-right py-3 px-4 text-orange-600">{kitchen.rejected}</td>
                        <td className="text-right py-3 px-4">{total}</td>
                        <td className="text-right py-3 px-4">
                          <span className={approvalRate >= 80 ? 'text-emerald-600' : approvalRate >= 70 ? 'text-orange-600' : 'text-red-600'}>
                            {approvalRate}%
                          </span>
                        </td>
                        <td className="text-right py-3 px-4">{kitchen.avgScore}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
