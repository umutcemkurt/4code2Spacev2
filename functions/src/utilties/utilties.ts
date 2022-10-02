export function calculateYesterdayOrTomorow(date1: Date, tomorrow = false) {


    if (tomorrow) {
        return date1.setDate(date1.getDate() + 1)
    }

    return date1.setDate(date1.getDate() - 1)


}

export function calcDate(date1:Date, date2:Date) {
    var diff = Math.floor(date1.getTime() - date2.getTime());
    var day = 1000 * 60 * 60 * 24;

    var days = Math.floor(diff / day);
    var months = Math.floor(days / 31);
    var years = Math.floor(months / 12);

    // var message = date2.toDateString();
    // message += " was "
    // message += days + " days "
    // message += months + " months "
    // message += years + " years ago \n"

    return {
        days,
        months,
        years
    }
}