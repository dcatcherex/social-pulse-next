import { TrendingUp, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyTrendsProps {
  onRefresh?: () => void;
  isLoading?: boolean;
}

export function EmptyTrends({ onRefresh, isLoading }: EmptyTrendsProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
        <TrendingUp className="w-8 h-8 text-slate-400" />
      </div>
      <h3 className="text-lg font-semibold text-slate-900 mb-2">
        No Trends Found
      </h3>
      <p className="text-sm text-slate-500 max-w-sm mb-6">
        We couldn&apos;t find any trending topics for your industry right now. 
        Try refreshing or adjusting your keywords.
      </p>
      {onRefresh && (
        <Button onClick={onRefresh} disabled={isLoading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          {isLoading ? 'Loading...' : 'Discover Trends'}
        </Button>
      )}
    </div>
  );
}
