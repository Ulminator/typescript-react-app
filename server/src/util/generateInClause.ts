export default function generateInClause(arr: number[]) {
  let inClause = ' ( ';
  for (let i = 1; i <= arr.length; i++) {
    if (i == arr.length) {
      inClause += `$${i} `;
    } else {
      inClause += `$${i}, `;
    }
  }
  inClause += ')'
  return inClause;
};
