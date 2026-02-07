import { Route } from "wouter";

export function ProtectedRoute({
  path,
  component: Component,
}: {
  path: string;
  component: () => React.JSX.Element;
}) {
  // Allow all access for testing (no login required)
  return <Route path={path} component={Component} />;
}
