
// Since we can't directly modify the generated types file, we need to create our own type definitions
// that match the database structure we created

export type UserRole = "admin" | "contractor" | "client";

export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  created_at: string;
}

export interface Project {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  budget: number | null;
  client_id: string | null;
  contractor_id: string | null;
  status: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProjectUpdate {
  id: string;
  project_id: string;
  content: string;
  created_by: string;
  created_at: string;
}

export interface ProjectImage {
  id: string;
  project_id: string;
  image_url: string;
  created_at: string;
}

export interface Session {
  user: {
    id: string;
    email?: string;
  };
  profile?: Profile;
}

export type ProjectWithDetails = Project & {
  client?: Profile;
  contractor?: Profile;
  updates?: ProjectUpdate[];
  images?: ProjectImage[];
}
