import { Element, Component } from 'vizui';
import Utilities from '../Utilities';

export class SelectInput<options extends string[] = string[]> extends Component<'select', SelectInput.EventMap<options>> {
    static { this.css.load('${basicComponents}/SelectInput/SelectInput.css'); }

    protected root: Element<"select">;
    protected vPlaceholder: string;

    public constructor(optionList: options, options: SelectInput.Options = {}) { super();
        const { placeholder = 'select', ...identity } = options;

        this.vPlaceholder = placeholder;

        const optionElements = [];
        optionElements.push(Element.new('option', placeholder).setAttribute('disabled', 'true'));
        optionElements.push(...optionList.map(option => Element.new('option', option)));

        this.root = Element.new('select', null, { name: 'select', class: 'selectInput' });
        this.root.append(...optionElements);

        this.root.on('change', () => this.emit('submit', this.getSelected()));
    }
    public getSelected(): options[number] {
        if (this.root.root.value == this.vPlaceholder) return '';
        return this.root.root.value;
    }
    public setSelected(option: options[number]) {
        this.root.root.value = option;
    }
}

export namespace SelectInput {
    export type EventMap<options extends string[] = string[]> = {
        submit: [selected: options[number]];
    }
    export interface Options extends Omit<Utilities.Identity, 'for'> {
        placeholder?: string;
    }
}

export default SelectInput;