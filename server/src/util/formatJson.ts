import * as _ from 'lodash';

export default function formatJson(row: any, include: string, omittedArr: string[]) {
  let camelCaseComment: any = {};
  const omitted = _.omit(row, omittedArr);

  if (include !== undefined) {
    const included = _.pick(omitted, include.split(','));
    camelCaseComment = _.mapKeys(included, (value, key) => _.camelCase(key));
  } else {
    camelCaseComment = _.mapKeys(omitted, (value, key) => _.camelCase(key));
  }
  return _.mapKeys(camelCaseComment, (value, key) => _.camelCase(key));
}
