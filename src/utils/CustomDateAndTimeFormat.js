import moment from 'moment'

export const CustomDateFormat = (date) => {
    if (!date) return ''
    const parsed = moment(date, [moment.ISO_8601, 'YYYY/MM/DD HH:mm', 'YYYY-MM-DD HH:mm'], true)
    return parsed.isValid() ? parsed.format('ll') : moment(date).format('ll')
}
