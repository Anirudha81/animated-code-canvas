
import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { Heart } from "lucide-react";
import ProjectInterestForm from "./ProjectInterestForm";

const ProjectsList = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [showInterestForm, setShowInterestForm] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          project_images (
            id,
            image_url
          ),
          profiles!projects_client_id_fkey (
            full_name
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }

      if (data) {
        setProjects(data);
        console.log("Projects fetched:", data);
      }
    } catch (error: any) {
      console.error("Error fetching projects:", error.message);
      toast.error("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  const handleInterestClick = (project: any) => {
    setSelectedProject(project);
    setShowInterestForm(true);
  };

  const handleCloseInterestForm = () => {
    setShowInterestForm(false);
    setSelectedProject(null);
  };

  return (
    <div className="py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-neutral-800">Our Current Projects</h2>
        <Button 
          onClick={fetchProjects} 
          variant="outline" 
          disabled={loading}
        >
          {loading ? "Loading..." : "Refresh Projects"}
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-10">Loading projects...</div>
      ) : projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div 
              key={project.id} 
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              {project.project_images && project.project_images.length > 0 && (
                <div className="mb-4">
                  <img 
                    src={project.project_images[0].image_url} 
                    alt={project.title}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  {project.project_images.length > 1 && (
                    <p className="text-sm text-neutral-500 mt-1">
                      +{project.project_images.length - 1} more images
                    </p>
                  )}
                </div>
              )}
              
              <h3 className="text-xl font-bold mb-2">{project.title}</h3>
              {project.location && <p className="text-neutral-600 mb-2">Location: {project.location}</p>}
              {project.description && (
                <p className="text-neutral-600 mb-4 line-clamp-3">{project.description}</p>
              )}
              {project.budget && (
                <p className="text-neutral-600 mb-2">Budget: ${project.budget.toLocaleString()}</p>
              )}
              {project.profiles && (
                <p className="text-neutral-600 mb-2">Owner: {project.profiles.full_name}</p>
              )}
              {project.status && (
                <div className="flex items-center mb-4">
                  <span className="text-sm font-medium mr-2">Status:</span>
                  <span className={`text-sm px-2 py-1 rounded ${
                    project.status === 'completed' ? 'bg-green-100 text-green-800' : 
                    project.status === 'in_progress' ? 'bg-blue-100 text-blue-800' : 
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {project.status.replace('_', ' ')}
                  </span>
                </div>
              )}
              
              {user && (
                <Button 
                  onClick={() => handleInterestClick(project)}
                  className="w-full flex items-center justify-center space-x-2"
                  variant="outline"
                >
                  <Heart className="w-4 h-4" />
                  <span>I'm Interested</span>
                </Button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 bg-neutral-50 rounded-lg">
          <p className="text-neutral-600">No projects found. Projects will appear here once created.</p>
        </div>
      )}

      {selectedProject && (
        <ProjectInterestForm
          isOpen={showInterestForm}
          onClose={handleCloseInterestForm}
          projectId={selectedProject.id}
          projectTitle={selectedProject.title}
          projectOwnerEmail={selectedProject.profiles?.email}
        />
      )}
    </div>
  );
};

export default ProjectsList;
