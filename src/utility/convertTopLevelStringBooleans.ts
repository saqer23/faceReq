type SimpleFilterObject = {
  [key: string]: string | number | boolean | ComplexFilter
}

type ComplexFilter = {
  select?: { [key: string]: boolean }
  include?: { [key: string]: boolean | SimpleFilterObject } // Allow nested structures within include
}

function convertTopLevelStringBooleans(
  filters: SimpleFilterObject
): SimpleFilterObject {
  const result: SimpleFilterObject = {}

  for (const [key, value] of Object.entries(filters)) {
    console.log('filters ', filters)
    if (typeof value === 'string') {
      // Check if the string is 'true' or 'false' and convert accordingly
      if (value.toLowerCase() === 'true') {
        result[key] = true
      } else if (value.toLowerCase() === 'false') {
        result[key] = false
      } else {
        // Retain other strings as they are
        result[key] = value
      }
    } else if (typeof value === 'object' && value !== null) {
      if (value.select && typeof value.select === 'string') {
        const selectValue: string = value.select
        const splitArray: string[] = selectValue.split('-')
        const select: { [key: string]: boolean } = {}
        for (const item of splitArray) {
          select[item] = true
        }
        result[key] = { select }
      } else if (value.include) {
        if (typeof value.include === 'string') {
          const includeValue: string = value.include
          const splitArray: string[] = includeValue.split('-')
          const include: { [key: string]: boolean } = {}
          for (const item of splitArray) {
            include[item] = true
          }
          result[key] = { include }
        } else if (
          typeof value.include === 'object' &&
          value.include !== null
        ) {
          const nestedInclude: { [key: string]: boolean | SimpleFilterObject } =
            {}
          for (const [nestedKey, nestedValue] of Object.entries(
            value.include
          )) {
            const convertedValue = convertTopLevelStringBooleans({
              [nestedKey]: nestedValue,
            })
            nestedInclude[nestedKey] = convertedValue[nestedKey] as
              | boolean
              | SimpleFilterObject
          }
          result[key] = { include: nestedInclude }
        }
      }
    } else {
      // Retain other types as they are (e.g., numbers, booleans)
      result[key] = value
    }
  }
  console.log('result: ', result)

  return result
}

// Export the function
export default convertTopLevelStringBooleans
