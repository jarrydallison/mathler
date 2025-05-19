import { useState } from "react";
import { Link, useLocation } from "react-router";
import { Button } from "~/components/ui/button";
import { Menu, X } from "lucide-react";
import { Logo } from "../icons/logo";
import {
  DynamicWidget,
  useDynamicContext,
  useIsLoggedIn,
} from "@dynamic-labs/sdk-react-core";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const loggedIn = useIsLoggedIn();
  const { setShowAuthFlow } = useDynamicContext();
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background mb-4 md:mb-8">
      <div className="px-4 sm:px-8 flex h-12 items-center justify-between">
        <div className="flex justify-end items-center gap-1">
          <Link to="/" className="flex justify-end gap-1">
            <Logo className="h-6" />
            <p className="hidden sm:block sm:text-xl font-bold">
              Mathler Redux
            </p>
          </Link>
          <Link
            to="/stats"
            className={`p-2 ml-2 hidden sm:flex text-center text-sm font-medium transition-colors hover:text-primary hover:bg-gray-100 rounded-sm cursor-pointer ${
              pathname.includes("stats")
                ? "border-b border-b-blue-400 rounded-b-none"
                : ""
            }`}
            onClick={() => setIsMenuOpen(false)}
          >
            View Stats
          </Link>
        </div>

        <div className="hidden sm:flex items-center space-x-4">
          {loggedIn ? (
            <DynamicWidget />
          ) : (
            <Button onClick={() => setShowAuthFlow(true)}>Login</Button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
          className="sm:hidden"
        >
          {isMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </Button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="sm:hidden pb-4">
          <nav className="flex flex-col px-4 space-y-4">
            {loggedIn ? (
              <DynamicWidget />
            ) : (
              <Button onClick={() => setShowAuthFlow(true)}>Login</Button>
            )}

            <Link
              to="/stats"
              className="text-center text-sm font-medium transition-colors hover:text-primary hover:bg-gray-100 rounded-sm cursor-pointer py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              View Stats
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};
