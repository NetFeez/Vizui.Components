/**
 * @author NetFeez <netfeez.dev@gmail.com>
 * @description Legacy multi-ring animated loading overlay, kept for backwards compatibility.
 * @license Apache-2.0
 */

import { Component, Element } from 'vizui';

export class LoadingOld extends Component<'div'> {
    static { this.css.load('LoadingOld.css', import.meta); }

    public readonly root = Element.new('div').setClass('LoadingOld LoadingOld-spawning');
    private vAnimation: Animation | null = null;

    public constructor(icon: string) { super();
        const eIcon = Element.new('img').setAttribute('src', icon);
        const eRings = Element.new('div').append(
            eIcon,
            Element.new('span'),
            Element.new('span')
        );
        this.root.append(eRings);
    }
    public spawn(parent: Element, duration: number = 500, solid: boolean = false): void {
        this.vAnimation?.cancel();
        if (solid) this.root.setAttribute('solid', '');
        parent.append(this.root);
        this.vAnimation = this.root.animate([
            { opacity: 0 },
            { opacity: 1 }
        ], { duration, iterations: 1 });
    }
    public finish(duration: number = 500): void {
        this.vAnimation?.cancel();
        const animation = this.root.animate([
            { opacity: 1 },
            { opacity: 0 }
        ], { duration, iterations: 1 });
        this.vAnimation = animation;
        animation.addEventListener('finish', () => {
            if (this.vAnimation !== animation) return;
            this.vAnimation = null;
            this.root.remove();
            this.root.removeAttribute('solid');
        });
    }
}

export namespace LoadingOld {}

export default LoadingOld;
