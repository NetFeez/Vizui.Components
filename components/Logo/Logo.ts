/**
 * @author NetFeez <netfeez.dev@gmail.com>
 * @description Clickable logo component with text, image and an optional URL.
 * @license Apache-2.0
 */

import { Component, Element } from 'vizui';

export class Logo extends Component<'button', Logo.EventMap> {
    static { this.css.load('{{base}}/Logo/Logo.css'); }

    protected root: Element<'button'>;

    protected readonly eText: Element<'p'>;
    protected readonly eImage: Element<'img'>;

    protected vUrl: string | null;

    /**
     * Create a logo component with text, an image, and an optional URL.
     * @param text - The text to display next to the logo image.
     * @param image - The source URL of the logo image.
     * @param url - An optional URL to navigate to when the logo is clicked.
     */
    public constructor(text: string, image: string, url: string | null = null) {
        super();
        this.vUrl = url;
        this.root = Element.new('button', null, { class: 'Logo' });
        this.eImage = Element.new('img', null, { class: 'image', src: image || '' });
        this.eText = Element.new('p', text, { class: 'text' });
        this.root.append(this.eImage, this.eText);

        this.root.on('click', (e) => this.emit('click', this.vUrl, e));
        this.root.on('mouseover', (e) => this.emit('hover', this.vUrl, e));
    }
    public get text(): string { return this.eText.text; }
    public set text(text: string) { this.eText.text = text; }
    public get url(): string | null { return this.vUrl; }
    public set url(url: string | null) { this.vUrl = url || null; }
    public get image(): string { return this.eImage.root.src; }
    public set image(image: string) { this.eImage.setAttribute('src', image); }
}
export namespace Logo {
    export type EventMap = {
        click: [url: string | null, event: Event];
        hover: [url: string | null, event: Event];
    };
}
export default Logo;
