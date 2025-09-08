/**
 * WAGMI Crypto Investment Manager - Common Types
 * Shared utility types used across the application
 */

// Generic utility types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

// Loading states
export interface LoadingState {
  loading: boolean;
  error: string | null;
}

// Async operation states
export interface AsyncState<T> extends LoadingState {
  data: T | null;
}

// Form states
export interface FormState<T> {
  data: T;
  errors: Partial<Record<keyof T, string>>;
  isSubmitting: boolean;
  isDirty: boolean;
}

// Modal states
export interface ModalState {
  isOpen: boolean;
  data?: unknown;
}

// Table/List states
export interface TableState<T> {
  data: T[];
  loading: boolean;
  error: string | null;
  selectedRows: string[];
  sortBy?: keyof T;
  sortOrder: 'asc' | 'desc';
  filters: Record<string, unknown>;
}

// Chart data types
export interface ChartDataPoint {
  x: string | number;
  y: number;
  label?: string;
}

export interface ChartDataset {
  label: string;
  data: ChartDataPoint[];
  backgroundColor?: string | string[];
  borderColor?: string | string[];
  borderWidth?: number;
}

export interface ChartConfig {
  type: 'line' | 'bar' | 'pie' | 'doughnut';
  data: {
    labels: string[];
    datasets: ChartDataset[];
  };
  options?: unknown;
}

// Date and time utilities
export type DateFormat = 'relative' | 'absolute' | 'iso' | 'display';
export type TimeFormat = '12h' | '24h';

// Number formatting types
export interface NumberFormatOptions {
  decimals: number;
  prefix?: string;
  suffix?: string;
  thousandsSeparator: boolean;
  abbreviate?: boolean; // K, M, B suffixes
}

// Privacy masking types
export interface PrivacySettings {
  maskValues: boolean;
  maskPercentages: boolean;
  showLabels: boolean;
}

// Theme and styling types
export type Theme = 'light' | 'dark' | 'system';
export type ColorScheme = 'green' | 'blue' | 'purple' | 'orange';

// Notification types
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  actions?: NotificationAction[];
}

export interface NotificationAction {
  label: string;
  action: () => void;
  variant?: 'primary' | 'secondary';
}

// Search and filter types
export interface SearchFilters {
  query: string;
  category?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Export/Import types
export interface ExportOptions {
  format: 'csv' | 'xlsx' | 'json' | 'pdf';
  includeCharts: boolean;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export interface ImportResult {
  success: boolean;
  imported: number;
  failed: number;
  errors: string[];
}

// Performance metrics
export interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  apiResponseTime: number;
  memoryUsage: number;
  errorRate: number;
}

// Feature flags
export interface FeatureFlags {
  enableRealTimeUpdates: boolean;
  enableAdvancedAnalytics: boolean;
  enableExport: boolean;
  enableNotifications: boolean;
  enableDarkMode: boolean;
}
