function DateValidator() {}

var formats = [
    '(M|m|mm)[\\/\\- ](D[\\/\\- ]|d(\\/|-|,? ))YY?',
    '[Dd][\\/\\- ](M|m|mm)[\\/\\- ]YY?',
    'YY?[\\/\\- ](M|m|mm)[\\/\\- ][Dd]',
];
var longMonths = ['january','february','march','april','may','june','july','august','september','october',
    'november','december'];
var shortMonths = longMonths.map(function (val) {
    return val.substr(0,3);
});

DateValidator.testFormat = function testFormat(format) {
    function combineTerms(termsArr) {
        return '(' + termsArr.join('|') + ')';
    }
    if (format) {
        if (!(new RegExp(combineTerms(formats))).test(format)) {
            console.error('Invalid date format ' + format);
            return false;
        }
    } else {
        format = 'M/D/YY';
    }
    return format;
};

DateValidator.testDateInFormat = function testDateInFormat(date, format) {
    function dateError(datePart) {
        console.error('Date is not in provided format ' + datePart);
        return false;
    }

    var dateFormatParts = format.split(/\/|-|,? /);
    var dateParts = date.split(/\/|-|,? /);
    console.log(dateParts);
    var date = {};
    for (var i = 0; i < dateFormatParts.length; i++) {
        switch (dateFormatParts[i]) {
            case 'M':
                if (!/(0?[1-9]|1[0-2])/.test(dateParts[i])) return dateError('month');
                date.month = dateParts[i] - 1;
                break;
            case 'm':
                if (shortMonths.indexOf(dateParts[i].toLowerCase()) === -1) return dateError('month');
                date.month = shortMonths.indexOf(dateParts[i].toLowerCase());
                break;
            case 'mm':
                if (longMonths.indexOf(dateParts[i].toLowerCase()) === -1) return dateError('month');
                date.month = longMonths.indexOf(dateParts[i].toLowerCase());
                break;
            case 'D':
                if (!/(0?[1-9]|[12][0-9]|3[01])/.test(dateParts[i])) return dateError('day');
                date.day = dateParts[i];
                break;
            case 'd':
                if (!/((11|12|13|30)th|31st|((0?|[1-2])((1st|2nd|3rd)|[04-9]th|)))/.test(dateParts[i])) return dateError('day');
                date.day = Number(dateParts[i].replace(/\D+/g, ''));
                break;
            case 'Y':
                if (!/[0-9]{2}/.test(dateParts[i])) return dateError('year');
                var currentYear = (new Date()).getFullYear();
                var century = currentYear.toString().substr(0,2);
                var year = currentYear.toString().substr(2);
                if (dateParts[i] < Number(year) + 20) {
                    date.year = century + dateParts[i];
                } else {
                    date.year = (century - 1).toString() + dateParts[i].toString();
                }
                break;
            case 'YY':
                if (!/[0-9]{4}/.test(dateParts[i])) return dateError('year');
                date.year = dateParts[i];
                break;
            default:
                console.error('Invalid date format ' + format);
                return false;
        }
    }
    var tDate = new Date(date.year,date.month,date.day);
    if (tDate.getDate() != date.day || tDate.getMonth() != date.month || tDate.getFullYear() != date.year) {
        console.error('Value is not a valid date');
        return false;
    }
    return true;
};

DateValidator.testDate = function testDate(v,f) {
    console.time('Date Validation');
    var format = this.testFormat(f);
    if (format) {
        var result = this.testDateInFormat(v,format);
        console.timeEnd('Date Validation');
        return result;
    }
    return false;
};