
import { Database } from "@/integrations/supabase/types";

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Project = Database['public']['Tables']['projects']['Row'];
export type ProjectUpdate = Database['public']['Tables']['project_updates']['Row'];
export type ProjectImage = Database['public']['Tables']['project_images']['Row'];

export type UserRole = "admin" | "contractor" | "client";

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
