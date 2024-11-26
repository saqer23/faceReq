/* eslint-disable @typescript-eslint/no-explicit-any */
type FilterObject = {
  [key: string]: any // Generalizing to handle any kind of nested objects
}

function convertStringNumbers(filters: FilterObject): FilterObject {
  const result: FilterObject = {}
  function isIsoDateString(value: any): boolean {
    // Regex pattern for ISO 8601 date strings
    const isoDatePattern =
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})?$/
    return isoDatePattern.test(value)
  }
  function processValue(key: string, value: any): any {
    if (key === 'createdAt' && typeof value === 'string') {
      const startDate = new Date(`${value}-01-01T00:00:00.000Z`)
      const endDate = new Date(`${value}-12-31T23:59:59.999Z`)
      if (!isNaN(startDate.getTime())) {
        return {
          gte: startDate,
          lte: endDate,
        }
      }
    }

    if (typeof value === 'string') {
      if (!isNaN(parseInt(value, 10))) {
        return parseInt(value, 10)
      }
      if (value === 'true') {
        return true
      }
      if (value === 'false') {
        return false
      }
      if (value === 'null') {
        return null
      }
      return value
    } else if (Array.isArray(value)) {
      return value.map((item) => processValue(key, item))
    } else if (typeof value === 'object' && value !== null) {
      return convertStringNumbers(value)
    } else {
      return value
    }
  }

  for (const [key, conditions] of Object.entries(filters)) {
    if (typeof conditions === 'object' && conditions !== null) {
      result[key] = {}
      for (const [op, value] of Object.entries(conditions)) {
        if (['gte', 'lte'].includes(op) && isIsoDateString(value)) {
          // Special handling for date-related operations
          result[key][op] = new Date(value as string)
        } else {
          result[key][op] = processValue(key, value)
        }
      }
    } else {
      result[key] = processValue(key, conditions)
    }
  }

  return result
}

// Export the function itself, not its result
export default convertStringNumbers
