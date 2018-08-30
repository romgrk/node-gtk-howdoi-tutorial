const path = require('path')
const gi = require('node-gtk')
const Gtk = gi.require('Gtk', '3.0')
const Gdk = gi.require('Gdk', '3.0')
const GdkX11 = gi.require('GdkX11')
const WebKit2 = gi.require('WebKit2')
const howdoi = require('howdoi')

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
inputBox.packStart(input, true, true, 0)

const answersBox = new Gtk.Box({
  name: 'answers-box',
  orientation: Gtk.Orientation.VERTICAL,
})

content.packStart(inputBox, false, false, 0)
content.packStart(scrollable(answersBox),  true,  true,  0)

window.add(content)


input.on('activate', onSearch)



loadStylesheet(path.join(__dirname, 'style.css'))


window.setDefaultSize(800, 600)
window.on('show', Gtk.main)
window.on('destroy', Gtk.mainQuit)
window.showAll()

// Gtk.main() starts the Gtk event loop. It is required to process user events.
// It doesn't return until you don't need Gtk anymore, usually on window close.



/*
 * Event handlers
 */

function onSearch(...args) {
  emptyContainer(answersBox)
  answersBox.packStart(new Gtk.Label({ label: 'Loading' }), false, false, 0)
  answersBox.showAll()
  const pulseInterval = setInterval(() => input.progressPulse(), 200)

  const query = input.getText()

  howdoi({ query, results: 1, answers: 5, engine: 'google' })
  .then(results => {
    console.log(results)

    emptyContainer(answersBox)
    const result = results[0]

    const box = new Gtk.Box({ orientation: Gtk.Orientation.VERTICAL })
    answersBox.packStart(box, false, false, 0)
    box.packStart(new Gtk.Label({ label: result.title }), false, false, 0)

    result.answers.forEach(answer => {
      const view = new WebKit2.WebView()
      view.loadHtml(answer.html, null)
      box.packStart(view, false, false, 0)
    })

    answersBox.showAll()
  })
  .catch(err => {
    // XXX(handle error)
  })
  .then(() => {
    clearInterval(pulseInterval)
    input.setProgressFraction(0)
  })

  return false
}


/*
 * Helpers
 */

function loadStylesheet(filepath) {
  const css = new Gtk.CssProvider()
  css.loadFromPath(filepath)
  const screen = Gdk.Screen.getDefault()
  Gtk.StyleContext.addProviderForScreen(screen, css, 600)
}

function emptyContainer(container) {
  const children = container.getChildren()
  children.forEach(c => {
    container.remove(c)
  })
}

function scrollable(widget) {
  const scrollWindow = new Gtk.ScrolledWindow()
  scrollWindow.add(widget)
  return scrollWindow
}
