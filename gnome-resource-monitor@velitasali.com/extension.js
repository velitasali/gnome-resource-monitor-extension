const Me = imports.misc.extensionUtils.getCurrentExtension()
const TopBarDecoration = Me.imports.topbardecoration.TopBarDecoration

var decoration = null

function init() {
    
}

function enable() {
  decoration = new TopBarDecoration()
}

function disable() {
  decoration.destroy()
  decoration = null
}
