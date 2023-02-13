import { Pane } from 'tweakpane';

export class Settings {
  private pane: Pane;

  open(settings: any, onChange: (settings: any) => void, onKill: () => {}) {
    this.pane = new Pane();
    this.pane.addInput(settings, 'activeArea', { label: 'X / Y', x: { step: 20 }, y: { step: 20 }});
    this.pane.addInput(settings.activeArea, 'width', { label: 'Width' });
    this.pane.addInput(settings.activeArea, 'height', { label: 'Height' });
    this.pane.addInput(settings, 'handScale', { label: 'Hand Scale' });
    this.pane.addInput(settings, 'blobScale', { label: 'Blob Scale' });
    this.pane.addInput(settings, 'simulate', { label: 'Simulate single blob with mouse' });
    const killBtn = this.pane.addButton({ title: 'Kill blobs' });
    killBtn.on('click', () => {
      onKill();
    });
    this.pane.addSeparator();
    const btn = this.pane.addButton({ title: 'SET' });
    btn.on('click', () => {
      onChange(this.pane.exportPreset());
      this.pane.dispose();
    });
  }

  close() {
    this.pane && this.pane.dispose();
  }
}