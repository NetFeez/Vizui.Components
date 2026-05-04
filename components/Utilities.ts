import type { Element } from "vizui";
import { Component } from "vizui";

export class Utilities {
    /**
     * Sets the identity attributes available in the provided element or component.
     * The identity attributes include id, class, and for. The for attribute is only applicable to label and input elements.
     * @param target The Element or Component to set the identity for.
     * @param identity An object containing the identity attributes to set.
     */
    public static setIdentity(target: Element | Component<any>, identity: Utilities.Identity = {}): void {
        const { id, class: classList, for: forAttr } = identity;

        const element = target instanceof Component ? target.element : target;

        if (id) element.id = id;
        if (classList) element.classList.add(...classList.split(' '));
        if (forAttr && Utilities.isLabel(element)) element.root.htmlFor = forAttr;
        if (forAttr && Utilities.isInput(element)) element.root.name = forAttr;
    }
    public static isLabel(target: Element): target is Element<'label'> {
        const tag = target.root.tagName.toLowerCase();
        return tag === 'label';
    }
    public static isInput(target: Element): target is Element<'input'> | Element<'textarea'> {
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