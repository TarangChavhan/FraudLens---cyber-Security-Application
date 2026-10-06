import { ArrowLeft, ShieldCheck, LogOut } from "lucide-react";

interface TopBarProps {
  title: string;
  onBack?: () => void;
  barColor?: string;
  userName?: string;
  onLogout?: () => void;
}

export default function TopBar({
  title,
  onBack,
  barColor = "bg-blue-700",
  userName,
  onLogout,
}: TopBarProps) {
  return (
    <header
      id="topbar-header"
      className={`flex items-center gap-3 ${barColor} text-white px-4 py-3 shadow transition-colors`}
    >
      {onBack && (
        <button
          id="topbar-back-button"
          onClick={onBack}
          className="flex items-center gap-1 bg-black/20 hover:bg-black/35 px-2.5 py-1.5 rounded text-sm font-medium transition cursor-pointer"
          title="Go back"
        >
          <ArrowLeft size={16} /> <span>Back</span>
        </button>
      )}
      <ShieldCheck size={22} className="shrink-0" />
      <h1 id="topbar-title" className="text-lg font-bold tracking-wide flex-1 truncate">
        {title}
      </h1>
      {userName && (
        <span id="topbar-username" className="text-sm font-medium hidden sm:inline text-white/90">
          Hi, {userName}
        </span>
      )}
      {onLogout && (
        <button
          id="topbar-logout-button"
          onClick={onLogout}
          className="flex items-center gap-1.5 bg-black/20 hover:bg-black/35 px-2.5 py-1.5 rounded text-sm font-medium transition cursor-pointer"
          title="Logout"
        >
          <LogOut size={14} /> <span>Logout</span>
        </button>
      )}
    </header>
  );
}
