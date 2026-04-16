import { Element, Component } from 'vizui';

import Loading from '../Loading/Loading.js';

export class LiveImageInput extends Component<'div', LiveImageInput.EventMap> {
    static { this.css.load('${basicComponents}/LiveImageInput/LiveImageInput.css'); }

    protected root: Element<"div">;
    protected inputFile: Element<"input">;
    protected label: Element<"label">;
    protected preview: Element<"img">;
    protected id: string;
    protected default: string;
    protected accept: LiveImageInput.formats[];
    protected loading: Loading;
    constructor(options: LiveImageInput.options = {}) { super();
        this.accept = options.accept ?? ['jpg', 'jpeg', 'png', 'gif'];
        this.default = options.src ?? '';
        this.id = 'liveImageInput-' + Math.random().toString(36).substring(2, 9);

        this.loading = new Loading('/client/assets/logo.png');

        this.preview = Element.new('img').setAttributes({
            class: 'liveImageInput-preview',
            src: this.default
        });
        this.label = Element.new('label').setAttributes({
            for: this.id,
            class: 'liveImageInput-label'
        }).append(this.preview);
        this.inputFile = Element.new('input').setAttributes({
            type: 'file',
            accept: this.accept.map(format => '.' + format).join(','),
            required: '',
            name: 'image',
            placeholder: 'image',
            class: 'liveImageInput-input',
            id: this.id
        }).on('change', () => this.loadPreview());

        this.root = Element.new('div')
        .setAttribute('class', `LiveImageInput${options.class ? ` ${options.class}` : ''}`)
        .append(this.label, this.inputFile);
        if (options.id) this.root.setAttribute('id', options.id);
    }
    public get src(): string { return this.preview.getAttribute('src') ?? ''; }
    public set src(src: string) {
        this.preview.setAttribute('src', src);
    }
    protected loadPreview(): void {
        const file = this.inputFile.root.files?.[0];
        if (!file) {
            this.preview.setAttribute('src', this.default); return;
        }
        this.loading.spawn(this.label);
        const reader = new FileReader();
        reader.onload = () => {
            this.preview.setAttribute('src', reader.result as string);
            this.loading.finish();
            this.emit('select', file);
        };
        reader.readAsDataURL(file);
    }
    public get file(): File | null { return this.inputFile.root.files?.[0] ?? null; }
    public set file(file: File | null) {
        this.inputFile.root.files = new FileList();
        if (file) this.inputFile.root.files[0] = file;
        this.loadPreview();
    }
}
export namespace LiveImageInput {
    export type formats = 'jpg' | 'jpeg' | 'png' | 'gif';
    export interface options {
        accept?: formats[];
        src?: string;
        class?: string;
        id?: string;
    }
    export type EventMap = {
        select: [file: File];
    }
}

export default LiveImageInput;