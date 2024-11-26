const extractCoordinates = (url: string) => {
  // استخدم تعبيرًا منتظمًا للعثور على القيم التي تسبقها !3d و !4d
  const regex = /!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/;
  const match = url.match(regex);

  if (match) {
    const latitude = match[1];
    const longitude = match[2];
    return {
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
    };
  } else {
    return null;
  }
};

export default extractCoordinates