import { Package } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 fixed top-0 left-0 right-0 z-10">
      <div className="flex items-center gap-3">
        <Package className="w-8 h-8 text-blue-600" />
        <h1 className="text-2xl font-semibold text-gray-900">Order Processing Dashboard</h1>
      </div>
    </header>
  );
}
