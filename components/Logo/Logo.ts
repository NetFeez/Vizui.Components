/**
 * @author NetFeez <netfeez.dev@gmail.com>
 * @description Clickable logo component with text, image and an optional URL.
 * @license Apache-2.0
 */

import { Component, Element } from 'vizui';
import Utilities from '../Utilities.js';

export class Logo extends Component<'button', Logo.EventMap> {
    static { this.css.load('Logo.css', import.meta); }

    protected readonly eText = Element.new('p').setClass('text')
    protected readonly eImage = Element.new('img').setClass('image')

    public readonly root = Element.new('button')
        .setClass('Logo')
        .append(this.eText, this.eImage)
        .on('click',     (e) => this.emit('click', this.vLocation, e))
        .on('mouseover', (e) => this.emit('hover', this.vLocation, e));

    protected vLocation: string | null;

    /**
     * Create a logo component with text, an image, and an optional URL.
     * @param options - The options for the logo component.
     */
    public constructor(options: Logo.Options = {}) { super();
        const { text = 'Logo', icon = 'favicon.ico', location = null } = options;

        this.vLocation = location;
        this.eImage.root.src = icon;
        this.eText.text = text;

        Utilities.setIdentity(this, options);
    }

    public get text(): string { return this.eText.text; }
    public set text(text: string) { this.eText.text = text; }
    public get url(): string | null { return this.vLocation; }
    public set url(url: string | null) { this.vLocation = url || null; }
    public get image(): string { return this.eImage.root.src; }
    public set image(image: string) { this.eImage.setAttribute('src', image); }
}
export namespace Logo {
    export type EventMap = {
        click: [url: string | null, event: Event];
        hover: [url: string | null, event: Event];
    };

    export interface Options extends Omit<Utilities.Identity, 'for'> {
        text?: string;
        icon?: string;
        location?: string;
    };
}
export default Logo;
