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
import { GraphSeries, StatChart, StatChartData, useChartsTheme } from '@perses-dev/components';
import {
  CalculationsMap,
  CalculationType,
  DEFAULT_CALCULATION,
  PanelDefinition,
  TimeSeriesData,
} from '@perses-dev/core';
import { useDataQueries, UseDataQueryResults } from '@perses-dev/plugin-system';
import { useMemo } from 'react';
import { convertSparkline, getColorFromThresholds } from './data-transform';
import { StatChartOptions } from './model';

interface ChartProps {
  definition: PanelDefinition<StatChartOptions>;
  contentDimensions?: { width: number; height: number };
}

const MIN_WIDTH = 100;
const SPACING = 2;

export default function Chart(props: ChartProps) {
  const {
    definition: {
      spec: {
        plugin: {
          spec: { calculation, format, sparkline, thresholds, valueFontSize: valueFontSize },
        },
      },
    },
    contentDimensions,
  } = props;

  const { queryResults, isLoading, isFetching } = useDataQueries('TimeSeriesQuery');
  const statChartData = useStatChartData(queryResults, calculation);
  const isMultiSeries = statChartData.length > 1;

  const chartsTheme = useChartsTheme();

  if (queryResults[0]?.error) throw queryResults[0]?.error;

  if (contentDimensions === undefined) return null;

  if (isLoading || isFetching) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Loading...</div>;
  }

  // Calculates chart width
  const spacing = SPACING * (statChartData.length - 1);
  let chartWidth = (contentDimensions.width - spacing) / statChartData.length;
  if (isMultiSeries && chartWidth < MIN_WIDTH) {
    chartWidth = MIN_WIDTH;
  }

  return (
    <div
      style={{
        width: contentDimensions.width,
        height: contentDimensions.height,
        display: 'flex',
        gap: `${SPACING}px`,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {statChartData.length ? (
        statChartData.map((series, index) => (
          <StatChart
            key={index}
            width={chartWidth}
            height={contentDimensions.height}
            data={series}
            format={format}
            color={getColorFromThresholds(chartsTheme, thresholds, series.calculatedValue)}
            sparkline={convertSparkline(chartsTheme, sparkline, thresholds, series.calculatedValue)}
            showSeriesName={isMultiSeries}
            valueFontSize={valueFontSize}
          />
        ))
      ) : (
        <p>No data</p>
      )}
    </div>
  );
}

const useStatChartData = (
  queryResults: UseDataQueryResults<TimeSeriesData>['queryResults'],
  calculation: CalculationType
): StatChartData[] => {
  return useMemo(() => {
    if (CalculationsMap[calculation] === undefined) {
      console.warn(`Invalid StatChart panel calculation ${calculation}, fallback to ${DEFAULT_CALCULATION}`);
    }
    const calculate = CalculationsMap[calculation] ?? CalculationsMap[DEFAULT_CALCULATION];

    const statChartData: StatChartData[] = [];
    for (const result of queryResults) {
      // Skip queries that are still loading or don't have data
      if (result.isLoading || result.isFetching || result.data === undefined) continue;

      for (const seriesData of result.data.series) {
        const calculatedValue = seriesData !== undefined ? calculate(seriesData.values) : undefined;
        const series: GraphSeries = {
          name: seriesData.formattedName ?? '',
          values: seriesData.values,
        };
        statChartData.push({ calculatedValue, seriesData: series });
      }
    }
    return statChartData;
  }, [queryResults, calculation]);
};
