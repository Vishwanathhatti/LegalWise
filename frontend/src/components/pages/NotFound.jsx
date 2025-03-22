import { Button } from "@/components/ui/button";
import { Gavel, Scale } from "lucide-react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "../shared/Navbar";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div>
      <Navbar/>
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-accent to-background p-4">
      <div className="max-w-2xl w-full text-center space-y-8 animate-float">
        <div className="flex justify-center gap-4">
          <Scale color="#6342eb" className="w-16 h-16 text-primary animate-[swing_4s_ease-in-out_infinite] text-[#6342eb]" />
          <Gavel color="#6342eb" className="w-16 h-16 text-primary animate-[bounce_4s_ease-in-out_infinite] text-[#6342eb]" />
        </div>
        
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-[#6342eb] ">
            404: Case Not Found
          </h1>
          <p className="text-xl text-muted-foreground ">
            Objection! The page you're looking for seems to have been overruled.
          </p>
          <div className="text-muted-foreground space-y-2 dark:text-white">
            <p>Evidence suggests that:</p>
            <ul className="list-disc list-inside">
              <li>The URL might have been expunged from the records</li>
              <li>The page may have been moved to another jurisdiction</li>
              <li>There could be a clerical error in your request</li>
            </ul>
          </div>
        </div>

        <div className="pt-4">
          <Button asChild size="lg" className="bg-[#6342eb] hover:bg-[#876bf7] dark:text-white">
            <Link to="/" className="gap-2">
              Return to Homepage
            </Link>
          </Button>
        </div>

        <div className="text-sm text-muted-foreground border-t border-border pt-8 dark:text-white">
          <p>Legal Notice: This page is not admissible as evidence.</p>
        </div>
      </div>
    </div>
    </div>
  );
};

export default NotFound;