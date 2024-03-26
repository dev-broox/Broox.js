import { Pane } from 'tweakpane';

export class SkeletonSettings {
  private pane: Pane;

  open(settings: any, maxWidth: number, maxHeight: number, onChange: (settings: any) => void, onKill: () => void, onClose: () => void) {
    this.pane = new Pane();
    this.pane.addInput(settings, 'activeArea', { label: 'X / Y', x: { step: 20 }, y: { step: 20 } });
    this.pane.addInput(settings.activeArea, 'width', { label: 'Width', min: 100, max: maxWidth, step: 10 });
    this.pane.addInput(settings.activeArea, 'height', { label: 'Height', min: 100, max: maxHeight, step: 10 });
    const handFolder = this.pane.addFolder({ title: 'Hand', expanded: true });
    handFolder.addInput(settings, 'showHand', { label: 'Show' });
    handFolder.addInput(settings, 'handSize', { label: 'Hand Size', min: 0, step: 1 });
    handFolder.addInput(settings, 'handScale', { label: 'Hand Scale', min: 0, max: 2, step: 0.1 });
    handFolder.addInput(settings, 'handColor', { label: 'Hand Color' });
    const bodyFolder = this.pane.addFolder({ title: 'Body', expanded: true });
    bodyFolder.addInput(settings, 'showBody', { label: 'Show' });
    bodyFolder.addInput(settings, 'bodyScale', { label: 'Body Scale', min: 0, max: 2, step: 0.1 });
    bodyFolder.addInput(settings, 'bodyColor', { label: 'Body Color' });
    bodyFolder.addInput(settings, 'simulateBody', { label: 'Simulate with mouse' });
    this.pane.on('change', () => {
      onChange(this.pane.exportPreset());
    })
    const killBtn = this.pane.addButton({ title: 'Kill skeletons' });
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