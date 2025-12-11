export default function makeYearMonth(date: string | Date) {
  
  if (typeof date == 'string') {
    const [y, m] = date.split('-');
    return `${y}-${m}`;
  }

  return `${date.getFullYear()}-${date.getMonth()}`;
}
