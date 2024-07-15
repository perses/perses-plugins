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

import { CalculationType, FormatOptions } from '@perses-dev/core';

export interface BarChartOptions {
  calculation: CalculationType;
  format?: FormatOptions;
  sort?: SortOption;
  mode?: ModeOption;
}

export type SortOption = 'asc' | 'desc';
export type ModeOption = 'value' | 'percentage';

export const DEFAULT_SORT: SortOption = 'desc';
export const DEFAULT_MODE: ModeOption = 'value';

export interface BarChartData {
  label: string;
  value: number | null;
}
