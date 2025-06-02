
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import ProjectsList from '@/components/ProjectsList';
import AddProjectForm from '@/components/AddProjectForm';
import { Button } from '@/components/ui/button';
import { Plus, List } from 'lucide-react';

const ProjectsPage = () => {
  const { user, loading } = useAuth();
  const [view, setView] = useState<'list' | 'add'>('list');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neutral-800 mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const handleProjectAdded = () => {
    setRefreshTrigger(prev => prev + 1);
    setView('list');
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-neutral-800">Project Management</h1>
          
          <div className="flex space-x-2">
            <Button
              onClick={() => setView('list')}
              variant={view === 'list' ? 'default' : 'outline'}
              className="flex items-center space-x-2"
            >
              <List className="w-4 h-4" />
              <span>View Projects</span>
            </Button>
            <Button
              onClick={() => setView('add')}
              variant={view === 'add' ? 'default' : 'outline'}
              className="flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Project</span>
            </Button>
          </div>
        </div>

        {view === 'list' ? (
          <ProjectsList key={refreshTrigger} />
        ) : (
          <AddProjectForm onProjectAdded={handleProjectAdded} />
        )}
      </div>
    </div>
  );
};

export default ProjectsPage;
