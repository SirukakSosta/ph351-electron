export function getColumnFrom2dArray<T>(array: T[][], columnIndex: number) {
    return array.map(x => x[columnIndex]);
}
