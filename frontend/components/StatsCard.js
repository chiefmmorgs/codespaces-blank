import { LucideIcon } from 'lucide-react';

export default function StatsCard({ title, value, icon: Icon, gradient = false }) {
  return (
    <div className="card-3d p-6 glass-morphism rounded-xl border border-primary-500/20 hover:border-primary-500/40 transition-all">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{title}</p>
          <p className={`text-3xl font-bold ${gradient ? 'bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent' : ''}`}>
            {value}
          </p>
        </div>
        <div className="p-4 bg-primary-500/10 rounded-lg">
          <Icon className="h-8 w-8 text-primary-500" />
        </div>
      </div>
    </div>
  );
}