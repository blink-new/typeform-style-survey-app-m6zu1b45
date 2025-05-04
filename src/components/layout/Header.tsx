import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { PlusCircle } from 'lucide-react';

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2 text-xl font-display font-bold text-primary">
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
        <div className="flex items-center gap-4">
          <Link to="/create">
            <Button size="sm" variant="ghost" className="gap-1 text-muted-foreground hover:text-primary">
              <PlusCircle className="h-4 w-4" />
              <span>New Form</span>
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}