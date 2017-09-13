/**
 * Supported datetime strings.
 *
 * Component data/BaseTypePicker uses moment.js
 * to sniff datetime formats, then passes d3 datetime
 * string to werk object for use in template parsers.
 *
 * Human readable strings are displayed in the UI after parsing.
 *
 * You may add valid datetime formats.
 */
export default [
 { d3: '%Y', moment: 'YYYY', human: '2016' },
 { d3: '%m/%y', moment: 'MM/YY', human: '02/16' },
 { d3: '%-m/%y', moment: 'M/YY', human: '2/16' },
 { d3: '%m/%Y', moment: 'MM/YYYY', human: '02/2016' },
 { d3: '%-m/%Y', moment: 'M/YYYY', human: '2/2016' },
 { d3: '%m/%d/%y', moment: 'MM/DD/YY', human: '02/29/16' },
 { d3: '%-m/%-d/%y', moment: 'M/D/YY', human: '2/9/16' },
 { d3: '%m/%d/%Y', moment: 'MM/DD/YYYY', human: '02/29/2016' },
 { d3: '%-m/%-d/%Y', moment: 'M/D/YYYY', human: '2/9/2016' },
 { d3: '%m-%d-%y', moment: 'MM-DD-YY', human: '02-29-16' },
 { d3: '%-m-%-d-%y', moment: 'M-D-YY', human: '2-9-16' },
 { d3: '%m-%d-%Y', moment: 'MM-DD-YYYY', human: '02-29-2016' },
 { d3: '%-m-%-d-%Y', moment: 'M-D-YYYY', human: '2-9-2016' },
 { d3: '%Y-%m-%d', moment: 'YYYY-MM-DD', human: '2016-02-29' },
 { d3: '%Y-%-m-%-d', moment: 'YYYY-M-D', human: '2016-2-9' },
 { d3: '%b %d, %Y', moment: 'MMM DD, YYYY', human: 'Feb 29, 2016' },
 { d3: '%b. %d, %Y', moment: 'MMM. DD, YYYY', human: 'Feb. 29, 2016' },
 { d3: '%b %-d, %Y', moment: 'MMM D, YYYY', human: 'Feb 9, 2016' },
 { d3: '%b. %-d, %Y', moment: 'MMM. D, YYYY', human: 'Feb. 9, 2016' },
 { d3: '%H:%M %m/%d/%Y', moment: 'HH:mm MM/DD/YYYY', human: '13:20 02/29/2016' },
 { d3: '%I:%M%p %m/%d/%Y', moment: 'hh:mmA MM/DD/YYYY', human: '01:20PM 02/29/2016' },
];
