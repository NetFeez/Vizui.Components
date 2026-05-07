import { Component, Element } from 'vizui';

import WeekHeader from './WeekHeader.js';

export class Month extends Component<'div', Month.EventMap> {
    protected root: Element<'div'>;

    protected eDays: Element<'div'>;
    protected vDays: Map<number, Month.EntryDay>;

    public constructor() { super();
        this.vDays = new Map();
        this.root = Element.new('div', null, { class: 'Month' });
        this.eDays = Element.new('div', null, { class: 'days' });
        this.root.append(new WeekHeader(), this.eDays);
    }

    public show(year: number, month: number): void {
        this.eDays.clean();
        this.vDays.clear();

        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDay = new Date(year, month, 1).getDay();

        const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1;

        let week = this.newWeek();

        for (let i = 0; i < adjustedFirstDay; i++) {
            const eDay = this.newEmptyDay();
            week.append(eDay);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            if (week.root.childNodes.length >= 7) {
                this.eDays.append(week);
                week = this.newWeek();
            }
            const date = new Date(year, month, day);
            const dateElement = this.newDay(day, date);
            week.append(dateElement);
            this.vDays.set(day, { date, element: dateElement });
        }
        while (week.root.childNodes.length < 7) {
            week.append(this.newEmptyDay());
        }
        this.eDays.append(week);
        this.emit('show', year, month + 1);
    }

    public getDay(day: number): Month.EntryDay | undefined {
        return this.vDays.get(day);
    }

    protected newWeek(): Element<'div'> {
        return Element.new('div', null, { class: 'week' });
    }

    protected newEmptyDay(): Element<'span'> {
        return Element.new('span', null, { class: 'date empty' });
    }
    protected newDay(day: number, date: Date): Element<'span'> {
        const eDay = Element.new('span', `${day}`, { class: 'date' });
        eDay.on('click', () => { this.emit('select', date); });
        return eDay;
    }
}

export namespace Month {
    export interface EntryDay {
        date: Date;
        element: Element<'span'>;
    }

    export type EventMap = {
        select: [date: Date];
        show: [year: number, month: number];
    }
}

export default Month;