const gi = require('node-gtk')
const Gtk = gi.require('Gtk', '3.0')

// Start the GLib event loop
gi.startLoop()

// Necessary to initialize the graphic environment.
// If this fails it means the host cannot show Gtk-3.0
Gtk.init()


// Create our main window
const window = new Gtk.Window({
  type : Gtk.WindowType.TOPLEVEL,
})

window.setDefaultSize(800, 600)
window.on('show', Gtk.main)
window.on('destroy', Gtk.mainQuit)
window.showAll()

// Gtk.main() starts the Gtk event loop. It is required to process user events.
// It doesn't return until you don't need Gtk anymore, usually on window close.
