/**
 * @author NetFeez <netfeez.dev@gmail.com>
 * @description Numeric input component with validation and submit/invalid events.
 * @license Apache-2.0
 */

import { Element, Component } from 'vizui';

export class NumericInput extends Component<'div', NumericInput.EventMap> {
    static { this.css.load('{{base}}/NumericInput/NumericInput.css'); }

    protected root: Element<'div'>;
    protected readonly eInput: Element<'input'>;
    protected eButton?: Element<'button'>;

    protected readonly vValidator: NumericInput.Validator;

    public constructor(options: NumericInput.Options = {}) {
        super();
        this.vValidator = options.validator || (value => true);
        this.eInput = Element.new('input', null, {
            name: options.name || 'number', placeholder: options.placeholder || 'number',
        });

        this.root = Element.new('div', null, { class: `NumericInput${options.class ? ` ${options.class}` : ''}` });
        this.root.append(this.eInput);

        this.eInput.on('input', (e) => this.emit('input', this.value, e));
        this.eInput.on('keypress', (event) => {
            if (event.key == 'Enter') this.submit(event);
        });

        if (options.value) this.eInput.root.value = options.value.toString();
        if (options.id) this.root.id = options.id;
        if (options.button) {
            this.eButton = Element.new('button', options.button);
            this.root.append(this.eButton);
            this.eButton.on('click', () => this.submit());
        }
    }
    public get value(): number {
        const value = this.eInput.root.value || '0';
        const number = parseFloat(value);
        return isNaN(number) ? 0 : number;
    }
    public set value(value: number) { this.eInput.root.value = value.toString(); }
    public clear(): void { this.eInput.root.value = ''; }
    private submit(event?: Event): void {
        const value = this.value;
        if (this.vValidator(value)) this.emit('submit', value, event);
        else this.emit('invalid', value, event);
    }
}

export namespace NumericInput {
    export interface Options {
        placeholder?: string;
        class?: string;
        id?: string;
        value?: number;
        name?: string;
        button?: string;
        validator?: Validator;
    }
    export type Validator = (value: number) => boolean;
    export type EventMap = {
        submit: [value: number, event?: Event];
        input: [value: number, event?: Event];
        invalid: [value: number, event?: Event];
    };
}

export default NumericInput;
