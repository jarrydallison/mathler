import logo from "~/assets/logo.png";

export const Logo = ({ className = "size-10" }: { className?: string }) => (
  <img src={logo} alt="Mathler Redux" className={className} />
);
