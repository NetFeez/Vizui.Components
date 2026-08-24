/**
 * @author NetFeez <netfeez.dev@gmail.com>
 * @description Text input component with validation and submit/invalid events.
 * @license Apache-2.0
 */

import { Element, Component } from 'vizui';

import Button from '../Button/Button.js';
import Utilities from '../Utilities.js';

export class TextInput extends Component<'div', TextInput.EventMap> {
    static { this.css.load('{{base}}/TextInput/TextInput.css'); }

    protected root: Element<'div'>;
    protected readonly eInput: Element<'input'> | Element<'textarea'>;
    protected readonly cButton?: Button;

    protected readonly vValidator: TextInput.Validator;

    public constructor(options: TextInput.Options = {}) {
        super();
        const { input = {}, button = {}, ...rootIdentity } = options;
        const { placeholder = '', type = 'text', value = '', validator = () => true, ...inputIdentity } = input;
        const { text, icon, ...buttonIdentity } = button;

        this.vValidator = validator;

        this.root = Element.new('div', null, { class: 'TextInput' });
        Utilities.setIdentity(this, rootIdentity);

        this.eInput = type === 'textarea'
            ? Element.new('textarea', null, { class: 'input', placeholder })
            : Element.new('input', null, { class: 'input', type, placeholder });

        Utilities.setIdentity(this.eInput, inputIdentity);
        if (value) this.eInput.root.value = value;
        this.append(this.eInput);

        this.eInput.on('input', (e) => this.emit('input', this.value, e));
        this.eInput.on('keypress', (event) => {
            if (event.key == 'Enter') this.handle(event);
        });

        if (text || icon) {
            this.cButton = new Button({ text: text || '', image: icon, class: 'button' });
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
    protected handle(event?: Event): void {
        const text = this.eInput.root.value;
        if (this.vValidator(text)) this.emit('submit', text, event);
        else this.emit('invalid', text, event);
    }
}

export namespace TextInput {
    export type EventMap = {
        submit: [text: string, event?: Event];
        input: [text: string, event?: Event];
        invalid: [text: string, event?: Event];
    };
    export type Validator = (text: string) => boolean;
    export interface InputOptions extends Omit<Utilities.Identity, 'for'> {
        placeholder?: string;
        type?: 'text' | 'textarea' | 'email' | 'password';
        value?: string;
        validator?: Validator;
    }
    export interface ButtonOptions extends Omit<Utilities.Identity, 'for'> {
        text?: string;
        icon?: string;
    }
    export interface Options extends Omit<Utilities.Identity, 'for'> {
        input?: InputOptions;
        button?: ButtonOptions;
    }
}

export default TextInput;
