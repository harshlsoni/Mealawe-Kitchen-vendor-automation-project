import { useState } from 'react';
import { User, QualityCheck, TaskStatus } from '../types';
import { mockQualityChecks } from '../lib/mockData';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { CheckCircle2, XCircle, Clock, Eye, Filter, BarChart3 } from 'lucide-react';
import { format } from 'date-fns';

interface AdminDashboardProps {
  user: User;
  onNavigate: (view: string, taskId?: string) => void;
}

export function AdminDashboard({ user, onNavigate }: AdminDashboardProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [kitchenFilter, setKitchenFilter] = useState<string>('all');
  const [tasks, setTasks] = useState<QualityCheck[]>(mockQualityChecks);

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.dishName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.kitchenName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    const matchesKitchen = kitchenFilter === 'all' || task.kitchenName === kitchenFilter;
    return matchesSearch && matchesStatus && matchesKitchen;
  });

  const stats = {
    total: tasks.length,
    pending: tasks.filter(t => ['queued', 'processing', 'reviewed'].includes(t.status)).length,
    approved: tasks.filter(t => t.status === 'approved').length,
    rejected: tasks.filter(t => t.status === 'rejected').length
  };

  const uniqueKitchens = Array.from(new Set(tasks.map(t => t.kitchenName)));

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: any; icon: any; label: string }> = {
      approved: { variant: 'default', icon: CheckCircle2, label: 'Approved' },
      rejected: { variant: 'destructive', icon: XCircle, label: 'Rejected' },
      reviewed: { variant: 'secondary', icon: Eye, label: 'Reviewed' },
      processing: { variant: 'outline', icon: Clock, label: 'Processing' },
      queued: { variant: 'outline', icon: Clock, label: 'Queued' }
    };
    
    const config = variants[status] || variants.queued;
    const Icon = config.icon;
    
    return (
      <Badge variant={config.variant} className={status === 'approved' ? 'bg-emerald-600' : ''}>
        <Icon className="w-3 h-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const getPriorityBadge = (priority?: string) => {
    if (!priority) return null;
    
    const colors = {
      high: 'bg-red-100 text-red-700 border-red-200',
      medium: 'bg-orange-100 text-orange-700 border-orange-200',
      low: 'bg-gray-100 text-gray-700 border-gray-200'
    };
    
    return (
      <Badge variant="outline" className={colors[priority as keyof typeof colors]}>
        {priority}
      </Badge>
    );
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    if (score >= 70) return 'bg-orange-100 text-orange-700 border-orange-200';
    return 'bg-red-100 text-red-700 border-red-200';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl text-emerald-600">Mealawe Admin</h1>
              <p className="text-sm text-muted-foreground">Quality Control Dashboard</p>
            </div>
            <Button onClick={() => onNavigate('analytics')} variant="outline">
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Tasks</CardDescription>
              <CardTitle className="text-3xl">{stats.total}</CardTitle>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Pending Review</CardDescription>
              <CardTitle className="text-3xl text-orange-600">{stats.pending}</CardTitle>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Approved</CardDescription>
              <CardTitle className="text-3xl text-emerald-600">{stats.approved}</CardTitle>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Rejected</CardDescription>
              <CardTitle className="text-3xl text-red-600">{stats.rejected}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <Input
                  placeholder="Search by dish name or kitchen..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="queued">Queued</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="reviewed">Reviewed</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
              <Select value={kitchenFilter} onValueChange={setKitchenFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Kitchens" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Kitchens</SelectItem>
                  {uniqueKitchens.map(kitchen => (
                    <SelectItem key={kitchen} value={kitchen}>{kitchen}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Task Queue */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredTasks.length === 0 ? (
            <Card className="col-span-full">
              <CardContent className="py-12 text-center text-muted-foreground">
                No tasks found matching your filters.
              </CardContent>
            </Card>
          ) : (
            filteredTasks.map((task) => (
              <Card key={task.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onNavigate('task-detail', task.id)}>
                <CardContent className="p-0">
                  {/* Image Preview */}
                  <div className="relative h-48 bg-gray-100">
                    <img
                      src={task.imageUrl}
                      alt={task.dishName}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3 flex gap-2">
                      {getPriorityBadge(task.priority)}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 space-y-3">
                    <div>
                      <h3 className="font-medium mb-1">{task.dishName}</h3>
                      <p className="text-sm text-muted-foreground">{task.kitchenName}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={getScoreColor(task.aiScore)}>
                        AI Score: {task.aiScore}/100
                      </Badge>
                      {getStatusBadge(task.status)}
                    </div>

                    {task.aiIssues.length > 0 && (
                      <div className="bg-orange-50 border border-orange-200 rounded-lg p-2">
                        <p className="text-xs font-medium text-orange-900 mb-1">AI Detected Issues:</p>
                        <ul className="text-xs text-orange-800 space-y-0.5">
                          {task.aiIssues.map((issue, idx) => (
                            <li key={idx}>• {issue}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2 border-t text-xs text-muted-foreground">
                      <span>{format(new Date(task.uploadedAt), 'MMM dd, HH:mm')}</span>
                      <span>Confidence: {task.confidence}%</span>
                    </div>

                    <Button
                      className="w-full bg-emerald-600 hover:bg-emerald-700"
                      onClick={() => onNavigate('task-detail', task.id)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Review Task
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
