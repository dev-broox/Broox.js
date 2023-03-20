import { Pane } from 'tweakpane';

export class Settings {
  private pane: Pane;

  open(settings: any, maxWidth: number, maxHeight: number, onChange: (settings: any) => void, onKill: () => void, onClose: () => void) {
    this.pane = new Pane();
    this.pane.addInput(settings, 'activeArea', { label: 'X / Y', x: { step: 20 }, y: { step: 20 }});
    this.pane.addInput(settings.activeArea, 'width', { label: 'Width', min: 100, max: maxWidth, step: 10 });
    this.pane.addInput(settings.activeArea, 'height', { label: 'Height', min: 100, max: maxHeight, step: 10 });
    const handFolder = this.pane.addFolder({ title: 'Hand', expanded: true });
    handFolder.addInput(settings, 'showHand', { label: 'Show' });
    handFolder.addInput(settings, 'handScale', { label: 'Hand Scale', min: 0, max: 2, step: 0.1 });
    handFolder.addInput(settings, 'handColor', { label: 'Hand Color' });
    const blobFolder = this.pane.addFolder({ title: 'Blob', expanded: true });
    blobFolder.addInput(settings, 'showBlob', { label: 'Show' });
    blobFolder.addInput(settings, 'blobScale', { label: 'Blob Scale', min: 0, max: 2, step: 0.1 });
    blobFolder.addInput(settings, 'blobColor', { label: 'Blob Color' });
    blobFolder.addInput(settings, 'simulate', { label: 'Simulate with mouse' });
    this.pane.on('change', () => {
      onChange(this.pane.exportPreset());
    })
    const killBtn = this.pane.addButton({ title: 'Kill blobs' });
    killBtn.on('click', () => {
      onKill();
    });
    this.pane.addSeparator();
    const btn = this.pane.addButton({ title: 'CLOSE' });
    btn.on('click', () => {
      onClose();
      this.pane.dispose();
    });
  }

  close() {
    this.pane && this.pane.dispose();
  }
}