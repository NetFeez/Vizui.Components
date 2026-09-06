/**
 * @author NetFeez <netfeez.dev@gmail.com>
 * @description Shared helpers to apply identity attributes and detect element kinds.
 * @license Apache-2.0
 */

import type { Element } from 'vizui';
import { Component } from 'vizui';

export class Utilities {
    /**
     * Sets the identity attributes available in the provided element or component.
     * The identity attributes include id, class, and for. The for attribute is only applicable to label and input elements.
     * @param target The Element or Component to set the identity for.
     * @param identity An object containing the identity attributes to set.
     */
    public static setIdentity(target: Element<any> | Component<any>, identity: Utilities.Identity = {}): void {
        const { id, class: classList, for: forAttr } = identity;

        const element = target instanceof Component ? target.root : target;

        if (id) element.id = id;
        if (identity.name) element.setAttribute('name', identity.name);
        if (classList) element.addClass(...classList.split(' '));
        if (forAttr && Utilities.isLabel(element)) element.root.htmlFor = forAttr;
        if (forAttr && Utilities.isInput(element)) element.root.name = forAttr;
    }
    public static isLabel(target: Element): target is Element<Element.Type['label']> {
        const tag = target.root.tagName.toLowerCase();
        return tag === 'label';
    }
    public static isInput(target: Element): target is Element<Element.Type['input'] | Element.Type['textarea']> {
        const tag = target.root.tagName.toLowerCase();
        return tag === 'input' || tag === 'textarea';
    }
}
export namespace Utilities {
    export interface Identity {
        id?: string;
        name?: string;
        class?: string;
        for?: string;
    }
}
export default Utilities;