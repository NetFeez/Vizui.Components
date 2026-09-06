/**
 * @author NetFeez <netfeez.dev@gmail.com>
 * @description Monthly calendar grid component emitting day selection events.
 * @license Apache-2.0
 */

import { Component, Element } from 'vizui';

import WeekHeader from './WeekHeader.js';

export class Month extends Component<'div', Month.EventMap> {
    static { this.css.load('Month.css', import.meta); }

    public readonly root = Element.new('div').setClass('Month');

    protected readonly eBody = Element.new('div').setClass('body');
    protected readonly vDays: Map<number, Month.EntryDay>;

    public constructor() { super();
        this.vDays = new Map();
        this.root.append(new WeekHeader(), this.eBody);
    }

    public show(year: number, month: number): void {
        this.eBody.clean();
        this.vDays.clear();

        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDay = new Date(year, month, 1).getDay();

        const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1;

        let eWeek = this.newWeek();

        for (let i = 0; i < adjustedFirstDay; i++) {
            const eDay = this.newEmptyDay();
            eWeek.append(eDay);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            if (eWeek.root.childNodes.length >= 7) {
                this.eBody.append(eWeek);
                eWeek = this.newWeek();
            }
            const date = new Date(year, month, day);
            const eDate = this.newDay(day, date);
            eWeek.append(eDate);
            this.vDays.set(day, { date, element: eDate });
        }
        while (eWeek.root.childNodes.length < 7) {
            eWeek.append(this.newEmptyDay());
        }
        this.eBody.append(eWeek);
        this.emit('show', year, month + 1);
    }

    public getDay(day: number): Month.EntryDay | undefined {
        return this.vDays.get(day);
    }

    protected newWeek(): Element<Element.Type['div']> {
        return Element.new('div').setClass('week');
    }

    protected newEmptyDay(): Element<Element.Type['span']> {
        return Element.new('span').setClass('day empty');
    }
    protected newDay(day: number, date: Date): Element<Element.Type['span']> {
        const eDay = Element.new('span').setText(`${day}`).setClass('day');
        eDay.on('click', () => this.emit('select', date));
        return eDay;
    }
}

export namespace Month {
    export interface EntryDay {
        date: Date;
        element: Element<Element.Type['span']>;
    }

    export type EventMap = {
        select: [date: Date];
        show: [year: number, month: number];
    };
}

export default Month;
