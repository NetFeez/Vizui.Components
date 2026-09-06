/**
 * @author NetFeez <netfeez.dev@gmail.com>
 * @description Tag input component supporting free text or predefined options.
 * @license Apache-2.0
 */

import { Component, Element } from 'vizui';

import TextInput from '../TextInput/TextInput.js';
import SelectInput from '../SelectInput/SelectInput.js';
import Utilities from '../Utilities.js';

export class MultiTagInput extends Component<'div', MultiTagInput.EventMap> {
    static { this.css.load('MultiTagInput.css', import.meta); }

    public readonly root = Element.new('div').setClass('MultiTagInput');
    protected readonly eContainer: Element<Element.Type['div']>;
    protected readonly cInput: TextInput | SelectInput;

    protected readonly vLimit: number;
    protected readonly vMinim: number;
    protected vTags: Set<string>;
    protected readonly vValidator: MultiTagInput.Validator;

    public constructor(options: MultiTagInput.Options = {}) { super();
        const {
            optionList: optionsList = [], placeholder = 'tag',
            limit = -1, minim = -1, validator = (tag: string) => true,
            ...rootIdentity
        } = options;

        this.vLimit = limit;
        this.vMinim = minim;
        this.vTags = new Set();
        this.vValidator = validator;

        this.eContainer = Element.new('div').setClass('container');

        if (optionsList.length <= 0) {
            this.cInput = new TextInput({
                input: { type: 'text', placeholder, validator: this.vValidator },
                button: { text: 'add' },
                class: 'input',
            });
            this.cInput.on('submit', (tag: string, e?: Event) => { this.addTag(tag, e); });
        } else {
            this.cInput = new SelectInput(optionsList, { placeholder, class: 'input' });
            this.cInput.on('submit', (tag: string, e: Event) => { this.addTag(tag, e); });
        }

        Utilities.setIdentity(this, rootIdentity);
        this.root.append(this.eContainer, this.cInput);
    }
    protected newTag(tag: string): Element<Element.Type['span']> {
        const eTag = Element.new('span').setText(tag)
            .setClass('tag')
            .on('click', () => this.deleteTag(tag, eTag));
        return eTag;
    }
    protected deleteTag(tag: string, eTag: Element<Element.Type['span']>): void {
        this.vTags.delete(tag);
        eTag.remove();
    }
    protected addTag(tag: string, event?: Event): Element<Element.Type['span']> | void {
        if (this.vTags.has(tag)) return;
        if (this.vLimit !== -1 && this.vTags.size >= this.vLimit) return this.emit('limit', tag, event);
        if (tag.length < 1 || !this.vValidator(tag)) return this.emit('invalid', tag, event);
        this.vTags.add(tag);
        const eNewTag = this.newTag(tag);
        this.eContainer.append(eNewTag);
        if (this.cInput instanceof TextInput) this.cInput.clear();
        this.emit('add', tag, event);
        return eNewTag;
    }
    public getTags(): string[] {
        return [...this.vTags];
    }
}

export namespace MultiTagInput {
    export interface Options extends Omit<Utilities.Identity, 'for'> {
        limit?: number;
        minim?: number;
        optionList?: string[];
        placeholder?: string;
        validator?: Validator;
    }
    export type Validator = (tag: string) => boolean;
    export type EventMap = {
        add: [tag: string, event?: Event];
        invalid: [tag: string, event?: Event];
        limit: [tag: string, event?: Event];
    };
}

export default MultiTagInput;
