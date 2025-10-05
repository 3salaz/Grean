// Utility function to format a date string into detailed date parts
export function formatDateInfo(dateString: string) {
  if (!dateString) return {dayOfWeek: "", monthName: "", day: "", year: ""};

  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return {dayOfWeek: "Invalid Date", monthName: "", day: "", year: ""};
  }

  const formatter = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric"
  });

  const formattedDate = formatter.formatToParts(date).reduce((acc, part) => {
    if (part.type !== "literal") {
      acc[part.type] = part.value;
    }
    return acc;
  }, {} as Record<string, string>);

  return {
    dayOfWeek: formattedDate.weekday,
    monthName: formattedDate.month,
    day: formattedDate.day,
    year: formattedDate.year
  };
}
