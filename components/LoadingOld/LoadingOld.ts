/**
 * @author NetFeez <netfeez.dev@gmail.com>
 * @description Legacy multi-ring animated loading overlay, kept for backwards compatibility.
 * @license Apache-2.0
 */

import { Element, Component } from 'vizui';

export class LoadingOld extends Component<'div'> {
    static { this.css.load('{{base}}/LoadingOld/LoadingOld.css'); }

    protected root: Element<'div'>;
    public constructor(icon: string) {
        super();
        this.root = Element.structure({
            type: 'div', attribs: { class: 'LoadingOld LoadingOld-spawning' }, childs: [
                { type: 'div', childs: [
                    { type: 'img', attribs: { src: icon } },
                    { type: 'span' }, { type: 'span' }
                ] }
            ]
        });
    }
    public spawn(parent: Element, duration: number = 500, solid: boolean = false): void {
        if (solid) this.root.setAttribute('solid', '');
        parent.append(this.root);
        this.root.animate([
            { opacity: 0 },
            { opacity: 1 }
        ], { duration, iterations: 1 });
    }
    public finish(duration: number = 500): void {
        this.root.animate([
            { opacity: 1 },
            { opacity: 0 }
        ], { duration, iterations: 1 })
        .addEventListener('finish', () => {
            this.root.remove();
            this.root.removeAttribute('solid');
        });
    }
}

export namespace LoadingOld {}

export default LoadingOld;
