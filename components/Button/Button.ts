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

    private readonly eText: Element<'span'>;
    private readonly eImage: Element<'img'>;

    /**
     * Create a button component with text and an optional image.
     * @param text - The text to display on the button.
     * @param options - Optional configuration for the button, including id, class, and image.
     */
    public constructor(text: string, options: Button.Options = {}) { super();
        this.root = Element.new('button', null, { class: 'Button' });

        this.eText = Element.new('span', text);
        this.eImage = Element.new('img', null, { class: 'image' });

        const eTextContainer = Element.new('div', null, { class: 'text' }).append(this.eText);

        this.root.append(this.eImage, eTextContainer);

        this.root.on('click', (e) => this.emit('click', e));
        this.root.on('mouseover', (e) => this.emit('hover', e));

        Utilities.setIdentity(this, options);
        this.image = options.image || null;
    }
    public get text(): string { return this.eText.text; }
    public set text(text: string) { this.eText.text = text; }
    public get image(): string { return this.eImage.root.src; }
    public set image(value: string | null) {
        this.eImage.root.src = value || '';
        if (!value) this.eImage.remove();
        else this.eImage.appendTo(this.root);
    }
}
export namespace Button {
    export type EventMap = {
        click: [e: Event];
        hover: [e: Event];
    };
    export type Options = {
        id?: string;
        class?: string;
        image?: string;
    };
}
export default Button;
