import * as _ from 'lodash';

export default function removeAndCamelCase(row: any, omittedArr: string[]) {
  const omitted = _.omit(row, omittedArr);
  return _.mapKeys(omitted, (value, key) => _.camelCase(key));
}
