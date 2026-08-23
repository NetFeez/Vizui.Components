/**
 * @author NetFeez <netfeez.dev@gmail.com>
 * @description Soft loading overlay — dual-tone spinner ring with optional mascot icon.
 * @license Apache-2.0
 */

import { Component, Element } from 'vizui';

export class Loading extends Component<'div'> {
    static { this.css.load('{{base}}/Loading/Loading.css'); }

    protected readonly root: Element<'div'>;
    private readonly eRing: Element<'div'>;
    private readonly eIcon: Element<'img'> | null;

    private vSpawned = false;

    public constructor(icon: string | null = null) {
        super();
        this.root = Element.new('div', null, { class: 'Loading' });

        this.eRing = Element.new('div', null, { class: 'Loading-ring' });
        this.eIcon = icon ? Element.new('img', null, { class: 'Loading-icon', alt: '' }) : null;

        if (icon && this.eIcon) {
            this.eIcon.root.src = icon;
            this.root.append(this.eRing, this.eIcon);
        } else {
            this.root.append(this.eRing);
        }
    }

    public spawn(parent: Element, duration: number = 300, solid: boolean = false): void {
        if (this.vSpawned) return;
        this.vSpawned = true;
        if (solid) this.root.setAttribute('solid', '');
        parent.append(this.root);
        this.root.animate([{ opacity: 0 }, { opacity: 1 }], { duration, iterations: 1 });
    }

    public finish(duration: number = 250): void {
        if (!this.vSpawned) return;
        this.vSpawned = false;
        const animation = this.root.animate([{ opacity: 1 }, { opacity: 0 }], { duration, iterations: 1 });
        animation.addEventListener('finish', () => {
            this.root.remove();
            this.root.removeAttribute('solid');
        });
    }
}

export namespace Loading {}

export default Loading;
