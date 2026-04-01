import { Element, Component } from 'vizui';

export class NumericInput extends Component<'div', NumericInput.eventMap> {
    static { this.css.load('${basicComponents}/NumericInput/NumericInput.css'); }

    protected root: Element<"div">;
    private input: Element<"input">;
    private button?: Element<"button">;
    private validator: NumericInput.validator;
    constructor(options: NumericInput.options = {}) { super();
        this.validator = options.validator || (value => true);
        this.input = Element.new('input', null, {
            name: options.name || 'number', placeholder: options.placeholder || 'number',
        });

        this.root = Element.new('div', null, { class: 'NumericInput' });
        this.root.append(this.input);

        this.input.on('input', () => this.emit('input', this.value));
        this.input.on('keypress', (event) => {
            if (event.key == 'Enter') this.submit();
        });

        if (options.value) this.input.root.value = options.value.toString();
        if (options.id) this.root.id = options.id;
        if (options.button) {
            this.button = Element.new('button', options.button);
            this.root.append(this.button);
            this.button.on('click', () => this.submit());
        }
    }
    public get value(): number {
        const value = this.input.root.value || '0';
        const number = parseFloat(value);
        return isNaN(number) ? 0 : number;
    }
    public set value(value: number) { this.input.root.value = value.toString(); }
    public clear(): void { this.input.root.value = ''; }
    private submit(): void {
        const value = this.value;
        if (this.validator(value)) this.emit('submit', value);
        else this.emit('invalid', value);
    }
}

export namespace NumericInput {
    export interface options {
        placeholder?: string,
        class?: string,
        id?: string,
        value?: number,
        name?: string,
        button?: string,
        validator?: validator,
    }
    export type validator = (value: number) => boolean;
    export type Listener = (value: number) => void;
    export type eventMap = {
        submit: Listener,
        input: Listener,
        invalid: Listener,
    }
}

export default NumericInput;