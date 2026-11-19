import { InferenceTelemetry } from '../types';

class TelemetryLogger {
  private traces: InferenceTelemetry[] = [];
  private maxTraces: number = 50;

  /**
   * Log an inference telemetry trace
   */
  public logTrace(trace: InferenceTelemetry) {
    this.traces.unshift(trace);
    if (this.traces.length > this.maxTraces) {
      this.traces.pop();
    }

    // Also dispatch a custom event for live UI reactivity (HUD inspector)
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('swasthya_telemetry_event', { detail: trace }));
    }
  }

  /**
   * Get all recorded traces (most recent first)
   */
  public getRecentTraces(): InferenceTelemetry[] {
    return [...this.traces];
  }

  /**
   * Get the single latest trace
   */
  public getLatestTrace(): InferenceTelemetry | null {
    return this.traces[0] || null;
  }

  /**
   * Clear all telemetry history
   */
  public clear() {
    this.traces = [];
  }

  /**
   * Calculate aggregated performance metrics for evaluation
   */
  public getAggregates() {
    if (this.traces.length === 0) {
      return {
        totalQueries: 0,
        localRatio: 0,
        averageLatencyMs: 0,
        totalEgressBytes: 0,
        fallbackCount: 0,
        validationPassRate: 100
      };
    }

    const total = this.traces.length;
    const localCount = this.traces.filter(t => t.isLocal).length;
    const totalLatency = this.traces.reduce((acc, t) => acc + t.latencyMs, 0);
    const totalEgress = this.traces.reduce((acc, t) => acc + t.dataEgressBytes, 0);
    const fallbackCount = this.traces.filter(t => t.fallbackTriggered).length;
    const validationPassedCount = this.traces.filter(t => t.validationPassed).length;

    return {
      totalQueries: total,
      localRatio: Math.round((localCount / total) * 100),
      averageLatencyMs: Math.round(totalLatency / total),
      totalEgressBytes: totalEgress,
      fallbackCount,
      validationPassRate: Math.round((validationPassedCount / total) * 100)
    };
  }
}

export const telemetryLogger = new TelemetryLogger();
