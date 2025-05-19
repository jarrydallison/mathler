import { Link } from "react-router";

export const Footer = () => (
  <footer className="fixed bottom-0 left-0 right-0 py-1 flex flex-row items-center justify-between bg-slate-100 px-4">
    <p className="text-xs">
      {
        <Link
          to="https://www.mathler.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="pt-[-8px] text-xs text-gray-600"
        >
          Original Mathler
        </Link>
      }
    </p>
    <p className="text-xs">Created by Jarryd</p>
  </footer>
);
