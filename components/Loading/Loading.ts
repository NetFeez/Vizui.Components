/**
 * @author NetFeez <netfeez.dev@gmail.com>
 * @description Soft loading overlay — dual-tone spinner ring with optional mascot icon.
 * @license Apache-2.0
 */

import { Component, Element } from 'vizui';

export class Loading extends Component<'div'> {
    static { this.css.load('Loading.css', import.meta); }

    public readonly root = Element.new('div').setClass('Loading');
    private readonly eRing = Element.new('div').setClass('Loading-ring');
    private readonly eIcon: Element<Element.Type['img']> | null;
    private vSpawned = false;
    private vAnimation: Animation | null = null;

    public constructor(icon: string | null = null) { super();
        this.eIcon = icon
            ? Element.new('img').setAttributes({ class: 'Loading-icon', alt: '' })
            : null;

        if (icon && this.eIcon) {
            this.eIcon.root.src = icon;
            this.root.append(this.eRing, this.eIcon);
        } else {
            this.root.append(this.eRing);
        }
    }

    public spawn(parent: Element, duration: number = 300, solid: boolean = false): void {
        if (this.vSpawned) return;
        this.vAnimation?.cancel();
        this.vSpawned = true;
        if (solid) this.root.setAttribute('solid', '');
        parent.append(this.root);
        this.vAnimation = this.root.animate([{ opacity: 0 }, { opacity: 1 }], { duration, iterations: 1 });
    }

    public finish(duration: number = 250): void {
        if (!this.vSpawned) return;
        this.vSpawned = false;
        const animation = this.root.animate([{ opacity: 1 }, { opacity: 0 }], { duration, iterations: 1 });
        this.vAnimation?.cancel();
        this.vAnimation = animation;
        animation.addEventListener('finish', () => {
            if (this.vAnimation !== animation) return;
            this.vAnimation = null;
            this.root.remove();
            this.root.removeAttribute('solid');
        });
    }
}

export namespace Loading {}

export default Loading;
