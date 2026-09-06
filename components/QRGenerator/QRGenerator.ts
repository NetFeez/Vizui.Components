/**
 * @author NetFeez <netfeez.dev@gmail.com>
 * @description QR code generator component with preview and download support.
 * @license Apache-2.0
 */

import { Component, Element } from 'vizui';
import QR, { Drawer } from 'qrcode';
import Style from 'qrcode/Style.js';

import Utilities from '../Utilities.js';

export class QRGenerator extends Component<'div'> {
    static { this.css.load('QRGenerator.css', import.meta); }
    public readonly root = Element.new('div').setClass('QRGenerator');
    protected readonly eError = Element.new('p').setClass('QRGenerator-Error');
    protected readonly eViewer = Element.new('img').setClass('QRGenerator-Viewer');
    protected vShowing: Promise<void> | null = null;
    public constructor(options: QRGenerator.Options = {}) { super();
        const eDownloadButton = Element.new('button')
            .setText('Download')
            .setClass('Button QRGenerator-Download');

        eDownloadButton.on('click', async () => {
            const url = this.eViewer.getAttribute('src');
            if (url == null) return;
            const eLink = Element.new('a');
            eLink.setAttribute('download', 'QR.png');
            eLink.setAttribute('href', url);
            eLink.root.click();
        });

        Utilities.setIdentity(this, options);
        this.root.append(this.eViewer, this.eError, eDownloadButton);
    }
    public async generate(data: string, options: QRGenerator.GenerateOptions = {}): Promise<void> {
        const { correctionLevel = 'L', style = {} } = options;
        const eccLevel = QR.isSupportedEccLevel(correctionLevel) ? correctionLevel : 'L';
        const qr = new QR(data, { eccLevel });
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
    protected async loadQrImage(drawer: Drawer, style: QRGenerator.CustomizeOptions = {}): Promise<void> {
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
    export interface Options extends Omit<Utilities.Identity, 'for'> {}
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
