
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Project, UserRole, ProjectWithDetails, Profile } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { MoreHorizontal, Plus, Calendar, MapPin, DollarSign, User } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const Dashboard = () => {
  const { session } = useAuth();
  const { toast } = useToast();
  const [projects, setProjects] = useState<ProjectWithDetails[]>([]);
  const [loading, setLoading] = useState(true);

  const userRole = session?.profile?.role as UserRole;

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        let query = supabase.from("projects").select(`
          *,
          client:profiles!projects_client_id_fkey(*),
          contractor:profiles!projects_contractor_id_fkey(*)
        `);

        // Apply role-based filtering
        if (userRole === "client") {
          query = query.eq("client_id", session?.user.id);
        } else if (userRole === "contractor") {
          query = query.eq("contractor_id", session?.user.id);
        }
        // Admin can see all projects

        const { data, error } = await query.order("updated_at", { ascending: false });

        if (error) {
          throw error;
        }

        setProjects(data as ProjectWithDetails[] || []);
      } catch (error: any) {
        toast({
          title: "Error fetching projects",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchProjects();
    }
  }, [session, userRole, toast]);

  // Setup realtime subscription
  useEffect(() => {
    if (!session) return;

    const channel = supabase
      .channel("projects-changes")
      .on("postgres_changes", 
        { 
          event: "*", 
          schema: "public", 
          table: "projects" 
        }, 
        (payload) => {
          console.log("Realtime update:", payload);
          
          // Handle the different types of changes
          if (payload.eventType === "INSERT") {
            // Check if this project is relevant to the current user based on role
            const newProject = payload.new as Project;
            
            if (
              userRole === "admin" || 
              (userRole === "client" && newProject.client_id === session.user.id) ||
              (userRole === "contractor" && newProject.contractor_id === session.user.id)
            ) {
              // Fetch the complete project with relations
              supabase
                .from("projects")
                .select(`
                  *,
                  client:profiles!projects_client_id_fkey(*),
                  contractor:profiles!projects_contractor_id_fkey(*)
                `)
                .eq("id", newProject.id)
                .single()
                .then(({ data }) => {
                  if (data) {
                    setProjects(prev => [data as ProjectWithDetails, ...prev]);
                  }
                });
            }
          } else if (payload.eventType === "UPDATE") {
            const updatedProject = payload.new as Project;
            
            // Update the project in state
            setProjects(prev => 
              prev.map(p => 
                p.id === updatedProject.id 
                  ? { ...p, ...updatedProject } 
                  : p
              )
            );
          } else if (payload.eventType === "DELETE") {
            const deletedId = payload.old.id;
            // Remove the project from state
            setProjects(prev => prev.filter(p => p.id !== deletedId));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session, userRole]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary">Pending</Badge>;
      case "in_progress":
        return <Badge variant="default">In Progress</Badge>;
      case "completed":
        return <Badge variant="outline">Completed</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-neutral-300 border-t-neutral-800" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Projects Dashboard</h1>
          <p className="text-neutral-600">
            Welcome back, {session?.profile?.full_name || "User"}
          </p>
        </div>
        {(userRole === "admin" || userRole === "client") && (
          <Link to="/projects/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" /> New Project
            </Button>
          </Link>
        )}
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold text-neutral-700 mb-2">No projects found</h2>
          <p className="text-neutral-500 mb-8">
            {userRole === "client" 
              ? "Start by creating your first construction project."
              : userRole === "contractor" 
                ? "You don't have any assigned projects yet."
                : "There are no projects in the system yet."}
          </p>
          {(userRole === "admin" || userRole === "client") && (
            <Link to="/projects/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Create Project
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card key={project.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{project.title}</CardTitle>
                    <CardDescription>
                      {getStatusBadge(project.status || "pending")}
                    </CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link to={`/projects/${project.id}`}>View Details</Link>
                      </DropdownMenuItem>
                      {(userRole === "admin" || (userRole === "client" && project.client_id === session?.user.id)) && (
                        <>
                          <DropdownMenuItem asChild>
                            <Link to={`/projects/${project.id}/edit`}>Edit Project</Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            Delete Project
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-2 text-sm">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-neutral-500" />
                    <span>{project.location || "No location specified"}</span>
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-2 text-neutral-500" />
                    <span>{project.budget ? `$${project.budget.toLocaleString()}` : "Budget not set"}</span>
                  </div>
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2 text-neutral-500" />
                    <span>
                      {project.contractor?.full_name 
                        ? `Assigned to: ${project.contractor.full_name}` 
                        : "Unassigned"}
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-2 text-xs text-neutral-500 flex justify-between">
                <div className="flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  <span>
                    Updated {formatDistanceToNow(new Date(project.updated_at), { addSuffix: true })}
                  </span>
                </div>
                <Link to={`/projects/${project.id}`} className="text-primary hover:underline">
                  Details →
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
