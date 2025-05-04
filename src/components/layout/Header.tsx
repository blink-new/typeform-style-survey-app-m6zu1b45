import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { PlusCircle, BarChart3, Home } from 'lucide-react';

export function Header() {
  return (
    <header className="border-b border-border bg-background">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold text-primary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
            >
              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
              <path d="m15 5 4 4" />
            </svg>
            <span>FormFlow</span>
          </Link>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          <Link 
            to="/" 
            className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <Home className="h-4 w-4" />
            Dashboard
          </Link>
          <Link 
            to="/analytics" 
            className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <BarChart3 className="h-4 w-4" />
            Analytics
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <Link to="/create">
            <Button className="gap-1">
              <PlusCircle className="h-4 w-4" />
              <span>New Survey</span>
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}