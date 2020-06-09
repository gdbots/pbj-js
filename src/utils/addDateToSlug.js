import isDate from 'lodash/isDate';
import removeDateFromSlug from './removeDateFromSlug';

/**
 * Return the required date format in slug (YYYY/MM/DD)
 *
 * @param  {Date} date
 *
 * @returns {string} YYYY/MM/DD formated date
 */
function formatSlugDate(date) {
  const year = date.getFullYear();

  let month = date.getMonth() + 1;
  if (month < 10) {
    month = `0${month}`;
  }

  let day = date.getDate();
  if (day < 10) {
    day = `0${day}`;
  }

  return `${year}/${month}/${day}`;
}

/**
 * Returns the slug with the date prepended to it.
 *
 * @param {string} slug
 * @param {?Date}  [date]
 *
 * @returns {?string}
 */
export default function addDateToSlug(slug, date = null) {
  let d = date;
  if (!isDate(d)) {
    d = new Date();
  }

  return `${formatSlugDate(d)}/${removeDateFromSlug(slug)}`;
}
