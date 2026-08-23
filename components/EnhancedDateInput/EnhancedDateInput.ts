/**
 * @author NetFeez <netfeez.dev@gmail.com>
 * @description Calendar-based date picker supporting multi-select with limits.
 * @license Apache-2.0
 */

import { Component, Element } from 'vizui';

import SelectInput from '../SelectInput/SelectInput.js';

import Month from './Month.js';
import Utilities from '../Utilities.js';

export class EnhancedDateInput extends Component<'div', EnhancedDateInput.EventMap> {
    static { this.css.load('{{base}}/EnhancedDateInput/EnhancedDateInput.css'); }

    protected root: Element<'div'>;

    protected readonly cMonthSelect: SelectInput;
    protected readonly cYearSelect: SelectInput;

    protected readonly cMonth: Month;

    protected static readonly MONTHS: string[] = [
        'January', 'February', 'March', 'April',
        'May', 'June', 'July', 'August',
        'September', 'October', 'November', 'December'
    ];

    protected readonly vSelectedDates: Map<number, Element<'span'>>;

    protected readonly vLimit: number;
    protected readonly vYearRange: number;
    protected readonly vYearFillMode: EnhancedDateInput.YearFillMode;

    public constructor(options: EnhancedDateInput.Options = {}) {
        super();
        const {
            limit = 1,
            yearRange = 10,
            yearFillMode = 'both'
        } = options;

        this.vLimit = limit;
        this.vYearRange = yearRange;
        this.vYearFillMode = yearFillMode;

        this.vSelectedDates = new Map();

        this.cMonthSelect = this.newMonthSelect();
        this.cYearSelect = this.newYearSelect();

        this.cMonth = new Month();

        this.root = Element.new('div', null, {
            class: 'EnhancedDateInput'
        });

        this.root.append(
            this.newSelectContainer(),
            this.cMonth
        );

        this.cMonthSelect.on('submit', (e) => {
            this.updateCalendar(e as unknown as Event);
        });

        this.cYearSelect.on('submit', (e) => {
            this.updateCalendar(e as unknown as Event);
        });

        this.cMonth.on('select', (date: Date) => {
            this.toggleDate(date);
        });

        this.updateCalendar();
    }

    protected newSelectContainer(): Element<'div'> {
        return Element.new('div', null, {
            class: 'selects'
        }).append(
            this.cMonthSelect,
            this.cYearSelect
        );
    }

    protected newMonthSelect(): SelectInput {
        return new SelectInput(
            EnhancedDateInput.MONTHS,
            { placeholder: 'Month' }
        );
    }

    protected newYearSelect(): SelectInput {
        const currentYear = new Date().getFullYear();

        const length = ['backWard', 'forWard'].includes(this.vYearFillMode)
            ? this.vYearRange + 1
            : (this.vYearRange * 2) + 1;

        const startYear = this.vYearFillMode === 'forWard'
            ? currentYear
            : currentYear - this.vYearRange;

        const years = Array.from(
            { length },
            (_, i) => (startYear + i).toString()
        );

        return new SelectInput(
            years,
            { placeholder: 'Year' }
        );
    }

    protected updateCalendar(event?: Event): void {
        const month = this.cMonthSelect.getSelected();
        const year = parseInt(this.cYearSelect.getSelected(), 10);

        if (month === '' || isNaN(year)) return;

        const monthIndex = EnhancedDateInput.MONTHS.indexOf(month);

        this.cMonth.show(year, monthIndex);
        this.restoreSelections();
        this.emit('update', year, monthIndex + 1, event);
    }

    protected restoreSelections(): void {
        for (const [timestamp] of this.vSelectedDates) {
            const date = new Date(timestamp);
            const currentMonth = EnhancedDateInput.MONTHS.indexOf(this.cMonthSelect.getSelected());
            const currentYear = parseInt(this.cYearSelect.getSelected(), 10);

            if (date.getMonth() !== currentMonth || date.getFullYear() !== currentYear) continue;
            const entry = this.cMonth.getDay(date.getDate());
            if (!entry) continue;
            entry.element.root.classList.add('selected');
            this.vSelectedDates.set(timestamp, entry.element);
        }
    }

    protected toggleDate(date: Date, event?: Event): void {
        const key = date.getTime();
        const entry = this.cMonth.getDay(date.getDate());
        if (!entry) return;

        if (this.vSelectedDates.has(key)) {
            const selected = this.vSelectedDates.get(key);
            selected?.root.classList.remove('selected');
            this.vSelectedDates.delete(key);
            this.emit('removeDate', date, event);
        } else {
            if (this.vLimit >= 1 && this.vSelectedDates.size >= this.vLimit) {
                const [[oldKey, oldElement]] = this.vSelectedDates.entries();
                oldElement.root.classList.remove('selected');
                this.vSelectedDates.delete(oldKey);
                this.emit('removeDate', new Date(oldKey), event);
            }
            entry.element.root.classList.add('selected');
            this.vSelectedDates.set(key, entry.element);
            this.emit('addDate', date, event);
        }
        this.emit('dateChange', this.getSelected(), event);
    }

    public getSelected(): Date[] {
        return [...this.vSelectedDates.keys()]
            .map(timestamp => new Date(timestamp));
    }

    public initialize(year: number, month: number, days: number[], event?: Event): void {
        this.cYearSelect.setSelected(year.toString());
        this.cMonthSelect.setSelected(EnhancedDateInput.MONTHS[month - 1]);
        this.updateCalendar(event);

        for (const day of days) {
            const date = new Date(year, month - 1, day);
            this.toggleDate(date, event);
        }
        this.emit('initialize', event);
    }
}

export namespace EnhancedDateInput {
    export type YearFillMode = 'both' | 'backWard' | 'forWard';
    export interface Options extends Omit<Utilities.Identity, 'for'> {
        limit?: number;
        yearRange?: number;
        yearFillMode?: YearFillMode;
    }
    export type EventMap = {
        dateChange: [dates: Date[], event?: Event];
        addDate: [date: Date, event?: Event];
        removeDate: [date: Date, event?: Event];
        initialize: [event?: Event];
        update: [year: number, month: number, event?: Event];
    };
}

export default EnhancedDateInput;
