import type { Element } from "Vizui";
import { Component } from "Vizui";

export class Utilities {
    /**
     * 
     */
    public static setIdentity(target: Element | Component<any>, identity: Utilities.Identity = {}): void {
        const { id, class: classList, for: forAttr } = identity;

        const element = target instanceof Component ? target.element : target;

        if (id) element.id = id;
        if (classList) element.classList.add(...classList.split(' '));
        if (forAttr && Utilities.isLabel(element)) element.root.htmlFor = forAttr;
    }
    public static isLabel(target: Element): target is Element<'label'> {
        return target.root.tagName.toLowerCase() === 'label';
    }
}
export namespace Utilities {
    export interface Identity {
        id?: string;
        class?: string;
        for?: string;
    }
}
export default Utilities;