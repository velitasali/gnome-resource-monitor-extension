import Clutter from 'gi://Clutter';
import St from 'gi://St';
import GTop from 'gi://GTop';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import * as PanelMenu from 'resource:///org/gnome/shell/ui/panelMenu.js';
import * as Util from 'resource:///org/gnome/shell/misc/util.js';

const Mainloop = imports.mainloop;

export default class TopBarDecoration {
  constructor() {
    this.looperId = 0;
    this.destroyed = false;
    this.gtop = new GTop.glibtop_mem();

    // Initialize component Labels
    this.label = new St.Label({
      text: '--',
      y_align: Clutter.ActorAlign.CENTER,
    });

    this.percentage = new St.Label({
      text: '%',
      y_align: Clutter.ActorAlign.CENTER,
      style_class: 'percentage_text',
    });

    this.layout = new Clutter.GridLayout();
    this.layout.insert_row(1);
    this.layout.insert_row(2);
    this.layout.insert_column(1);
    this.layout.insert_column(2);

    this.actor = new Clutter.Actor({
      layout_manager: this.layout,
      y_align: Clutter.ActorAlign.CENTER,
    });

    // Attach the components to the grid. 
    this.layout.attach(this.label, 1, 1, 1, 1);
    this.layout.attach(this.percentage, 2, 1, 1, 1);

    // Create the button and add to Main.panel
    const buttonName = "MemoryMonitorButton";

    this.button = new PanelMenu.Button(0.0, buttonName);
    this.button.add_child(this.actor);
    this.button.connect(
      'button_press_event',
      () => Util.spawn(['gnome-system-monitor']),
    );

    Main.panel.addToStatusArea(buttonName, this.button, 3, 'right');

    this.update();
  }

  loop() {
    if (this.destroyed) return;
    this.looperId = Mainloop.timeout_add_seconds(2, this.update.bind(this));
  }

  update() {
    if (this.destroyed) return;

    GTop.glibtop_get_mem(this.gtop);

    const used = this.gtop.user;
    const percentage = used == 0 ? 0 : used / this.gtop.total * 100;

    this.label.set_text(percentage.toFixed(1).toString());
    this.loop();
  }

  destroy() {
    Mainloop.source_remove(this.looperId);
    this.button.destroy();
    this.destroyed = true;
  }
}
