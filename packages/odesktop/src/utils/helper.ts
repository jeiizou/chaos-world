export type SizeType = {
    width: number;
    height: number;
};

export type SortCfgType = {
    gutter: number[];
};

export function sortDomWithSize(
    keyLevel: string[],
    sizeMap: Record<string, { size?: SizeType }>,
    containerSize: SizeType,
    sortCfg: SortCfgType,
) {
    if (!containerSize) return;
    let offsetX = 0;
    let offsetY = 0;
    const positionMap: Record<string, [number, number]> = {};
    let lineHeight = 0;
    keyLevel.forEach(key => {
        if (!sizeMap[key]) return;
        const size = sizeMap[key].size ?? { width: 0, height: 0 };

        const xEnd = offsetX + size.width + sortCfg.gutter[0];
        // current row can't put
        if (xEnd > containerSize.width) {
            offsetY += lineHeight + sortCfg.gutter[1];
            // reset start offset & line height
            offsetX = 0;
            lineHeight = 0;
        } else {
            lineHeight = Math.max(size.height, lineHeight);
        }
        positionMap[key] = [offsetX, offsetY];
        offsetX = xEnd;
    });

    return positionMap;
}
