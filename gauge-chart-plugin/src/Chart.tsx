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
import { GaugeChart, useChartsTheme } from '@perses-dev/components';
import { CalculationsMap, DEFAULT_CALCULATION, PanelDefinition } from '@perses-dev/core';
import { useDataQueries } from '@perses-dev/plugin-system';
import { GaugeSeriesOption } from 'echarts';
import merge from 'lodash/merge';
import { useMemo } from 'react';
import {
  DEFAULT_FORMAT,
  DEFAULT_MAX_PERCENT,
  DEFAULT_MAX_PERCENT_DECIMAL,
  EMPTY_GAUGE_SERIES,
  GAUGE_MIN_WIDTH,
  GaugeChartOptions,
  GaugeSeries,
  PANEL_PADDING_OFFSET,
} from './model';
import { convertThresholds, defaultThresholdInput } from './tresholds';

interface ChartProps {
  definition: PanelDefinition<GaugeChartOptions>;
  contentDimensions?: { width: number; height: number };
}

export default function Chart(props: ChartProps) {
  const {
    definition: {
      spec: {
        plugin: {
          spec: { calculation, max, format: pluginSpecFormat, thresholds: pluginSpecThresholds },
        },
      },
    },
    contentDimensions,
  } = props;

  const { thresholds: thresholdsColors } = useChartsTheme();

  const { queryResults, isLoading } = useDataQueries('TimeSeriesQuery');

  // ensures all default format properties set if undef
  const format = merge({}, DEFAULT_FORMAT, pluginSpecFormat);

  const thresholds = pluginSpecThresholds ?? defaultThresholdInput;

  const gaugeData: GaugeSeries[] = useMemo(() => {
    if (queryResults[0]?.data === undefined) {
      return [];
    }

    if (CalculationsMap[calculation] === undefined) {
      console.warn(`Invalid GaugeChart panel calculation ${calculation}, fallback to ${DEFAULT_CALCULATION}`);
    }

    const calculate = CalculationsMap[calculation] ?? CalculationsMap[DEFAULT_CALCULATION];

    const seriesData: GaugeSeries[] = [];
    for (const timeSeries of queryResults[0].data.series) {
      const series = {
        value: calculate(timeSeries.values),
        label: timeSeries.formattedName ?? '',
      };
      seriesData.push(series);
    }
    return seriesData;
  }, [queryResults, calculation]);

  if (queryResults[0]?.error) throw queryResults[0]?.error;

  if (contentDimensions === undefined) return null;

  if (isLoading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Loading...</div>;
  }

  // needed for end value of last threshold color segment
  let thresholdMax = max;
  if (thresholdMax === undefined) {
    if (format.unit === 'percent') {
      thresholdMax = DEFAULT_MAX_PERCENT;
    } else {
      thresholdMax = DEFAULT_MAX_PERCENT_DECIMAL;
    }
  }
  const axisLineColors = convertThresholds(thresholds, format, thresholdMax, thresholdsColors);

  const axisLine: GaugeSeriesOption['axisLine'] = {
    show: true,
    lineStyle: {
      width: 5,
      color: axisLineColors,
    },
  };

  // no data message handled inside chart component
  if (gaugeData.length === 0) {
    return (
      <GaugeChart
        width={contentDimensions.width}
        height={contentDimensions.height}
        data={EMPTY_GAUGE_SERIES}
        format={format}
        axisLine={axisLine}
        max={thresholdMax}
      />
    );
  }

  // accounts for showing a separate chart for each time series
  let chartWidth = contentDimensions.width / gaugeData.length - PANEL_PADDING_OFFSET;
  if (chartWidth < GAUGE_MIN_WIDTH && gaugeData.length > 1) {
    // enables horizontal scroll when charts overflow outside of panel
    chartWidth = GAUGE_MIN_WIDTH;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: '4px' }}>
      {gaugeData.map((series, seriesIndex) => {
        return (
          <div key={`gauge-series-${seriesIndex}`}>
            <GaugeChart
              width={chartWidth}
              height={contentDimensions.height}
              data={series}
              format={format}
              axisLine={axisLine}
              max={thresholdMax}
            />
          </div>
        );
      })}
    </div>
  );
}
