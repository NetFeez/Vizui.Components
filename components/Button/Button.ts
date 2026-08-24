/**
 * @author NetFeez <netfeez.dev@gmail.com>
 * @description Button component with label text and an optional leading image.
 * @license Apache-2.0
 */

import { Component, Element } from 'vizui';

import Utilities from '../Utilities.js';

export class Button extends Component<'button', Button.EventMap> {
    static { this.css.load('{{base}}/Button/Button.css'); }

    protected root: Element<'button'>;

    protected eText: Element<'span'> | null;
    protected eImage: Element<'img'> | null;

    /**
     * Create a button component with text and an optional image.
     * @param options - Optional configuration for the button, including id, class, and image.
     */
    public constructor(options: Button.Options = {}) { super();
        this.root = Element.new('button', null, { class: 'Button' });
        this.eText = this.eImage = null;

        if (options.image) {
            this.eImage = Element.new('img', null, { class: 'image', src: options.image });
            this.root.append(this.eImage);
        }
        if (options.text) {
            this.eText = Element.new('span', options.text);
            const container = Element.new('div', null, { class: 'text' }).append(this.eText);
            this.root.append(container);
        }


        this.root.on('click', (e) => this.emit('click', e));
        this.root.on('mouseover', (e) => this.emit('hover', e));

        Utilities.setIdentity(this, options);
    }
    public get text(): string { return this.eText ? this.eText.text : ''; }
    public set text(text: string) {
        if (this.eText) this.eText.text = text;
        else {
            this.eText = Element.new('span', text);
            const container = Element.new('div', null, { class: 'text' }).append(this.eText);
            this.root.append(container);
        }
    }
    public get image(): string { return this.eImage ? this.eImage.root.src : ''; }
    public set image(value: string | null) {
        if (!value) {
            if (this.eImage) this.eImage.remove();
            this.eImage = null;
            return;
        }
        if (!this.eImage) {
            this.eImage = Element.new('img', null, { class: 'image', src: value });
            this.root.append(this.eImage);
        } else this.eImage.root.src = value;
    }
}
export namespace Button {
    export type EventMap = {
        click: [e: Event];
        hover: [e: Event];
    };
    export interface Options extends Omit<Utilities.Identity, 'for'> {
        text?: string;
        image?: string;
    };
}
export default Button;
