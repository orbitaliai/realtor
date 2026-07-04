import {
  DarkThemeToggle,
  Navbar,
  NavbarBrand,
  NavbarCollapse,
  NavbarLink,
  NavbarToggle,
} from "flowbite-react";
import Link from "next/link";

export function SiteNavbar() {
  return (
    <Navbar fluid className="border-b border-gray-200 dark:border-gray-700">
      <NavbarBrand as={Link} href="/">
        <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
          🏠 Barcelona Realty
        </span>
      </NavbarBrand>
      <div className="flex items-center gap-2 md:order-2">
        <DarkThemeToggle />
        <NavbarToggle />
      </div>
      <NavbarCollapse>
        <NavbarLink as={Link} href="/">
          Properties
        </NavbarLink>
        <NavbarLink as={Link} href="/admin">
          Admin
        </NavbarLink>
      </NavbarCollapse>
    </Navbar>
  );
}
