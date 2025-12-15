import { LayoutDashboard, ChevronLeft, ChevronRight } from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  return (
    <aside
      className={`bg-gray-900 text-white fixed left-0 top-16 bottom-0 transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div className="flex flex-col h-full">
        <button
          onClick={onToggle}
          className="flex items-center justify-end p-4 hover:bg-gray-800 transition-colors"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <ChevronLeft className="w-5 h-5" />
          )}
        </button>

        <nav className="flex-1">
          <button
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-800 transition-colors bg-gray-800"
            aria-label="Dashboard"
          >
            <LayoutDashboard className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && <span className="text-sm font-medium">Dashboard</span>}
          </button>
        </nav>
      </div>
    </aside>
  );
}
