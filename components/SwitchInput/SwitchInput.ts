import { Element, Component } from 'vizui';

export class SwitchInput extends Component<'div', SwitchInput.EventMap> {
    static { this.css.load('${basicComponents}/SwitchInput/SwitchInput.css'); }

    protected root: Element<"div">;
    protected vState: boolean;
    public constructor(defaultState: boolean = true, label: string = '') { super();
        const id = 'switchInput-' + Math.random().toString(36).substring(2, 9);
        
        this.vState = defaultState;

        this.root = Element.structure({
            type: 'div', attribs: { class: `switchInput ${this.vState ? 'active' : ''}` }, childs: [
                { type: 'label', text: label, attribs: { for: id }, events: {
                    click: () => this.toggleState()
                } },
                { type: 'div', attribs: { id, class: 'switch-track' }, childs: [
                    { type: 'div', attribs: { class: 'switch-knob' } }
                ], events: {
                    click: () => this.toggleState()
                } }
            ]
        })
    }
    public toggleState() {
        this.vState = !this.vState;
        this.root.root.classList.toggle('active');
        this.emit('change', this.vState);
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
    export type EventMap = {
        change: [state: boolean];
    }
}

export default SwitchInput;