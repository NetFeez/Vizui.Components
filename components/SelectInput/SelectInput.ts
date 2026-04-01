import { Element, Component } from 'vizui';

export class SelectInput<options extends string[] = string[]> extends Component<'select', SelectInput.EventMap<options>> {
    static { this.css.load('${basicComponents}/SelectInput/SelectInput.css'); }

    protected root: Element<"select">;
    protected placeholder: string;
    public constructor(options: options, placeholder: string = 'select') { super();
        this.placeholder = placeholder;

        this.root = Element.new('select').setAttributes({
            name: 'select',
            class: 'selectInput'
        }).append(
            Element.new('option', this.placeholder),
            ...options.map(option => Element.new('option', option))
        );

        this.root.on('change', () => this.emit('submit', this.getSelected()));
    }
    public getSelected(): options[number] {
        if (this.root.root.value == this.placeholder) return '';
        return this.root.root.value;
    }
    public setSelected(option: options[number]) {
        this.root.root.value = option;
    }
}

export namespace SelectInput {
    export type Listener<options extends string[] = string[]> = (selected: options[number]) => void;
    export type EventMap<options extends string[] = string[]> = {
        submit: Listener<options>;
    }
}

export default SelectInput;