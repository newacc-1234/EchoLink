import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";
import { LogOut, MessageSquare, Settings, User } from "lucide-react";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();
  return (<header
  className="bg-base-700 border-b border-base-700 fixed w-full top-0 z-40 
backdrop-blur-lg bg-base-700/80 bg-primary/25"
>
  <div className="container mx-auto p-3">
    <div className="flex items-center justify-between h-full">
      <div className="flex items-center gap-18">
        <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-all">
          <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
            <MessageSquare className="w-7 h-7 text-primary" />
          </div>
          <h1 className="text-3xl font-bold">EchoLink</h1>
        </Link>
      </div>

      <div className="flex items-center gap-2">
        <Link
          to={"/settings"}
          className={`
          btn btn-md gap-3 transition-colors
          
          `}
        >
          <Settings className="size-6" />
          <span className="hidden sm:inline text-lg">Settings</span>
        </Link>

        {authUser && (
          <>
            <Link to={"/profile"} className={`btn btn-md gap-3`}>
              <User className="size-6" />
              <span className="hidden sm:inline text-lg">Profile</span>
            </Link>

            <button className="btn btn-md gap-3" onClick={logout}>
              <LogOut className="size-6" />
              <span className="hidden sm:inline text-lg">Logout</span>
            </button>
          </>
        )}
      </div>
    </div>
  </div>
</header>
);
};

export default Navbar;