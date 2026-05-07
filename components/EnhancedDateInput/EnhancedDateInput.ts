import { Component, Element } from 'vizui';

import SelectInput from '../SelectInput/SelectInput.js';

import Month from './Month.js';
import Utilities from '../Utilities.js';

export class EnhancedDateInput extends Component<'div', EnhancedDateInput.EventMap> {
    static { this.css.load('${basicComponents}/EnhancedDateInput/EnhancedDateInput.css'); }

    protected static readonly MONTHS: string[] = [
        'January', 'February', 'March', 'April',
        'May', 'June', 'July', 'August',
        'September', 'October', 'November', 'December'
    ];

    protected root: Element<'div'>;

    protected cMonthSelect: SelectInput;
    protected cYearSelect: SelectInput;

    protected cMonth: Month;

    protected vSelectedDates: Map<number, Element<'span'>>;

    protected vLimit: number;
    protected vYearRange: number;
    protected vYearFillMode: EnhancedDateInput.YearFillMode;

    public constructor(options: EnhancedDateInput.Options = {}) { super();
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

        this.cMonthSelect.on('submit', () => {
            this.updateCalendar();
        });

        this.cYearSelect.on('submit', () => {
            this.updateCalendar();
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

    protected updateCalendar(): void {
        const month = this.cMonthSelect.getSelected();
        const year = parseInt(this.cYearSelect.getSelected(), 10);

        if (month === '' || isNaN(year)) return;

        const monthIndex = EnhancedDateInput.MONTHS.indexOf(month);

        this.cMonth.show(year, monthIndex);
        this.restoreSelections();
        this.emit('update', year, monthIndex + 1);
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

    protected toggleDate(date: Date): void {
        const key = date.getTime();
        const entry = this.cMonth.getDay(date.getDate());
        if (!entry) return;

        if (this.vSelectedDates.has(key)) {
            const selected = this.vSelectedDates.get(key);
            selected?.root.classList.remove('selected');
            this.vSelectedDates.delete(key);
            this.emit('removeDate', date);
        } else {
            if (this.vLimit >= 1 && this.vSelectedDates.size >= this.vLimit) {
                const [[oldKey, oldElement]] = this.vSelectedDates.entries();
                oldElement.root.classList.remove('selected');
                this.vSelectedDates.delete(oldKey);
                this.emit('removeDate', new Date(oldKey));
            }
            entry.element.root.classList.add('selected');
            this.vSelectedDates.set(key, entry.element);
            this.emit('addDate', date);
        }
        this.emit('dateChange', this.getSelected());
    }

    public getSelected(): Date[] {
        return [...this.vSelectedDates.keys()]
            .map(timestamp => new Date(timestamp));
    }

    public initialize(year: number, month: number, days: number[]): void {
        this.cYearSelect.setSelected(year.toString());
        this.cMonthSelect.setSelected(EnhancedDateInput.MONTHS[month - 1]);
        this.updateCalendar();

        for (const day of days) {
            const date = new Date(year, month - 1, day);
            this.toggleDate(date);
        }
        this.emit('initialize');
    }
}

export namespace EnhancedDateInput {
    export type YearFillMode = | 'both' | 'backWard' | 'forWard';
    export interface Options extends Omit<Utilities.Identity, 'for'> {
        limit?: number;
        yearRange?: number;
        yearFillMode?: YearFillMode;
    }
    export type EventMap = {
        dateChange: [dates: Date[]];
        addDate: [date: Date];
        removeDate: [date: Date];
        initialize: [];
        update: [year: number, month: number];
    }
}

export default EnhancedDateInput;