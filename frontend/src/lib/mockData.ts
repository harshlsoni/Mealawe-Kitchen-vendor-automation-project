import { QualityCheck, Kitchen, AnalyticsData, User } from '../types';

export const mockKitchens: Kitchen[] = [
  { id: 'k1', name: 'Downtown Kitchen', location: 'New York, NY' },
  { id: 'k2', name: 'Westside Bistro', location: 'Los Angeles, CA' },
  { id: 'k3', name: 'Harbor Kitchen', location: 'Seattle, WA' },
  { id: 'k4', name: 'Central Hub Kitchen', location: 'Chicago, IL' },
];

export const mockUsers: User[] = [
  {
    id: 'u1',
    name: 'Kitchen Manager',
    email: 'kitchen@mealawe.com',
    role: 'kitchen',
    kitchenId: 'k1',
    kitchenName: 'Downtown Kitchen'
  },
  {
    id: 'u2',
    name: 'Quality Admin',
    email: 'admin@mealawe.com',
    role: 'admin'
  }
];

export const mockQualityChecks: QualityCheck[] = [
  {
    id: 'qc1',
    kitchenId: 'k1',
    kitchenName: 'Downtown Kitchen',
    dishName: 'Grilled Salmon with Vegetables',
    category: 'Main Course',
    preparationTime: '2026-01-23T10:30:00',
    imageUrl: 'https://images.unsplash.com/photo-1755811248279-1ab13b7d4384?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb3VybWV0JTIwZm9vZCUyMHBsYXRpbmd8ZW58MXx8fHwxNzY5MDk4Nzk5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    aiScore: 92,
    aiIssues: [],
    status: 'approved',
    uploadedAt: '2026-01-23T10:35:00',
    reviewedAt: '2026-01-23T10:40:00',
    adminFeedback: 'Excellent presentation and portion control',
    adminDecision: 'approved',
    confidence: 94,
    priority: 'low'
  },
  {
    id: 'qc2',
    kitchenId: 'k2',
    kitchenName: 'Westside Bistro',
    dishName: 'Classic Beef Burger',
    category: 'Fast Food',
    preparationTime: '2026-01-23T11:15:00',
    imageUrl: 'https://images.unsplash.com/photo-1637771622300-6f968a373415?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXJnZXIlMjBxdWFsaXR5JTIwY2hlY2t8ZW58MXx8fHwxNzY5MTg2Njg4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    aiScore: 67,
    aiIssues: ['Uneven assembly', 'Lettuce appears wilted'],
    status: 'rejected',
    uploadedAt: '2026-01-23T11:20:00',
    reviewedAt: '2026-01-23T11:25:00',
    adminFeedback: 'Please remake - ingredients not fresh',
    adminDecision: 'rejected',
    confidence: 88,
    priority: 'high'
  },
  {
    id: 'qc3',
    kitchenId: 'k3',
    kitchenName: 'Harbor Kitchen',
    dishName: 'Margherita Pizza',
    category: 'Pizza',
    preparationTime: '2026-01-23T12:00:00',
    imageUrl: 'https://images.unsplash.com/photo-1672856398893-2fb52d807874?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaXp6YSUyMGZyZXNofGVufDF8fHx8MTc2OTE4NjY4OHww&ixlib=rb-4.1.0&q=80&w=1080',
    aiScore: 88,
    aiIssues: ['Slight char on crust edge'],
    status: 'reviewed',
    uploadedAt: '2026-01-23T12:05:00',
    reviewedAt: '2026-01-23T12:10:00',
    confidence: 91,
    priority: 'medium'
  },
  {
    id: 'qc4',
    kitchenId: 'k1',
    kitchenName: 'Downtown Kitchen',
    dishName: 'Penne Arrabiata',
    category: 'Pasta',
    preparationTime: '2026-01-23T12:30:00',
    imageUrl: 'https://images.unsplash.com/photo-1712746784067-e9e1bd86c043?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXN0YSUyMGRpc2glMjByZXN0YXVyYW50fGVufDF8fHx8MTc2OTA2MTQ2NHww&ixlib=rb-4.1.0&q=80&w=1080',
    aiScore: 85,
    aiIssues: [],
    status: 'processing',
    uploadedAt: '2026-01-23T12:35:00',
    confidence: 89,
    priority: 'low'
  },
  {
    id: 'qc5',
    kitchenId: 'k4',
    kitchenName: 'Central Hub Kitchen',
    dishName: 'Caesar Salad Bowl',
    category: 'Salads',
    preparationTime: '2026-01-23T13:00:00',
    imageUrl: 'https://images.unsplash.com/photo-1624340209404-4f479dd59708?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYWxhZCUyMGJvd2wlMjBoZWFsdGh5fGVufDF8fHx8MTc2OTEwNjEzN3ww&ixlib=rb-4.1.0&q=80&w=1080',
    aiScore: 78,
    aiIssues: ['Dressing distribution uneven'],
    status: 'queued',
    uploadedAt: '2026-01-23T13:05:00',
    confidence: 82,
    priority: 'medium'
  },
  {
    id: 'qc6',
    kitchenId: 'k2',
    kitchenName: 'Westside Bistro',
    dishName: 'Grilled Chicken Plate',
    category: 'Main Course',
    preparationTime: '2026-01-23T13:30:00',
    imageUrl: 'https://images.unsplash.com/photo-1762329924239-e204f101fca4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwa2l0Y2hlbiUyMGZvb2R8ZW58MXx8fHwxNzY5MTYzMjY0fDA&ixlib=rb-4.1.0&q=80&w=1080',
    aiScore: 91,
    aiIssues: [],
    status: 'approved',
    uploadedAt: '2026-01-23T13:35:00',
    reviewedAt: '2026-01-23T13:45:00',
    adminFeedback: 'Perfect plating and temperature',
    adminDecision: 'approved',
    confidence: 95,
    priority: 'low'
  }
];

export const mockAnalytics: AnalyticsData = {
  totalChecks: 245,
  approvedChecks: 189,
  rejectedChecks: 42,
  averageScore: 84.5,
  trendData: [
    { date: '2026-01-17', approved: 28, rejected: 5 },
    { date: '2026-01-18', approved: 31, rejected: 7 },
    { date: '2026-01-19', approved: 26, rejected: 4 },
    { date: '2026-01-20', approved: 35, rejected: 8 },
    { date: '2026-01-21', approved: 33, rejected: 6 },
    { date: '2026-01-22', approved: 36, rejected: 12 },
    { date: '2026-01-23', approved: 29, rejected: 5 }
  ],
  kitchenPerformance: [
    { kitchen: 'Downtown Kitchen', approved: 52, rejected: 8, avgScore: 87.2 },
    { kitchen: 'Westside Bistro', approved: 48, rejected: 15, avgScore: 81.5 },
    { kitchen: 'Harbor Kitchen', approved: 45, rejected: 9, avgScore: 85.8 },
    { kitchen: 'Central Hub Kitchen', approved: 44, rejected: 10, avgScore: 83.1 }
  ],
  rejectionReasons: [
    { reason: 'Poor presentation', count: 15 },
    { reason: 'Ingredient freshness', count: 12 },
    { reason: 'Portion size incorrect', count: 8 },
    { reason: 'Temperature issue', count: 4 },
    { reason: 'Missing garnish', count: 3 }
  ],
  avgProcessingTime: 4.2
};
