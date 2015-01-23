# Python Hackouts (alpha)

This is a simple app for writing and running Python in a Google Hangout. It
uses Skulpt, so it's all client-side, but does have some limitations.

It's only intended to be helpful to mentors at Thinkful, for explaining bits
of Python in a Hangout.

Hackouts have a text editor (Ace) for writing code, and an output area for
printing stuff. Only one person can edit or execute code at a time.

When anyone joins a hackout, their instance of the editor is *unfocussed*.
The cursor will be red. The first person to click on and focus their editor
takes control of the hackout; their cursor turns green. Any user can click
on the editor to take over control at any time.

## Controls

The meta key here means <kbd>Cmd</kbd> on OS X and <kbd>Ctrl</kbd> on Linux
and Windows.

- <kbd>Meta</kbd>+<kbd>Enter</kbd>: Execute Code
- <kbd>Meta</kbd>+<kbd>S</kbd>: Save/Download Code

## Plans

There will hopefully soon be some way to load code snippets into the editor.
Once that's ready, collecting some actual snippets would be good.

Spinning off versions that support other languages would be an option.

That's about it. It's just a simple app.

## Use

There's a button you can click [on this page][1] to start a hackout. You
just invite people as ever. Remember, you need to allow non-Thinkful account
holders to join the hangout explicitly. By default, they will not be able to.

[1]: http://pyhackouts.appspot.com