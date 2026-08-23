/**
 * @author NetFeez <netfeez.dev@gmail.com>
 * @description Image file input with instant preview and loading feedback.
 * @license Apache-2.0
 */

import { Element, Component } from 'vizui';

import Loading from '../Loading/Loading.js';

export class LiveImageInput extends Component<'div', LiveImageInput.EventMap> {
    static { this.css.load('{{base}}/LiveImageInput/LiveImageInput.css'); }

    protected root: Element<'div'>;
    protected readonly eInputFile: Element<'input'>;
    protected readonly eLabel: Element<'label'>;
    protected readonly ePreview: Element<'img'>;
    protected readonly cLoading: Loading;

    protected readonly vId: string;
    protected readonly vDefaultSrc: string;
    protected readonly vAccept: LiveImageInput.Formats[];

    public constructor(options: LiveImageInput.Options = {}) {
        super();
        this.vAccept = options.accept ?? ['jpg', 'jpeg', 'png', 'gif'];
        this.vDefaultSrc = options.src ?? '';
        this.vId = 'liveImageInput-' + Math.random().toString(36).substring(2, 9);

        this.cLoading = new Loading();

        this.ePreview = Element.new('img').setAttributes({
            class: 'liveImageInput-preview',
            src: this.vDefaultSrc
        });
        this.eLabel = Element.new('label').setAttributes({
            for: this.vId,
            class: 'liveImageInput-label'
        }).append(this.ePreview);
        this.eInputFile = Element.new('input').setAttributes({
            type: 'file',
            accept: this.vAccept.map(format => '.' + format).join(','),
            required: '',
            name: 'image',
            placeholder: 'image',
            class: 'liveImageInput-input',
            id: this.vId
        }).on('change', (e) => this.loadPreview(e));

        this.root = Element.new('div')
        .setAttribute('class', `LiveImageInput${options.class ? ` ${options.class}` : ''}`)
        .append(this.eLabel, this.eInputFile);
        if (options.id) this.root.setAttribute('id', options.id);
    }
    public get src(): string { return this.ePreview.getAttribute('src') ?? ''; }
    public set src(src: string) {
        this.ePreview.setAttribute('src', src);
    }
    protected loadPreview(event?: Event): void {
        const file = this.eInputFile.root.files?.[0];
        if (!file) {
            this.ePreview.setAttribute('src', this.vDefaultSrc); return;
        }
        this.cLoading.spawn(this.eLabel);
        const reader = new FileReader();
        reader.onload = () => {
            this.ePreview.setAttribute('src', reader.result as string);
            this.cLoading.finish();
            this.emit('select', file, event);
        };
        reader.readAsDataURL(file);
    }
    public get file(): File | null { return this.eInputFile.root.files?.[0] ?? null; }
    public set file(file: File | null) {
        this.eInputFile.root.files = new FileList();
        if (file) this.eInputFile.root.files[0] = file;
        this.loadPreview();
    }
}
export namespace LiveImageInput {
    export type Formats = 'jpg' | 'jpeg' | 'png' | 'gif';
    export interface Options {
        accept?: Formats[];
        src?: string;
        class?: string;
        id?: string;
    }
    export type EventMap = {
        select: [file: File, event?: Event];
    };
}
export default LiveImageInput;
