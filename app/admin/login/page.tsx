"use client";

import { Alert, Button, Card, Label, TextInput } from "flowbite-react";
import { useActionState } from "react";
import { login } from "../../../lib/actions";

export default function LoginPage() {
  const [error, formAction, pending] = useActionState(login, null);

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 dark:bg-gray-900">
      <Card className="w-full max-w-sm">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
          Admin login
        </h1>
        <form action={formAction} className="flex flex-col gap-4">
          <div>
            <Label htmlFor="username" className="mb-2 block">
              Username
            </Label>
            <TextInput id="username" name="username" required />
          </div>
          <div>
            <Label htmlFor="password" className="mb-2 block">
              Password
            </Label>
            <TextInput id="password" name="password" type="password" required />
          </div>
          {error && <Alert color="failure">{error}</Alert>}
          <Button type="submit" disabled={pending}>
            {pending ? "Signing in…" : "Sign in"}
          </Button>
        </form>
      </Card>
    </main>
  );
}
