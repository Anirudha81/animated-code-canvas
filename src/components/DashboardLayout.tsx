
import { useState } from "react";
import { Link, useNavigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { UserRole } from "@/types";
import { 
  Menu, X, Home, LayoutDashboard, Users, Building, UserCircle, LogOut, Settings
} from "lucide-react";

const DashboardLayout = () => {
  const { session, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const userRole = session?.profile?.role as UserRole;

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const navItems = [
    { 
      label: "Dashboard", 
      icon: <LayoutDashboard className="h-5 w-5" />, 
      href: "/dashboard", 
      roles: ["admin", "contractor", "client"] 
    },
    { 
      label: "Projects", 
      icon: <Building className="h-5 w-5" />, 
      href: "/projects", 
      roles: ["admin", "contractor", "client"] 
    },
    { 
      label: "Users", 
      icon: <Users className="h-5 w-5" />, 
      href: "/users", 
      roles: ["admin"] 
    },
    { 
      label: "Settings", 
      icon: <Settings className="h-5 w-5" />, 
      href: "/settings", 
      roles: ["admin", "contractor", "client"] 
    },
  ];

  const filteredNavItems = navItems.filter(item => 
    item.roles.includes(userRole)
  );

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar for larger screens */}
      <aside className="hidden md:flex md:w-64 flex-col fixed inset-y-0 z-50 bg-neutral-900 text-white">
        <div className="p-6 border-b border-neutral-800">
          <Link to="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl">Khare Construction</span>
          </Link>
        </div>
        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {filteredNavItems.map((item) => (
              <li key={item.href}>
                <Link
                  to={item.href}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-md transition-colors ${
                    location.pathname === item.href || location.pathname.startsWith(`${item.href}/`)
                      ? "bg-neutral-800 text-white"
                      : "hover:bg-neutral-800 text-neutral-300"
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-4 border-t border-neutral-800">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-neutral-300 hover:bg-neutral-800 hover:text-white"
            onClick={handleSignOut}
          >
            <LogOut className="h-5 w-5 mr-3" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 z-40 bg-black/50"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-neutral-900 transform transition-transform duration-200 ease-in-out md:hidden ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        <div className="p-6 flex justify-between items-center border-b border-neutral-800">
          <span className="font-bold text-xl text-white">Khare Construction</span>
          <button onClick={() => setSidebarOpen(false)} className="text-neutral-300">
            <X className="h-6 w-6" />
          </button>
        </div>
        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {filteredNavItems.map((item) => (
              <li key={item.href}>
                <Link
                  to={item.href}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-md transition-colors ${
                    location.pathname === item.href || location.pathname.startsWith(`${item.href}/`)
                      ? "bg-neutral-800 text-white"
                      : "hover:bg-neutral-800 text-neutral-300"
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-4 border-t border-neutral-800">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-neutral-300 hover:bg-neutral-800 hover:text-white"
            onClick={handleSignOut}
          >
            <LogOut className="h-5 w-5 mr-3" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col md:pl-64">
        {/* Top navbar */}
        <header className="sticky top-0 z-10 bg-white border-b border-neutral-200">
          <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <button 
              onClick={() => setSidebarOpen(true)} 
              className="md:hidden text-neutral-800"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="flex-1" />
            <div className="flex items-center space-x-4">
              <Link to="/" className="text-neutral-600 hover:text-neutral-900">
                <Home className="h-5 w-5" />
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <UserCircle className="h-6 w-6" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuItem>
                    {session?.profile?.full_name || "User"}
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    Role: {userRole?.charAt(0).toUpperCase() + userRole?.slice(1) || "Unknown"}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile">Profile Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
