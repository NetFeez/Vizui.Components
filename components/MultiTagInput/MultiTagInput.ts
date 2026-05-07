import { Element, Component } from 'vizui';

import TextInput from '../TextInput/TextInput.js';
import SelectInput from '../SelectInput/SelectInput.js';
import Utilities from '../Utilities.js';

export class MultiTagInput extends Component<'div', MultiTagInput.EventMap> {
    static { this.css.load('${basicComponents}/MultiTagInput/MultiTagInput.css'); }

    protected root: Element<"div">;
    
    protected vLimit: number;
    protected vMinim: number;
    protected vTags: Set<string>;
    protected vValidator: MultiTagInput.Validator;
    
    protected eContainer: Element<'div'>;
    protected cInput: TextInput | SelectInput;

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

        this.root = Element.new('div', null, { class: 'MultiTagInput' });
        this.eContainer = Element.new('div').setAttribute('class', 'container');

        if (optionsList.length <= 0) {
            this.cInput = new TextInput({
                input: { type: 'text', placeholder, validator: this.vValidator },
                button: { text: 'add' },
                class: 'input',
            });
            this.cInput.on('submit', (tag: string) => { this.addTag(tag) });
        } else {
            this.cInput = new SelectInput(optionsList, { placeholder, class: 'input' });
            this.cInput.on('submit', (tag: string) => { this.addTag(tag) });
        }
        
        Utilities.setIdentity(this, rootIdentity);
        this.root.append(this.eContainer, this.cInput);
    }
    protected newTag(tag: string): Element<'span'> {
        const tagElement = Element.new('span', tag)
        .setAttribute('class', 'multiTagInput-tag')
        .on('click',() => {
            this.deleteTag(tag, tagElement);
        });
        return tagElement;
    }
    protected deleteTag(tag: string, tagElement: Element<'span'>): void {
        this.vTags.delete(tag);
        tagElement.remove();
    }
    protected addTag(tag: string): Element<'span'> | void {
        if (this.vTags.has(tag)) return;
        if (this.vLimit != -1 && this.vTags.size >= this.vLimit) return this.emit('limit', tag);
        if (tag.length < 1 || !this.vValidator(tag)) return this.emit('invalid', tag);
        this.vTags.add(tag);
        const newTag = this.newTag(tag);
        this.eContainer.append(newTag);
        if (this.cInput instanceof TextInput) this.cInput.clear();
        this.emit('add', tag);
        return newTag;
    }
    public getTags() {
        return [...this.vTags];
    }
}

export namespace MultiTagInput {
    export interface Options extends Omit<Utilities.Identity, 'for'> {
        limit?: number,
        minim?: number,
        optionList?: string[],
        placeholder?: string,
        validator?: Validator,
    }
    export type Validator = (tag: string) => boolean
    export type EventMap = {
        add: [TaskSignal: string];
        invalid: [tag: string];
        limit: [tag: string];
    }
}

export default MultiTagInput;