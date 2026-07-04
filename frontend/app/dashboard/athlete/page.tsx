
import { Navbar } from "@/components/Navbar";
import Dashboard from "@/components/Dashboard";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-brand-bg transition-colors">
      <Navbar />
      <Dashboard />

    </div>
  );
}