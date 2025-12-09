/**
 * convert Date object into YYYY/MM/dd
 * @param date clicked date
 * @return YYYY/MM/dd:hh:mm
 */
export const convertDateToString = (date: Date): string => {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${String(date.getDate()).padStart(2, '0')}`;
};

/**
 * add 1 day to the current Date
 * @param date date情報(string型)
 */
export const addOneDay = (date: string): string => {
  const parts: string[] = date.split('-');
  const dateObj: Date = new Date(
    Number(parts[0]),
    Number(parts[1]) - 1,
    Number(parts[2]),
  );
  dateObj.setDate(dateObj.getDate() + 1);

  return convertDateToString(dateObj);
};
