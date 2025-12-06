import { motion } from 'framer-motion';
import { Activity, Coins, Clock, Zap, ThumbsUp, ThumbsDown } from 'lucide-react';
import { dashboardStats } from '@/lib/mockData';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  trend?: number;
  suffix?: string;
  color?: 'default' | 'success' | 'warning' | 'destructive';
}

function StatCard({ title, value, icon: Icon, trend, suffix, color = 'default' }: StatCardProps) {
  const colorClasses = {
    default: 'text-foreground',
    success: 'text-success',
    warning: 'text-warning',
    destructive: 'text-destructive',
  };

  return (
    <motion.div
      className="glass-panel p-5"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className={cn('p-2 rounded-lg bg-secondary/50', colorClasses[color])}>
          <Icon className="w-4 h-4" />
        </div>
        {trend !== undefined && (
          <span
            className={cn(
              'text-xs font-medium px-1.5 py-0.5 rounded',
              trend > 0 ? 'bg-success/20 text-success' : 'bg-destructive/20 text-destructive'
            )}
          >
            {trend > 0 ? '+' : ''}
            {trend}%
          </span>
        )}
      </div>
      <p className="text-xs text-muted-foreground mb-1">{title}</p>
      <p className={cn('text-2xl font-semibold tracking-tight', colorClasses[color])}>
        {typeof value === 'number' ? value.toLocaleString() : value}
        {suffix && <span className="text-sm ml-1 text-muted-foreground">{suffix}</span>}
      </p>
    </motion.div>
  );
}

export function DashboardCards() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-6">
      <StatCard
        title="Total Runs (24h)"
        value={dashboardStats.totalRuns}
        icon={Activity}
        trend={12}
      />
      <StatCard
        title="Avg Tokens"
        value={dashboardStats.avgTokens}
        icon={Zap}
        suffix="tokens"
      />
      <StatCard
        title="Avg Latency"
        value={dashboardStats.avgLatency}
        icon={Clock}
        suffix="s"
        trend={-8}
        color="success"
      />
      <StatCard
        title="Total Cost (24h)"
        value={`$${dashboardStats.totalCost.toFixed(2)}`}
        icon={Coins}
        color="warning"
      />

      {/* Feedback Section */}
      <motion.div
        className="col-span-2 lg:col-span-4 glass-panel p-5"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h4 className="text-sm font-medium mb-4">User Feedback</h4>
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-success/10">
              <ThumbsUp className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-success">
                {dashboardStats.feedbackPositive.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">Positive</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-destructive/10">
              <ThumbsDown className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-destructive">
                {dashboardStats.feedbackNegative.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">Negative</p>
            </div>
          </div>
          <div className="flex-1">
            <div className="h-2 rounded-full bg-secondary overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-success to-success/50"
                initial={{ width: 0 }}
                animate={{
                  width: `${(dashboardStats.feedbackPositive / (dashboardStats.feedbackPositive + dashboardStats.feedbackNegative)) * 100}%`,
                }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {((dashboardStats.feedbackPositive / (dashboardStats.feedbackPositive + dashboardStats.feedbackNegative)) * 100).toFixed(1)}% positive
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
