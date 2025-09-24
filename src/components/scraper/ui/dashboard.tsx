'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Activity,
  AlertCircle,
  CheckCircle,
  Clock,
  Download,
  Globe,
  PauseCircle,
  PlayCircle,
  RefreshCw,
  TrendingUp,
  Users,
  Zap,
  XCircle,
  BarChart,
  Database,
  Server,
} from 'lucide-react';
import { DashboardMetrics, QueueStatus, WorkerStatus } from '../type';

interface ScraperDashboardProps {
  metrics?: DashboardMetrics;
  queueStatus?: QueueStatus;
  workers?: WorkerStatus[];
  onPause?: () => void;
  onResume?: () => void;
  onStop?: () => void;
  onExport?: () => void;
}

export function ScraperDashboard({
  metrics = {
    throughput: 0,
    successRate: 0,
    avgLatency: 0,
    queueDepth: 0,
    activeWorkers: 0,
    memoryUsage: 0,
    errorRate: 0,
    totalPages: 0,
    totalLeads: 0,
  },
  queueStatus = {
    pending: 0,
    processing: 0,
    completed: 0,
    failed: 0,
    totalUrls: 0,
    averageProcessingTime: 0,
    estimatedTimeRemaining: 0,
  },
  workers = [],
  onPause,
  onResume,
  onStop,
  onExport,
}: ScraperDashboardProps) {
  const [isPaused, setIsPaused] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState<string | null>(null);

  const handlePauseResume = () => {
    if (isPaused) {
      onResume?.();
    } else {
      onPause?.();
    }
    setIsPaused(!isPaused);
  };

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    }
    if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    }
    return `${seconds}s`;
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Scraper Dashboard</h2>
          <p className="text-muted-foreground">
            Real-time monitoring and control
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handlePauseResume}
            variant={isPaused ? 'default' : 'outline'}
          >
            {isPaused ? (
              <>
                <PlayCircle className="h-4 w-4 mr-2" />
                Resume
              </>
            ) : (
              <>
                <PauseCircle className="h-4 w-4 mr-2" />
                Pause
              </>
            )}
          </Button>
          <Button onClick={onStop} variant="destructive">
            <XCircle className="h-4 w-4 mr-2" />
            Stop
          </Button>
          <Button onClick={onExport} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              Throughput
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics.throughput.toFixed(2)} pages/s
            </div>
            <Progress
              value={Math.min(100, metrics.throughput * 10)}
              className="mt-2"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-blue-500" />
              Success Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.successRate.toFixed(1)}%</div>
            <Progress value={metrics.successRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4 text-yellow-500" />
              Avg Latency
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatTime(metrics.avgLatency)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Per page processing
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4 text-purple-500" />
              Leads Found
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(metrics.totalLeads)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {metrics.totalPages > 0
                ? (metrics.totalLeads / metrics.totalPages).toFixed(1)
                : 0}{' '}
              per page
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Queue Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Queue Status
          </CardTitle>
          <CardDescription>
            URLs being processed across all workers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Queue Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-xl font-semibold text-yellow-600">
                  {queueStatus.pending}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Processing</p>
                <p className="text-xl font-semibold text-blue-600">
                  {queueStatus.processing}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-xl font-semibold text-green-600">
                  {queueStatus.completed}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Failed</p>
                <p className="text-xl font-semibold text-red-600">
                  {queueStatus.failed}
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Progress</span>
                <span>
                  {queueStatus.completed + queueStatus.failed} / {queueStatus.totalUrls}
                </span>
              </div>
              <Progress
                value={
                  ((queueStatus.completed + queueStatus.failed) /
                    queueStatus.totalUrls) *
                  100
                }
              />
            </div>

            {/* Time Estimate */}
            {queueStatus.estimatedTimeRemaining > 0 && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>
                  Estimated time remaining:{' '}
                  {formatTime(queueStatus.estimatedTimeRemaining)}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Workers & Performance */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Worker Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5" />
              Worker Pool
            </CardTitle>
            <CardDescription>{workers.length} active workers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {workers.map((worker) => (
                <div
                  key={worker.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent cursor-pointer"
                  onClick={() => setSelectedWorker(worker.id)}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-3 w-3 rounded-full ${
                        worker.status === 'idle'
                          ? 'bg-gray-400'
                          : worker.status === 'busy'
                          ? 'bg-green-500 animate-pulse'
                          : 'bg-red-500'
                      }`}
                    />
                    <div>
                      <p className="font-medium">Worker {worker.id}</p>
                      <p className="text-xs text-muted-foreground">
                        {worker.currentUrl || 'Idle'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={worker.status === 'busy' ? 'default' : 'secondary'}>
                      {worker.status}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">
                      {worker.processedCount} processed
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart className="h-5 w-5" />
              System Performance
            </CardTitle>
            <CardDescription>Resource utilization</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Memory Usage */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Memory Usage</span>
                  <span>{metrics.memoryUsage.toFixed(0)} MB</span>
                </div>
                <Progress
                  value={Math.min(100, (metrics.memoryUsage / 1024) * 100)}
                  className={
                    metrics.memoryUsage > 800 ? 'bg-red-100' : ''
                  }
                />
              </div>

              {/* Active Workers */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Worker Utilization</span>
                  <span>
                    {metrics.activeWorkers} / {workers.length}
                  </span>
                </div>
                <Progress
                  value={(metrics.activeWorkers / workers.length) * 100}
                />
              </div>

              {/* Error Rate */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Error Rate</span>
                  <span className={metrics.errorRate > 5 ? 'text-red-600' : ''}>
                    {metrics.errorRate.toFixed(1)} errors/min
                  </span>
                </div>
                <Progress
                  value={Math.min(100, metrics.errorRate * 10)}
                  className={metrics.errorRate > 5 ? 'bg-red-100' : ''}
                />
              </div>

              {/* Queue Depth */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Queue Depth</span>
                  <span>{formatNumber(metrics.queueDepth)} URLs</span>
                </div>
                <Progress
                  value={Math.min(100, (metrics.queueDepth / 1000) * 100)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts & Notifications */}
      {(metrics.errorRate > 10 || metrics.memoryUsage > 900) && (
        <Card className="border-yellow-500 bg-yellow-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-700">
              <AlertCircle className="h-5 w-5" />
              System Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {metrics.errorRate > 10 && (
                <div className="flex items-center gap-2 text-sm">
                  <Badge variant="destructive">High Error Rate</Badge>
                  <span>Error rate exceeds threshold: {metrics.errorRate.toFixed(1)}/min</span>
                </div>
              )}
              {metrics.memoryUsage > 900 && (
                <div className="flex items-center gap-2 text-sm">
                  <Badge variant="destructive">Memory Warning</Badge>
                  <span>High memory usage: {metrics.memoryUsage.toFixed(0)} MB</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}