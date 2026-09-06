/**
 * @author NetFeez <netfeez.dev@gmail.com>
 * @description Toggle switch input component emitting change events.
 * @license Apache-2.0
 */

import { Component, Element } from 'vizui';

import Utilities from '../Utilities.js';

export class SwitchInput extends Component<'div', SwitchInput.EventMap> {
    static { this.css.load('SwitchInput.css', import.meta); }

    public readonly root = Element.new('div').setClass('SwitchInput');
    protected vState: boolean;

    public constructor(options: SwitchInput.Options = {}) { super();
        const { defaultState = true, label = '' } = options;
        const id = 'switchInput-' + Math.random().toString(36).substring(2, 9);

        this.vState = defaultState;

        const eLabel = Element.new('label')
            .setText(label)
            .setAttribute('for', id)
            .on('click', (e) => this.toggleState(e));
        const eTrack = Element.new('div')
            .setAttributes({ id, class: 'switch-track' })
            .append(Element.new('div').setClass('switch-knob'))
            .on('click', (e) => this.toggleState(e));

        Utilities.setIdentity(this, options);
        this.root.append(eLabel, eTrack).toggleClass('active', this.vState);
    }
    public toggleState(event?: Event): void {
        this.vState = !this.vState;
        this.root.toggleClass('active', this.vState);
        this.emit('change', this.vState, event);
    }
    public getState(): boolean {
        return this.vState;
    }
    public get value(): boolean { return this.vState; }
    public set value(value: boolean) {
        if (value === this.vState) return;
        this.toggleState();
    }
}

export namespace SwitchInput {
    export interface Options extends Omit<Utilities.Identity, 'for'> {
        defaultState?: boolean;
        label?: string;
    }
    export type EventMap = {
        change: [state: boolean, event?: Event];
    };
}

export default SwitchInput;
