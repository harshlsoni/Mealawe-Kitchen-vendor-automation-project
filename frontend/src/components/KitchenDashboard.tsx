import { useState } from 'react';
import { User, QualityCheck } from '../types';
import { mockQualityChecks } from '../lib/mockData';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { CheckCircle2, XCircle, Clock, Upload, Eye, BarChart3 } from 'lucide-react';
import { format } from 'date-fns';

interface KitchenDashboardProps {
  user: User;
  onNavigate: (view: string, taskId?: string) => void;
}

export function KitchenDashboard({ user, onNavigate }: KitchenDashboardProps) {
  const kitchenChecks = mockQualityChecks.filter(qc => qc.kitchenId === user.kitchenId);
  
  const stats = {
    total: kitchenChecks.length,
    approved: kitchenChecks.filter(qc => qc.status === 'approved').length,
    rejected: kitchenChecks.filter(qc => qc.status === 'rejected').length,
    inReview: kitchenChecks.filter(qc => ['queued', 'processing', 'reviewed'].includes(qc.status)).length
  };

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

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-emerald-600';
    if (score >= 70) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl text-emerald-600">Mealawe</h1>
              <p className="text-sm text-muted-foreground">{user.kitchenName}</p>
            </div>
            <Button onClick={() => onNavigate('upload')} className="bg-emerald-600 hover:bg-emerald-700">
              <Upload className="w-4 h-4 mr-2" />
              Upload Quality Check
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
              <CardDescription>Total Submissions</CardDescription>
              <CardTitle className="text-3xl">{stats.total}</CardTitle>
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
              <CardTitle className="text-3xl text-orange-600">{stats.rejected}</CardTitle>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>In Review</CardDescription>
              <CardTitle className="text-3xl text-gray-600">{stats.inReview}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Recent Quality Checks */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Quality Checks</CardTitle>
            <CardDescription>Track the status of your submitted quality checks</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Dish Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Upload Time</TableHead>
                  <TableHead>AI Score</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Feedback</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {kitchenChecks.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                      No quality checks yet. Upload your first sample to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  kitchenChecks.map((check) => (
                    <TableRow key={check.id}>
                      <TableCell>{check.dishName}</TableCell>
                      <TableCell>{check.category}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {format(new Date(check.uploadedAt), 'MMM dd, HH:mm')}
                      </TableCell>
                      <TableCell>
                        <span className={getScoreColor(check.aiScore)}>
                          {check.aiScore}/100
                        </span>
                      </TableCell>
                      <TableCell>{getStatusBadge(check.status)}</TableCell>
                      <TableCell>
                        {check.adminFeedback ? (
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            Has feedback
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground text-sm">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onNavigate('task-detail', check.id)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
