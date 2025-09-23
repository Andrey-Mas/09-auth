// app/(private routes)/layout.tsx
export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
