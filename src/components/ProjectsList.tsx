
import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "./ui/button";
import { toast } from "./ui/sonner";

const ProjectsList = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('projects')
        .select('*')
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
              <h3 className="text-xl font-bold mb-2">{project.title}</h3>
              {project.location && <p className="text-neutral-600 mb-2">Location: {project.location}</p>}
              {project.description && (
                <p className="text-neutral-600 mb-4 line-clamp-3">{project.description}</p>
              )}
              {project.status && (
                <div className="flex items-center mt-4">
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
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 bg-neutral-50 rounded-lg">
          <p className="text-neutral-600">No projects found. Projects will appear here once created.</p>
        </div>
      )}
    </div>
  );
};

export default ProjectsList;
