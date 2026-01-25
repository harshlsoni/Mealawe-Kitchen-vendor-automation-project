export type UserRole = 'kitchen' | 'admin';

export type TaskStatus = 'queued' | 'processing' | 'reviewed' | 'approved' | 'rejected';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  kitchenId?: string;
  kitchenName?: string;
}

export interface QualityCheck {
  id: string;
  kitchenId: string;
  kitchenName: string;
  dishName: string;
  category: string;
  preparationTime: string;
  imageUrl: string;
  aiScore: number;
  aiIssues: string[];
  status: TaskStatus;
  uploadedAt: string;
  reviewedAt?: string;
  adminFeedback?: string;
  adminDecision?: 'approved' | 'rejected';
  confidence: number;
  priority?: 'high' | 'medium' | 'low';
}

export interface Kitchen {
  id: string;
  name: string;
  location: string;
}

export interface AnalyticsData {
  totalChecks: number;
  approvedChecks: number;
  rejectedChecks: number;
  averageScore: number;
  trendData: Array<{
    date: string;
    approved: number;
    rejected: number;
  }>;
  kitchenPerformance: Array<{
    kitchen: string;
    approved: number;
    rejected: number;
    avgScore: number;
  }>;
  rejectionReasons: Array<{
    reason: string;
    count: number;
  }>;
  avgProcessingTime: number;
}
