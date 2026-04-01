import { Component, Element } from 'vizui';

export class Logo extends Component<'button', Logo.eventMap> {
    static { this.css.load('${basicComponents}/Logo/Logo.css'); }

    protected root: Element<"button">;

    protected eText: Element<'p'>;
    protected eImage: Element<'img'>;

    protected vUrl: string | null;

    /**
     * Create a logo component with text, an image, and an optional URL.
     * @param text - The text to display next to the logo image.
     * @param image - The source URL of the logo image.
     * @param url - An optional URL to navigate to when the logo is clicked.
     */
    public constructor(text: string, image: string, url: string | null = null) { super();
        this.vUrl = url;
        this.root = Element.new('button', null, { class: 'Logo' });
        this.eImage = Element.new('img', null, { class: 'image', src: image || '' });
        this.eText = Element.new('p', text, { class: 'text' });
        this.root.append(this.eImage, this.eText);

        this.root.on('click', () => this.emit('click', this.vUrl));
        this.root.on('mouseover', () => this.emit('hover', this.vUrl));
    }
    public get text(): string { return this.eText.text; }
    public set text(text: string) { this.eText.text = text; }
    public get url(): string | null { return this.vUrl; }
    public set url(url: string | null) { this.vUrl = url || null; }
    public get image(): string { return this.eImage.root.src; }
    public set image(image: string) { this.eImage.setAttribute('src', image); }
}
export namespace Logo {
    type callback = (url: string | null) => void
    export type eventMap = {
        click: callback;
        hover: callback;
    }
}
export default Logo;