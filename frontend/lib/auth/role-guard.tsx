import { useAuth } from "../hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export type Role = "CUSTOMER" | "PROFESSIONAL" | "MANAGER" | "ADMIN";

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: Role[];
  fallbackPath?: string;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({
  children,
  allowedRoles,
  fallbackPath = "/login",
}) => {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !user)) {
      router.push(fallbackPath);
      return;
    }

    if (!isLoading && user && !allowedRoles.includes(user.role as Role)) {
      router.push("/unauthorized");
    }
  }, [isLoading, isAuthenticated, user, allowedRoles, router, fallbackPath]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  if (!allowedRoles.includes(user.role as Role)) {
    return null;
  }

  return <>{children}</>;
};

export default RoleGuard;
