import { Button, DarkThemeToggle, Navbar, NavbarBrand } from "flowbite-react";
import Link from "next/link";
import { logout } from "../lib/actions";

export function AdminNavbar() {
  return (
    <Navbar fluid className="border-b border-gray-200 dark:border-gray-700">
      <NavbarBrand as={Link} href="/admin">
        <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
          🏠 Barcelona Realty — Admin
        </span>
      </NavbarBrand>
      <div className="flex items-center gap-2">
        <Button as={Link} href="/admin/crm" color="light" size="sm">
          CRM
        </Button>
        <Button as={Link} href="/" color="light" size="sm">
          View site
        </Button>
        <form action={logout}>
          <Button type="submit" color="light" size="sm">
            Log out
          </Button>
        </form>
        <DarkThemeToggle />
      </div>
    </Navbar>
  );
}
