// src/app/(auth)/layout.tsx
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full bg-gray-50 flex flex-col">
      <div className="flex-1 w-full">
        {children}
      </div>
    </div>
  );
}