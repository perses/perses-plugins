import { BarChartData, DEFAULT_SORT, SortOption } from './model';

export function calculatePercentages(data: BarChartData[]) {
  const sum = data.reduce((accumulator, { value }) => accumulator + (value ?? 0), 0);
  return data.map((seriesData) => {
    const percentage = ((seriesData.value ?? 0) / sum) * 100;
    return {
      ...seriesData,
      value: percentage,
    };
  });
}

export function sortSeriesData(data: BarChartData[], sortOrder: SortOption = DEFAULT_SORT) {
  if (sortOrder === 'asc') {
    // sort in ascending order by value
    return data.sort((a, b) => {
      if (a.value === null) {
        return 1;
      }
      if (b.value === null) {
        return -1;
      }
      if (a.value === b.value) {
        return 0;
      }
      return a.value < b.value ? 1 : -1;
    });
  } else {
    // sort in descending order by value
    return data.sort((a, b) => {
      if (a.value === null) {
        return -1;
      }
      if (b.value === null) {
        return 1;
      }
      if (a.value === b.value) {
        return 0;
      }
      return a.value < b.value ? -1 : 1;
    });
  }
}
