/**
 * @author NetFeez <netfeez.dev@gmail.com>
 * @description QR code generator component with preview and download support.
 * @license Apache-2.0
 */

import { Element, Component } from 'vizui';
import QR, { Drawer } from 'qrcode';
import Style from 'qrcode/Style.js';

export class QRGenerator extends Component<'div'> {
    static { this.css.load('{{base}}/QRGenerator/QRGenerator.css'); }
    protected root: Element<'div'>;
    protected readonly eError: Element<'p'>;
    protected readonly eViewer: Element<'img'>;
    protected vShowing: Promise<any> | null = null;
    public constructor(options: QRGenerator.Options = {}) {
        super();
        const componentClass = 'QRGenerator' + (options.class ? ` ${options.class}` : '');
        const id = options.id;
        const eDownloadButton = Element.new('button', 'Download').setAttribute('class', 'Button QRGenerator-Download');

        this.eError = Element.new('p').setAttribute('class', 'QRGenerator-Error');
        this.eViewer = Element.new('img').setAttribute('class', 'QRGenerator-Viewer');
        this.root = Element.new('div').setAttribute('class', componentClass);

        eDownloadButton.addEventListener('click', async () => {
            const url = this.eViewer.getAttribute('src');
            if (url == null) return;
            const eLink = Element.new('a');
            eLink.setAttribute('download', 'QR.png');
            eLink.setAttribute('href', url);
            eLink.root.click();
        });

        if (id) this.root.setAttribute('id', id);
        this.root.append(this.eViewer, this.eError, eDownloadButton);
    }
    public async generate(data: string, options: QRGenerator.GenerateOptions = {}): Promise<void> {
        const { correctionLevel = 'L', style = {} } = options;
        const eccLevel = QR.isSupportedEccLevel(correctionLevel) ? correctionLevel : 'L';
        const qr = new QR(data, {
            eccLevel: eccLevel
        });
        const drawer = qr.imageDrawer;
        if (drawer == null) {
            const errorMessage = 'Posible browser incompatible with Canvas API';
            this.eError.text = errorMessage;
            throw new Error(errorMessage);
        }
        await this.show(drawer, style);
    }
    protected async show(drawer: Drawer, style: QRGenerator.CustomizeOptions = {}): Promise<void> {
        if (this.vShowing) await this.vShowing;
        this.vShowing = this.loadQrImage(drawer, style);
        await this.vShowing;
        this.vShowing = null;
    }
    protected async loadQrImage(drawer: Drawer, style: QRGenerator.CustomizeOptions = {}) {
        const { activeModule = null, inactiveModule = null, moduleMargin = null, moduleRadius = null, background = null, icon = null, size = null } = style;
        const styleManager = drawer.style;
        if (moduleMargin) styleManager.moduleMargin = moduleMargin;
        if (moduleRadius) styleManager.moduleRadius = moduleRadius;
        if (background) styleManager.background = background;
        if (activeModule) styleManager.activeColor = activeModule;
        if (inactiveModule) styleManager.inactiveColor = inactiveModule;
        if (icon) await drawer.addImage(icon);
        const dataUrl = await drawer.dataUrl(style.size);
        this.eViewer.setAttribute('src', dataUrl);
    }
}
export namespace QRGenerator {
    export interface Options {
        class?: string;
        id?: string;
    }
    export interface GenerateOptions {
        correctionLevel?: string;
        style?: CustomizeOptions;
    }
    export interface CustomizeOptions {
        moduleMargin?: Style.SizeValue;
        moduleRadius?: Style.SizeValue;
        background?: Style.ColorValue | Style.gradient;
        activeModule?: Style.ColorValue | Style.gradient;
        inactiveModule?: Style.ColorValue | Style.gradient;
        size?: number;
        icon?: string;
    }
}
export default QRGenerator;
