import { Element, Events, Component } from 'vizui';
import TextInput from '../TextInput/TextInput.js';
import SelectInput from '../SelectInput/SelectInput.js';

export class MultiTagInput extends Component<'div', MultiTagInput.EventMap> {
    static { this.css.load('${basicComponents}/MultiTagInput/MultiTagInput.css'); }

    protected root: Element<"div">;
    protected tagInput: TextInput | SelectInput;
    protected tagContainer: Element<'div'>;
    protected limit: number;
    protected minim: number;
    protected tags: Set<string>;
    protected validator: MultiTagInput.Validator;
    public constructor(options: MultiTagInput.options = {}) { super();
        const optionsList = options.options ?? [];
        const placeholder = options.placeholder ?? 'tag';

        this.limit = options.limit ?? -1;
        this.minim = options.minim ?? -1;
        this.validator = options.validator ?? ((tag: string) => true);
        this.tags = new Set();

        this.tagContainer = Element.new('div').setAttribute('class', 'multiTagInput-container');

        if (optionsList.length <= 0) {
            this.tagInput = new TextInput({
                placeholder: placeholder,
                button: 'add',
                validator: this.validator,
            });
            this.tagInput.on('submit', (tag: string) => { this.addTag(tag) });
        } else {
            this.tagInput = new SelectInput(optionsList, placeholder);
            this.tagInput.on('submit', (tag: string) => { this.addTag(tag) });
        }
        
        this.root = Element.structure({
            type: 'div', attribs: { class: 'multiTagInput' }, childs: [
                this.tagContainer,
                this.tagInput.element
            ]
        });
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
        this.tags.delete(tag);
        tagElement.remove();
    }
    protected addTag(tag: string): Element<'span'> | void {
        if (this.tags.has(tag)) return;
        if (this.limit != -1 && this.tags.size >= this.limit) return this.emit('limit', tag);
        if (tag.length < 1 || !this.validator(tag)) return this.emit('invalid', tag);
        this.tags.add(tag);
        const newTag = this.newTag(tag);
        this.tagContainer.append(newTag);
        if (this.tagInput instanceof TextInput) this.tagInput.clear();
        this.emit('add', tag);
        return newTag;
    }
    public getTags() {
        return [...this.tags];
    }
}

export namespace MultiTagInput {
    export interface options {
        limit?: number,
        minim?: number,
        options?: string[],
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