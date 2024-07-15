// Copyright 2024 The Perses Authors
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { CalculationType, FormatOptions, LegendOptionsBase, ThresholdOptions } from '@perses-dev/core';

export interface TimeSeriesChartYAxisOptions {
  show?: boolean;
  label?: string;
  format?: FormatOptions;
  min?: number;
  max?: number;
}

export interface TooltipSpecOptions {
  enablePinning: boolean;
}

export interface TimeSeriesChartOptions {
  legend?: LegendSpecOptions;
  yAxis?: TimeSeriesChartYAxisOptions;
  thresholds?: ThresholdOptions;
  visual?: TimeSeriesChartVisualOptions;
  tooltip?: TooltipSpecOptions;
}

export interface TimeSeriesChartPaletteOptions {
  mode: 'auto' | 'categorical';
  // colors: string []; // TODO: add colors to override ECharts theme
}

export type StackOptions = 'none' | 'all'; // TODO: add percent option support

export type TimeSeriesChartVisualOptions = {
  display?: 'line' | 'bar';
  lineWidth?: number;
  areaOpacity?: number;
  showPoints?: 'auto' | 'always';
  palette?: TimeSeriesChartPaletteOptions;
  pointRadius?: number;
  stack?: StackOptions;
  connectNulls?: boolean;
};

export const legendValues: CalculationType[] = [
  'mean',
  'first',
  'first-number',
  'last',
  'last-number',
  'min',
  'max',
  'sum',
];
export type LegendValue = (typeof legendValues)[number];

// Note: explicitly defining different options for the legend spec and
// legend component that extend from some common options, so we can allow the
// component and the spec to diverge in some upcoming work.
export interface LegendSpecOptions extends LegendOptionsBase {
  values?: LegendValue[];
}

export const DEFAULT_FORMAT: FormatOptions = {
  unit: 'decimal',
  shortValues: true,
};

export const DEFAULT_LINE_WIDTH = 1.5;
export const DEFAULT_AREA_OPACITY = 0;

// How much larger datapoint symbols are than line width, also applied in VisualOptionsEditor.
export const POINT_SIZE_OFFSET = 1.5;
export const DEFAULT_POINT_RADIUS = DEFAULT_LINE_WIDTH + POINT_SIZE_OFFSET;

export const DEFAULT_CONNECT_NULLS = false;

export const DEFAULT_VISUAL: TimeSeriesChartVisualOptions = {
  lineWidth: DEFAULT_LINE_WIDTH,
  areaOpacity: DEFAULT_AREA_OPACITY,
  pointRadius: DEFAULT_POINT_RADIUS,
  connectNulls: DEFAULT_CONNECT_NULLS,
};

export const THRESHOLD_PLOT_INTERVAL = 15;

// Both of these constants help produce a value that is LESS THAN the initial value.
// For positive values, we multiply by a number less than 1 to get this outcome.
// For negative values, we multiply to a number greater than 1 to get this outcome.
export const POSITIVE_MIN_VALUE_MULTIPLIER = 0.8;
export const NEGATIVE_MIN_VALUE_MULTIPLIER = 1.2;

export const DEFAULT_Y_AXIS: TimeSeriesChartYAxisOptions = {
  show: true,
  label: '',
  format: DEFAULT_FORMAT,
  min: undefined,
  max: undefined,
};
