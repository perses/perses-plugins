import { FontSizeOption } from '@perses-dev/components';
import { CalculationType, FormatOptions, ThresholdOptions } from '@perses-dev/core';

export interface StatChartSparklineOptions {
  color?: string;
  width?: number;
}

export interface StatChartOptions {
  calculation: CalculationType;
  format: FormatOptions;
  thresholds?: ThresholdOptions;
  sparkline?: StatChartSparklineOptions;
  valueFontSize?: FontSizeOption;
}
