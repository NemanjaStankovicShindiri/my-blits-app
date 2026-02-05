// @ts-nocheck
export default function constructRails(
  rails,
  { startIndex = 1, titlePrefix = 'Rejl broj', rowH = 200, railType, itemDefaults }
) {
  return rails.map((rail, railIndex) => ({
    title: `${titlePrefix} ${startIndex + railIndex}`,
    rowH,
    type: railType,
    items: rail.items.map((item, itemIndex) => ({
      id: itemIndex,
      ...item,
      width: item.width ?? itemDefaults.width,
      height: item.height ?? itemDefaults.height,
      type: item.type ?? itemDefaults.type,
    })),
  }))
}
