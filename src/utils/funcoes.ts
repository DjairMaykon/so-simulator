const _mergeArrays = (
  a: (Object | undefined)[],
  b: (Object | undefined)[],
  compara: (a: Object | undefined, b: Object | undefined) => number
): (Object | undefined)[] => {
  const c = [];

  while (a.length && b.length) {
    c.push(compara(a[0], b[0]) > 0 ? b.shift() : a.shift());
  }

  //if we still have values, let's add them at the end of `c`
  while (a.length) {
    c.push(a.shift());
  }
  while (b.length) {
    c.push(b.shift());
  }

  return c;
};

export const mergeSort = (
  a: Object[],
  compara: (a: Object | undefined, b: Object | undefined) => number
): (Object | undefined)[] => {
  if (a.length < 2) return a;
  const middle = Math.floor(a.length / 2);
  const a_l = a.slice(0, middle);
  const a_r = a.slice(middle, a.length);
  const sorted_l = mergeSort(a_l, compara);
  const sorted_r = mergeSort(a_r, compara);
  return _mergeArrays(sorted_l, sorted_r, compara);
};
