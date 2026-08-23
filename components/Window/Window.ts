/**
 * @author NetFeez <netfeez.dev@gmail.com>
 * @description Draggable, resizable window component with minimize/maximize controls.
 * @license Apache-2.0
 */

import { Component, Element } from 'vizui';

export class Window extends Component<'div', Window.EventMap> {
    static { this.css.load('{{base}}/Window/Window.css'); }
    protected readonly root: Element<'div'>;
    protected readonly eTitle: Element<'h2'>;
    protected readonly eHeader: Element<'div'>;
    protected readonly eContent: Element<'div'>;

    private readonly vBinds = {
        moveHandler: this.moveHandler.bind(this),
        resizeHandler: this.resizeHandler.bind(this),
        resizeCaptureHandler: this.resizeCaptureHandler.bind(this),
    };

    public constructor(options: Window.Options = {}) {
        super();
        this.root = Element.new('div', null, { class: 'Window' });
        this.eTitle = Element.new('h2', null, { class: 'title' });
        this.eHeader = Element.new('div', null, { class: 'header' });
        this.eContent = Element.new('div', null, { class: 'content' });
        const eControls = Element.new('div', null, { class: 'controls' });
        const eClose = Element.new('button', '×', { class: 'control close' });
        const eMinimize = Element.new('button', '–', { class: 'control minimize' });
        const eMaximize = Element.new('button', '□', { class: 'control maximize' });

        eControls.append(eMinimize, eMaximize, eClose);
        this.eHeader.append(this.eTitle, eControls);
        this.root.append(this.eHeader, this.eContent);

        const { title = 'new window', content = [], width = 300, height = 0, aspectRatio = null, x = 0, y = 0 } = options;
        this.title = title;
        this.content(...content);
        if (aspectRatio !== null) this.root.style.aspectRatio = aspectRatio;
        this.resize(width, height);
        this.move(x, y);

        eClose.on('click', (e) => {
            this.remove();
            this.emit('close', e);
        });
        eMinimize.on('click', () => {
            const toggleMinimize = () => {
                if (this.root.root.hasAttribute('minimized')) {
                    this.resizeManager(true);
                    this.root.root.removeAttribute('minimized');
                    this.root.style.width = `${width}px`;
                    this.root.style.height = `${height}px`;
                } else {
                    this.resizeManager(false);
                    this.root.root.setAttribute('minimized', '');
                    this.root.style.height = `${this.eHeader.offsetHeight}px`;
                }
            };

            if (document.startViewTransition) document.startViewTransition(() => toggleMinimize());
            else toggleMinimize();
        });
        eMaximize.on('click', () => {
            if (this.root.root.classList.contains('maximized')) {
                this.moveManager(true);
                this.resizeManager(true);
                eMinimize.root.disabled = false;
                this.root.root.classList.remove('maximized');
                this.resize(width, height);
                this.move(x, y);
            } else {
                this.moveManager(false);
                this.resizeManager(false);
                eMinimize.root.disabled = true;
                this.root.root.classList.add('maximized');
                this.resize(window.innerWidth, window.innerHeight);
                this.move(0, 0);
            }
        });

        this.resizeManager();
        this.moveManager();
    }

    public get title(): string { return this.eTitle.text; }
    public set title(value: string) { this.eTitle.text = value; }

    /**
     * Sets the content of the window. This will remove all previous content and replace it with the new items.
     * @param items The new content items to set in the window.
     */
    public content(...items: Element.ChildType[]): this {
        this.eContent.clean().append(...items);
        return this;
    }
    /**
     * Clears the content of the window, removing all child elements from the content area.
     * @returns The current instance of the Window component for method chaining.
     */
    public clear(): this { this.eContent.clean(); return this; }

    /**
     * Resizes the window to the specified width and height.
     * @param width The new width (in pixels) for the window.
     * @param height The new height (in pixels) for the window.
     * @returns The current instance of the Window component for method chaining.
     */
    public resize(width: number, height: number, event?: Event): this {
        this.root.style.width = `${width}px`;
        this.root.style.height = `${height}px`;
        this.emit('resize', { width, height, event });
        return this;
    }
    /**
     * Moves the window to the specified (x, y) coordinates on the screen.
     * @param x The new x-coordinate (in pixels) for the window's position.
     * @param y The new y-coordinate (in pixels) for the window's position.
     * @returns The current instance of the Window component for method chaining.
     */
    public move(x: number, y: number, event?: Event): this {
        this.root.style.left = `${x}px`;
        this.root.style.top = `${y}px`;
        this.emit('move', { x, y, event });
        return this;
    }

    /**
     * Sets up the resize functionality for the window component.
     * This allows the user to resize the window by dragging its edges or corners.
     * The resize behavior is implemented using pointer events, and it adjusts the width and height of the window based on the user's mouse movements.
     * The window can be resized from the right edge, bottom edge, or both edges simultaneously (for corner resizing).
     * The minimum width and height of the window are set to 150px and 100px, respectively.
     * This method is called during the construction of the Window component to enable resizing functionality.
     */
    private resizeManager(enable: boolean = true): void {
        if (enable) {
            this.root.on('pointerdown', this.vBinds.resizeHandler);
            this.root.on('pointermove', this.vBinds.resizeCaptureHandler);
        } else {
            this.root.off('pointerdown', this.vBinds.resizeHandler);
            this.root.off('pointermove', this.vBinds.resizeCaptureHandler);
        }
    }
    private moveManager(enable: boolean = true): void {
        if (enable) this.eHeader.on('pointerdown', this.vBinds.moveHandler);
        else this.eHeader.off('pointerdown', this.vBinds.moveHandler);
    }
    private resizeCaptureHandler(e: PointerEvent): void {
        const rect = this.root.root.getBoundingClientRect();
        const edgeThreshold = 12;
        const isRight = e.clientX >= rect.right - edgeThreshold;
        const isBottom = e.clientY >= rect.bottom - edgeThreshold;

        if (isRight && isBottom) this.root.root.style.cursor = 'se-resize';
        else if (isRight) this.root.root.style.cursor = 'e-resize';
        else if (isBottom) this.root.root.style.cursor = 's-resize';
        else this.root.root.style.cursor = 'default';
    }
    private resizeHandler(event: PointerEvent): void {
        const rect = this.root.root.getBoundingClientRect();
        const edgeThreshold = 12;

        const isRight = event.clientX >= rect.right - edgeThreshold;
        const isBottom = event.clientY >= rect.bottom - edgeThreshold;

        if (!isRight && !isBottom) return;

        const target = event.currentTarget as HTMLElement;
        target.setPointerCapture(event.pointerId);

        const startWidth = rect.width;
        const startHeight = rect.height;
        const startX = event.clientX;
        const startY = event.clientY;

        const onPointerMove = (moveEvent: PointerEvent) => {
            let width = startWidth;
            let height = startHeight;
            if (isRight) width = Math.max(150, startWidth + (moveEvent.clientX - startX));
            if (isBottom) height = Math.max(100, startHeight + (moveEvent.clientY - startY));
            this.resize(width, height);
        };

        const onPointerUp = (upEvent: PointerEvent) => {
            target.releasePointerCapture(upEvent.pointerId);
            window.removeEventListener('pointermove', onPointerMove);
            target.removeEventListener('pointerup', onPointerUp);
        };

        window.addEventListener('pointermove', onPointerMove);
        target.addEventListener('pointerup', onPointerUp);
    }
    private moveHandler(event: PointerEvent): void {
        if (event.target instanceof HTMLElement && event.target.closest('.control')) return;

        this.eHeader.root.setPointerCapture(event.pointerId);
        const rect = this.root.root.getBoundingClientRect();
        const offsetX = event.clientX - rect.left;
        const offsetY = event.clientY - rect.top;

        const onPointerMove = (moveEvent: PointerEvent) => {
            const newLeft = moveEvent.clientX - offsetX;
            const newTop = moveEvent.clientY - offsetY;
            this.move(newLeft, newTop);
        };

        const onPointerUp = (upEvent: PointerEvent) => {
            this.eHeader.root.releasePointerCapture(upEvent.pointerId);
            this.eHeader.off('pointermove', onPointerMove);
            this.eHeader.off('pointerup', onPointerUp);
        };

        this.eHeader.on('pointermove', onPointerMove);
        this.eHeader.on('pointerup', onPointerUp);
    }
}

export namespace Window {
    export type EventMap = {
        'close': [event: Event];
        'resize': [{ width: number; height: number; event?: Event }];
        'move': [{ x: number; y: number; event?: Event }];
    };
    export type Options = {
        aspectRatio?: `${number}/${number}` | null;
        content?: Element.ChildType[];
        height?: number;
        title?: string;
        width?: number;
        x?: number;
        y?: number;
    };
}

export default Window;
