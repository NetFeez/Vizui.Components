import { Element, Component } from 'vizui';


export class Loading extends Component<'div'> {
    static { this.css.load('${basicComponents}/Loading/Loading.css'); }

    protected root: Element<"div">;
    constructor(icon: string) { super();
        this.root = Element.structure({
            type: 'div', attribs: { class: 'Loading Loading-spawning' }, childs: [
                { type: 'div', childs: [
                    { type: 'img', attribs: { src: icon } },
                    { type: 'span' }, { type: 'span' }
                ] }
            ]
        });
    }
    public spawn(parent: Element, duration: number = 500, solid: boolean = false) {
        if (solid) this.root.setAttribute('solid', '');
        parent.append(this.root);
        this.root.animate([
            { opacity: 0 },
            { opacity: 1 }
        ], { duration, iterations: 1 });
    }
    public finish(duration: number = 500) {
        this.root.animate([
            { opacity: 1 },
            { opacity: 0 }
        ], { duration, iterations: 1 })
        .addEventListener('finish', () => {
            this.root.remove()
            this.root.removeAttribute('solid');
        });
    }
}

export namespace Loading {

}

export default Loading;