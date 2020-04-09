export function chunkArray<T>(arr: T[], chunkSize: number) {
    var R: T[][] = [];
    for (var i = 0, len = arr.length; i < len; i += chunkSize)
        R.push(arr.slice(i, i + chunkSize));
    return R;
}