export const objectToChartData = dataObject =>
  Object.keys(dataObject || {}).map(key => ({
    name: key,
    value: dataObject[key],
  }))