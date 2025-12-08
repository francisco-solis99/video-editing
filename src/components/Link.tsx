import { Link as NavLink } from "react-router";

interface LinkProps {
  href: string;
  children: React.ReactNode;
  [key: string]: string | React.ReactNode;
}

export function Link({ href, children, ...restProps }: LinkProps) {
  return (
    <NavLink to={href} {...restProps}>
      {children}
    </NavLink>
  )
}
