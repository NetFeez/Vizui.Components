import { Element, Component } from 'vizui';

export class TextInput extends Component<'div', TextInput.EventMap> {
    static { this.css.load('${basicComponents}/TextInput/TextInput.css'); }
    protected root: Element<"div">;
    protected inputText: Element<"input"> | Element<"textarea">;
    protected button?: Element<"button">;
    protected validator: TextInput.validator;
    constructor(options: TextInput.options = {}) { super();
        const placeholder = options.placeholder ?? 'text';
        const textButton = options.button ?? '';
        const name = options.name ?? 'text';
        const type = options.type ?? 'text';

        this.validator = options.validator ?? ((text: string) => true);

        if (type == 'textarea') {
            this.inputText = Element.new('textarea').setAttributes({
                name: name,
                placeholder: placeholder,
            });
            if (options.value) this.inputText.root.value = options.value;
        } else {
            this.inputText = Element.new('input').setAttributes({
                type: type,
                name: name,
                placeholder: placeholder,
            });
            if (options.value) this.inputText.root.value = options.value;
        }

        if (textButton.length > 0) {
            this.button = Element.new('button', textButton);
        }

        this.root = Element.structure({
            type: 'div', attribs: { class: `textInput${options.class ? ` ${options.class}` : ''}` }, childs: [
                this.inputText, ...(this.button ? [this.button] : [])
            ]
        });
        if (options.id) this.root.setAttribute('id', options.id);

        this.button?.on('click', () => this.send());
        this.inputText.on('input', () => this.emit('input', this.getText()));
        this.inputText.on('keypress', (event) => {
            if (event.key == 'Enter') this.send();
        });
    }
    public get value(): string { return this.inputText.root.value; }
    public set value(value: string) { this.inputText.root.value = value; }
    protected send(): void {
        const text = this.getText();
        if (this.validator(text)) this.emit('submit', text);
        else this.emit('invalid', text);
    }
    public getText(): string {
        return this.inputText.root.value;
    }
    public clear(): void {
        this.inputText.root.value = '';
    }
}

export namespace TextInput {
    export interface options {
        placeholder?: string,
        type?: 'text' | 'textarea' | 'email' | 'password',
        class?: string,
        id?: string,
        value?: string,
        name?: string,
        button?: string,
        validator?: validator,
    }
    export type validator = (text: string) => boolean;
    export type EventMap = {
        submit: [text: string];
        input: [text: string];
        invalid: [text: string];
    }
}

export default TextInput;