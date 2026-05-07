import { Element, Component } from 'vizui';

import Button from '../Button/Button.js';
import Utilities from '../Utilities.js';

export class TextInput extends Component<'div', TextInput.EventMap> {
    static { this.css.load('${basicComponents}/TextInput/TextInput.css'); }

    protected root: Element<"div">;
    protected eInput: Element<"input"> | Element<"textarea">;
    protected cButton?: Button;
    protected validator: TextInput.Validator;

    constructor(options: TextInput.Options = {}) { super();
        const { input = {}, button = {}, ...rootIdentity } = options;
        const { placeholder = '', type = 'text', value = '', validator = () => true, ...inputIdentity } = input;
        const { text, icon, ...buttonIdentity } = button;
        
        this.validator = validator;

        this.root = Element.new('div', null, { class: 'TextInput' });
        Utilities.setIdentity(this, rootIdentity);

        this.eInput = type === 'textarea'
            ? Element.new('textarea', null, { class: 'input', placeholder })
            : Element.new('input', null, { class: 'input', type, placeholder });

        Utilities.setIdentity(this.eInput, inputIdentity);
        if (value) this.eInput.root.value = value;
        this.append(this.eInput);

        this.eInput.on('input', () => this.emit('input', this.value));
        this.eInput.on('keypress', (event) => {
            if (event.key == 'Enter') this.handle();
        });

        if (text || icon) {
            this.cButton = new Button(text || '', { image: icon, class: 'button', });
            Utilities.setIdentity(this.cButton, buttonIdentity);
            this.cButton.on('click', () => this.handle());
            this.append(this.cButton);
        }
    }

    public get value(): string { return this.eInput.root.value; }
    public set value(value: string) { this.eInput.root.value = value; }

    /** Clears the text input, setting its value to an empty string. */
    public clear(): void { this.eInput.root.value = ''; }
    /** Sends the current text value, emitting a 'submit' event if the value is valid according to the validator, or an 'invalid' event if it is not. */
    protected handle(): void {
        const text = this.eInput.root.value;
        if (this.validator(text)) this.emit('submit', text);
        else this.emit('invalid', text);
    }
}

export namespace TextInput {
    export type EventMap = {
        submit: [text: string];
        input: [text: string];
        invalid: [text: string];
    }
    export type Validator = (text: string) => boolean;
    export interface InputOptions extends Omit<Utilities.Identity, 'for'> {
        placeholder?: string,
        type?: 'text' | 'textarea' | 'email' | 'password',
        value?: string,
        validator?: Validator,
    }
    export interface ButtonOptions extends Omit<Utilities.Identity, 'for'> {
        text?: string,
        icon?: string,
    }
    export interface Options extends Omit<Utilities.Identity, 'for'> {
        input?: InputOptions;
        button?: ButtonOptions;
    }
}

export default TextInput;