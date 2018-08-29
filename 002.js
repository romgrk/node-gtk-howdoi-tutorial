const path = require('path')
const gi = require('node-gtk')
const Gtk = gi.require('Gtk', '3.0')
const Gdk = gi.require('Gdk', '3.0')
// const GdkX11Display = gi.require('GdkX11Display')

// Start the GLib event loop
gi.startLoop()

// Necessary to initialize the graphic environment.
// If this fails it means the host cannot show Gtk-3.0
Gtk.init()
Gdk.init([])


// Create our main window
const window = new Gtk.Window({
  type : Gtk.WindowType.TOPLEVEL,
})

const content = new Gtk.Box({
  orientation: Gtk.Orientation.VERTICAL
})
const inputBox = new Gtk.Box({
  name: 'input-box',
  orientation: Gtk.Orientation.HORIZONTAL
})
const input = new Gtk.SearchEntry()
const button = new Gtk.Button()
inputBox.add(input)
inputBox.add(button)

const answersBox = new Gtk.Box({
  orientation: Gtk.Orientation.HORIZONTAL
})

content.packStart(inputBox, false, false, 0)
content.packStart(answersBox,  true,  true,  0)

window.add(content)



window.setDefaultSize(800, 600)
window.on('show', Gtk.main)
window.on('destroy', Gtk.mainQuit)
window.showAll()

// Gtk.main() starts the Gtk event loop. It is required to process user events.
// It doesn't return until you don't need Gtk anymore, usually on window close.

