const calculationHistory = (endContract: string) => {
  try {
    const endDate = new Date(endContract)
    const currentDate = new Date()
    if (currentDate > endDate) {
      return false
    } else {
      return true
    }
  } catch (error) {
    console.log(error)
  }
}

export default calculationHistory
