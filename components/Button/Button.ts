/**
 * @author NetFeez <netfeez.dev@gmail.com>
 * @description Button component with label text and an optional leading image.
 * @license Apache-2.0
 */

import { Component, Element } from 'vizui';

import Utilities from '../Utilities.js';

export class Button extends Component<'button', Button.EventMap> {
    static { this.css.load('Button.css', import.meta); }

    public readonly root = Element.new('button').setClass('Button')
        .on('click',     (e) => this.emit('click', e))
        .on('mouseover', (e) => this.emit('hover', e));

    protected eText: Element<Element.Type['span']> | null = null;
    protected eImage: Element<Element.Type['img']> | null = null;
    protected eContainer: Element<Element.Type['div']> | null = null;

    /**
     * Create a button component with text and an optional image.
     * @param options - Optional configuration for the button, including id, class, and image.
     */
    public constructor(options: Button.Options = { text: 'button' }) { super();
        const { text = null, image = null } = options;

        this.text = !text && !image ? 'button' : text;
        this.image = image;

        Utilities.setIdentity(this, options);
    }

    public get text(): string { return this.eText ? this.eText.text : ''; }
    public set text(value: string | null) {
        if (!value) { this.resetText(); return; }
        if (this.eText) { this.eText.text = value; return; }
        this.eText = Element.new('span').setText(value);
        this.eContainer = Element.new('div')
            .setClass('text')
            .append(this.eText);
        this.root.append(this.eContainer);
    }

    public get image(): string { return this.eImage ? this.eImage.root.src : ''; }
    public set image(value: string | null) {
        if (!value) { this.resetImage(); return; }
        if (this.eImage) { this.eImage.root.src = value; return; }
        this.eImage = Element.new('img').setAttributes({ class: 'image', src: value });
        this.root.append(this.eImage);
    }

    /**
     * Resets the button's text and image, removing them from the DOM.
     * This method is useful for clearing the button's content before setting new text or image.
     */
    private resetText(): void {
        if (this.eText) this.eText.remove();
        if (this.eContainer) this.eContainer.remove();
        this.eContainer = this.eText = null;
    }

    /**
     * Resets the button's image, removing it from the DOM.
     * This method is useful for clearing the button's image before setting a new one.
     */
    private resetImage(): void {
        if (this.eImage) this.eImage.remove();
        this.eImage = null;
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
