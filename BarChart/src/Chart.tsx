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

/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useChartsTheme } from '@perses-dev/components';
import { CalculationsMap, CalculationType, PanelDefinition } from '@perses-dev/core';
import { useDataQueries } from '@perses-dev/plugin-system';
import { useMemo } from 'react';
import { BarChart } from './BarChart';
import { BarChartData, BarChartOptions } from './model';
import { calculatePercentages, sortSeriesData } from './utils';

interface ChartProps {
  definition: PanelDefinition<BarChartOptions>;
  contentDimensions?: { width: number; height: number };
}

export default function Chart(props: ChartProps) {
  const {
    definition: {
      spec: {
        plugin: {
          spec: { calculation, format, sort, mode },
        },
      },
    },
    contentDimensions,
  } = props;

  const chartsTheme = useChartsTheme();
  const PADDING = chartsTheme.container.padding.default;

  const { queryResults, isLoading, isFetching } = useDataQueries('TimeSeriesQuery'); // gets data queries from a context provider, see DataQueriesProvider

  const barChartData: BarChartData[] = useMemo(() => {
    const calculate = CalculationsMap[calculation as CalculationType];
    const barChartData: BarChartData[] = [];
    for (const result of queryResults) {
      // Skip queries that are still loading or don't have data
      if (result.isLoading || result.isFetching || result.data === undefined) continue;

      for (const seriesData of result.data.series) {
        const series = {
          value: calculate(seriesData.values) ?? null,
          label: seriesData.formattedName ?? '',
        };
        barChartData.push(series);
      }
    }

    const sortedBarChartData = sortSeriesData(barChartData, sort);
    if (mode === 'percentage') {
      return calculatePercentages(sortedBarChartData);
    } else {
      return sortedBarChartData;
    }
  }, [queryResults, sort, mode, calculation]);

  if (queryResults[0]?.error) throw queryResults[0]?.error;

  if (contentDimensions === undefined) return null;

  if (isLoading || isFetching) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Loading...</div>;
  }

  return (
    <div style={{ padding: `${PADDING}px` }}>
      <BarChart
        width={contentDimensions.width - PADDING * 2}
        height={contentDimensions.height - PADDING * 2}
        data={barChartData}
        format={format}
        mode={mode}
      />
    </div>
  );
}
