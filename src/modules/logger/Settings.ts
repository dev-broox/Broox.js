import { Pane } from 'tweakpane';

export class Settings {
  private pane: Pane;

  open(settings: any, onChange: (settings: any) => void, onClose: () => void) {
    this.pane = new Pane();
    this.pane.addInput(settings, 'logEnabled', { label: 'Log enabled' });
    this.pane.addInput(settings, 'errorEnabled', { label: 'Error enabled' });
    this.pane.addInput(settings, 'warnEnabled', { label: 'Warn enabled' });
    this.pane.addInput(settings, 'infoEnabled', { label: 'Info enabled' });
    this.pane.addInput(settings, 'debugEnabled', { label: 'Debug enabled' });
    this.pane.on('change', () => {
      onChange(this.pane.exportPreset());
    })
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