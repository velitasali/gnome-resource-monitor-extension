import { Extension } from 'resource:///org/gnome/shell/extensions/extension.js'
import TopBarDecoration from './topbardecoration.js';

export default class AwesomeTilesExtension extends Extension {
  decoration = null;

  enable() {
    decoration = new TopBarDecoration();
  }

  disable() {
    decoration.destroy();
    decoration = null;
  }
}

