import { useState } from 'react';
import { User, QualityCheck } from '../types';
import { mockQualityChecks } from '../lib/mockData';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { Separator } from './ui/separator';
import { ArrowLeft, CheckCircle2, XCircle, Clock, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner@2.0.3';

interface TaskDetailViewProps {
  user: User;
  taskId: string;
  onNavigate: (view: string) => void;
}

export function TaskDetailView({ user, taskId, onNavigate }: TaskDetailViewProps) {
  const task = mockQualityChecks.find(t => t.id === taskId);
  const [feedback, setFeedback] = useState(task?.adminFeedback || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!task) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Task not found</p>
            <Button
              onClick={() => onNavigate(user.role === 'admin' ? 'admin-dashboard' : 'kitchen-dashboard')}
              className="mt-4"
            >
              Return to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleApprove = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      toast.success('Quality check approved');
      setIsSubmitting(false);
      onNavigate('admin-dashboard');
    }, 1000);
  };

  const handleReject = () => {
    if (!feedback.trim()) {
      toast.error('Please provide feedback before rejecting');
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      toast.success('Quality check rejected with feedback');
      setIsSubmitting(false);
      onNavigate('admin-dashboard');
    }, 1000);
  };

  const getStatusTimeline = () => {
    const timeline = [
      { label: 'Queued', time: task.uploadedAt, active: true },
      { label: 'Processing', time: task.uploadedAt, active: ['processing', 'reviewed', 'approved', 'rejected'].includes(task.status) },
      { label: 'Reviewed', time: task.reviewedAt, active: ['reviewed', 'approved', 'rejected'].includes(task.status) },
      { label: task.status === 'approved' ? 'Approved' : task.status === 'rejected' ? 'Rejected' : 'Closed', time: task.reviewedAt, active: ['approved', 'rejected'].includes(task.status) }
    ];
    return timeline;
  };

  const isAdmin = user.role === 'admin';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Button
            variant="ghost"
            onClick={() => onNavigate(isAdmin ? 'admin-dashboard' : 'kitchen-dashboard')}
            className="mb-2"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl">{task.dishName}</h1>
              <p className="text-sm text-muted-foreground">{task.kitchenName} • {task.category}</p>
            </div>
            <Badge
              variant={task.status === 'approved' ? 'default' : task.status === 'rejected' ? 'destructive' : 'outline'}
              className={task.status === 'approved' ? 'bg-emerald-600' : ''}
            >
              {task.status.toUpperCase()}
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Image and AI Analysis */}
          <div className="lg:col-span-2 space-y-6">
            {/* Food Image */}
            <Card>
              <CardContent className="p-0">
                <img
                  src={task.imageUrl}
                  alt={task.dishName}
                  className="w-full h-96 object-cover rounded-t-lg"
                />
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Preparation Time</p>
                      <p>{format(new Date(task.preparationTime), 'MMM dd, yyyy HH:mm')}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Uploaded</p>
                      <p>{format(new Date(task.uploadedAt), 'MMM dd, yyyy HH:mm')}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AI Analysis */}
            <Card>
              <CardHeader>
                <CardTitle>AI Quality Analysis</CardTitle>
                <CardDescription>Automated quality assessment results</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">AI Quality Score</p>
                    <p className="text-3xl font-medium">{task.aiScore}/100</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground mb-1">Confidence Level</p>
                    <p className="text-3xl font-medium">{task.confidence}%</p>
                  </div>
                </div>

                {task.aiIssues.length > 0 ? (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-orange-900 mb-2">Detected Issues</p>
                        <ul className="space-y-1">
                          {task.aiIssues.map((issue, idx) => (
                            <li key={idx} className="text-sm text-orange-800">• {issue}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      <p className="text-sm text-emerald-800">No quality issues detected by AI</p>
                    </div>
                  </div>
                )}

                <Separator />

                <div>
                  <h4 className="font-medium mb-3">AI Explanation</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    The AI model analyzed this dish based on presentation quality, portion consistency,
                    ingredient freshness indicators, and adherence to plating standards. The confidence
                    score indicates how certain the model is about its assessment.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Admin Feedback (if exists) */}
            {task.adminFeedback && (
              <Card className="border-blue-200 bg-blue-50">
                <CardHeader>
                  <CardTitle className="text-blue-900">Admin Feedback</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-blue-800">{task.adminFeedback}</p>
                  {task.reviewedAt && (
                    <p className="text-sm text-blue-600 mt-2">
                      Reviewed on {format(new Date(task.reviewedAt), 'MMM dd, yyyy HH:mm')}
                    </p>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Actions and Timeline */}
          <div className="space-y-6">
            {/* Admin Review Panel */}
            {isAdmin && !['approved', 'rejected'].includes(task.status) && (
              <Card>
                <CardHeader>
                  <CardTitle>Review & Decide</CardTitle>
                  <CardDescription>Provide feedback and make a decision</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Feedback</label>
                    <Textarea
                      placeholder="Enter your feedback for the kitchen team..."
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      rows={4}
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <Button
                      onClick={handleApprove}
                      disabled={isSubmitting}
                      className="bg-emerald-600 hover:bg-emerald-700"
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Approve Quality Check
                    </Button>
                    <Button
                      onClick={handleReject}
                      disabled={isSubmitting}
                      variant="destructive"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject Quality Check
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Status Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Status Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {getStatusTimeline().map((step, idx) => (
                    <div key={idx} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            step.active
                              ? 'bg-emerald-600 text-white'
                              : 'bg-gray-200 text-gray-400'
                          }`}
                        >
                          {step.active ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                        </div>
                        {idx < getStatusTimeline().length - 1 && (
                          <div
                            className={`w-0.5 h-12 ${
                              step.active ? 'bg-emerald-600' : 'bg-gray-200'
                            }`}
                          />
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <p className={`font-medium ${step.active ? '' : 'text-muted-foreground'}`}>
                          {step.label}
                        </p>
                        {step.time && (
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(step.time), 'MMM dd, HH:mm')}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Task Info */}
            <Card>
              <CardHeader>
                <CardTitle>Task Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Task ID</p>
                  <p className="font-mono">{task.id}</p>
                </div>
                <Separator />
                <div>
                  <p className="text-muted-foreground">Kitchen</p>
                  <p>{task.kitchenName}</p>
                </div>
                <Separator />
                <div>
                  <p className="text-muted-foreground">Category</p>
                  <p>{task.category}</p>
                </div>
                <Separator />
                <div>
                  <p className="text-muted-foreground">Priority</p>
                  <Badge variant="outline" className="mt-1">
                    {task.priority || 'medium'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
