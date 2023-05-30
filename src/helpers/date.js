export const dateFormatter = (date) => {
  date = new Date(date);
  return date.toLocaleDateString().split("T")[0];
};
export const days = {
  1: "Monday",
  2: "Tuesday",
  3: "Wednesday",
  4: "Thursday",
  5: "Friday",
};
export const dayGetter = (date) => {
  date = new Date(date);
  return days[date.getDay()];
};
