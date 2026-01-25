import { useState } from 'react';
import { User } from './types';
import { Login } from './components/Login';
import { KitchenDashboard } from './components/KitchenDashboard';
import { UploadScreen } from './components/UploadScreen';
import { AdminDashboard } from './components/AdminDashboard';
import { TaskDetailView } from './components/TaskDetailView';
import { Analytics } from './components/Analytics';
import { Toaster } from './components/ui/sonner';

type View = 'login' | 'kitchen-dashboard' | 'upload' | 'admin-dashboard' | 'task-detail' | 'analytics';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<View>('login');
  const [selectedTaskId, setSelectedTaskId] = useState<string>('');

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setCurrentView(user.role === 'admin' ? 'admin-dashboard' : 'kitchen-dashboard');
  };

  const handleNavigate = (view: string, taskId?: string) => {
    setCurrentView(view as View);
    if (taskId) {
      setSelectedTaskId(taskId);
    }
  };

  if (!currentUser) {
    return (
      <>
        <Login onLogin={handleLogin} />
        <Toaster />
      </>
    );
  }

  return (
    <>
      {currentView === 'kitchen-dashboard' && (
        <KitchenDashboard user={currentUser} onNavigate={handleNavigate} />
      )}
      {currentView === 'upload' && (
        <UploadScreen user={currentUser} onNavigate={handleNavigate} />
      )}
      {currentView === 'admin-dashboard' && (
        <AdminDashboard user={currentUser} onNavigate={handleNavigate} />
      )}
      {currentView === 'task-detail' && (
        <TaskDetailView user={currentUser} taskId={selectedTaskId} onNavigate={handleNavigate} />
      )}
      {currentView === 'analytics' && (
        <Analytics user={currentUser} onNavigate={handleNavigate} />
      )}
      <Toaster />
    </>
  );
}
