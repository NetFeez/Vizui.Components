/**
 * @author NetFeez <netfeez.dev@gmail.com>
 * @description Weekday header row for calendar components.
 * @license Apache-2.0
 */

import { Component, Element } from 'vizui';

export class WeekHeader extends Component<'div'> {
    static { this.css.load('{{base}}/EnhancedDateInput/WeekHeader.css'); }

    protected root: Element<'div'>;

    protected static readonly WEEKDAYS: string[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    public constructor() {
        super();
        this.root = Element.new('div', null, { class: 'WeekHeader' });
        WeekHeader.WEEKDAYS.forEach(day => {
            const eDay = Element.new('span', day, { class: 'weekDay' });
            this.root.append(eDay);
        });
    }
}
export namespace WeekHeader {}
export default WeekHeader;
