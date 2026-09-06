/**
 * @author NetFeez <netfeez.dev@gmail.com>
 * @description Image file input with instant preview and loading feedback.
 * @license Apache-2.0
 */

import { Component, Element } from 'vizui';

import Loading from '../Loading/Loading.js';
import Utilities from '../Utilities.js';

export class LiveImageInput extends Component<'div', LiveImageInput.EventMap> {
    static { this.css.load('LiveImageInput.css', import.meta); }

    protected readonly ePreview = Element.new('img').setClass('liveImageInput-preview');
    protected readonly eLabel = Element.new('label')
        .setClass('liveImageInput-label')
        .append(this.ePreview);
    protected readonly eInputFile = Element.new('input')
        .setClass('liveImageInput-input')
        .on('change', event => this.loadPreview(event));
    protected readonly cLoading = new Loading();
    public readonly root = Element.new('div')
        .setClass('LiveImageInput')
        .append(this.eLabel, this.eInputFile);
    
    protected readonly vDefaultSrc: string;
    protected readonly vAccept: LiveImageInput.Formats[];
    protected readonly vId = 'liveImageInput-' + Math.random().toString(36).substring(2, 9);

    public constructor(options: LiveImageInput.Options = {}) { super();
        this.vAccept = options.accept ?? ['jpg', 'jpeg', 'png', 'gif'];
        this.vDefaultSrc = options.src ?? '';
        this.ePreview.setAttribute('src', this.vDefaultSrc);
        this.eLabel.setAttribute('for', this.vId);
        this.eInputFile.setAttributes({
            type: 'file',
            accept: this.vAccept.map(format => '.' + format).join(','),
            required: '',
            name: 'image',
            placeholder: 'image',
            id: this.vId
        });
        Utilities.setIdentity(this, options);
    }
    public get src(): string { return this.ePreview.getAttribute('src') ?? ''; }
    public set src(src: string) {
        this.ePreview.setAttribute('src', src);
    }
    protected loadPreview(event?: Event): void {
        const file = this.eInputFile.root.files?.[0];
        if (!file) { this.ePreview.setAttribute('src', this.vDefaultSrc); return; }
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
        const dataTransfer = new DataTransfer();
        if (file) dataTransfer.items.add(file);
        this.eInputFile.root.files = dataTransfer.files;
        this.loadPreview();
    }
}
export namespace LiveImageInput {
    export type Formats = 'jpg' | 'jpeg' | 'png' | 'gif';
    export interface Options extends Omit<Utilities.Identity, 'for'> {
        accept?: Formats[];
        src?: string;
    }
    export type EventMap = {
        select: [file: File, event?: Event];
    };
}
export default LiveImageInput;
