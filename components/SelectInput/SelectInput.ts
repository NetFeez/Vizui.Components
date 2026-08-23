/**
 * @author NetFeez <netfeez.dev@gmail.com>
 * @description Select dropdown input component emitting submit events.
 * @license Apache-2.0
 */

import { Element, Component } from 'vizui';
import Utilities from '../Utilities.js';

export class SelectInput<TOption extends string[] = string[]> extends Component<'select', SelectInput.EventMap<TOption>> {
    static { this.css.load('{{base}}/SelectInput/SelectInput.css'); }

    protected root: Element<'select'>;
    protected vPlaceholder: string;

    public constructor(optionList: TOption, options: SelectInput.Options = {}) {
        super();
        const { placeholder = 'select', ...identity } = options;

        this.vPlaceholder = placeholder;

        const eOptions = [];
        eOptions.push(Element.new('option', placeholder).setAttribute('disabled', 'true'));
        eOptions.push(...optionList.map(option => Element.new('option', option)));

        this.root = Element.new('select', null, { name: 'select', class: 'SelectInput' });
        this.root.append(...eOptions);
        Utilities.setIdentity(this, identity);

        this.root.on('change', (e) => this.emit('submit', this.getSelected(), e));
    }
    public getSelected(): TOption[number] {
        if (this.root.root.value == this.vPlaceholder) return '';
        return this.root.root.value;
    }
    public setSelected(option: TOption[number]): void {
        this.root.root.value = option;
    }
}

export namespace SelectInput {
    export type EventMap<TOption extends string[] = string[]> = {
        submit: [selected: TOption[number], event: Event];
    };
    export interface Options extends Omit<Utilities.Identity, 'for'> {
        placeholder?: string;
    }
}

export default SelectInput;
