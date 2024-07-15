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

import { CalculationType, FormatOptions, ThresholdOptions } from '@perses-dev/core';

export const EMPTY_GAUGE_SERIES: GaugeSeries = { label: '', value: null };
export const GAUGE_MIN_WIDTH = 90;
export const PANEL_PADDING_OFFSET = 20;
export const DEFAULT_MAX_PERCENT = 100;
export const DEFAULT_MAX_PERCENT_DECIMAL = 1;
export const DEFAULT_FORMAT: FormatOptions = { unit: 'percent-decimal' };

export interface GaugeChartOptions {
  calculation: CalculationType;
  format?: FormatOptions;
  thresholds?: ThresholdOptions;
  max?: number;
}

export type GaugeChartValue = number | null | undefined;

export type GaugeSeries = {
  value: GaugeChartValue;
  label: string;
};
