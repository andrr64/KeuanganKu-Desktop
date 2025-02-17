export enum DateRange {
    WEEK = 'This Week',
    MONTH  = 'This Month',
    YEAR = 'This Year'
}

export const dateRangeMenuItems = [
    { label: DateRange.WEEK, value: DateRange.WEEK },
    { label: DateRange.MONTH, value: DateRange.MONTH },
    { label: DateRange.YEAR, value: DateRange.YEAR },
]