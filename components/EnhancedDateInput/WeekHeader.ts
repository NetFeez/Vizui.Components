import { Component, Element } from 'vizui';

export class WeekHeader extends Component<'div'> {
    static { /* this.css.load('/components/EnhancedDateInput/WeekHeader.css'); */ }

    protected static readonly WEEKDAYS: string[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    protected root: Element<'div'>;

    public constructor() { super();
        this.root = Element.new('div', null, { class: 'WeekHeader' });
        WeekHeader.WEEKDAYS.forEach(day => {
            const eDay = Element.new('span', day, { class: 'weekDay' });
            this.root.append(eDay);
        });
    }
}
export namespace WeekHeader {}
export default WeekHeader;