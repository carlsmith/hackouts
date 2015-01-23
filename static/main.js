!function(){

    function init() {

        var $output = $("#output");
        var userID = gapi.hangout.getLocalParticipant().id;

        // resizing

        function resize() { $output.css("height", $(window).height())}
        $(window).resize(resize);
        resize();

        // editor

        var editor = ace.edit("editor");
        editor.$blockScrolling = Infinity;
        editor.setTheme("ace/theme/twilight");
        editor.session.setMode("ace/mode/python");

        editor.commands.addCommand({
            name: "execute",
            bindKey: {win: "Ctrl-Enter", mac: "Cmd-Enter"},
            exec: execute
        });

        editor.commands.addCommand({
            name: "save",
            bindKey: {win: "Ctrl-S", mac: "Cmd-S"},
            exec: function() {
            
                var name = prompt("Enter a filename...", ".py");
                if (!name || name === ".py") return;

                var text = editor.getValue();
                var tag = document.createElement('a');        
                
                var uri =
                    'data:text/plain;charset=utf-8,'
                    + encodeURIComponent(text);

                tag.setAttribute('download', name);
                tag.setAttribute('href', uri);
                tag.click();
            }
        });

        // python

        function outf(text) {
            
            $output.append($("<xmp>").text(text)).scrollTop(999999);
        }

        function builtinRead(x) {
            
            if (
                Sk.builtinFiles === undefined ||
                Sk.builtinFiles["files"][x] === undefined
                ) throw "File not found: '" + x + "'";
            
            return Sk.builtinFiles["files"][x];
        }

        Sk.pre = "output";
        Sk.configure({output:outf, read:builtinRead}); 

        function execute() {
            
            $output.html("");
            updateLastState();
            transmit("execute");
            
            try {
                eval(Sk.importMainWithBody("<file>", false, lastState.source));
            }
            catch(error) {
                $("<xmp>")
                    .addClass("error")
                    .text(error.toString())
                    .appendTo($output);
                $output.scrollTop(999999);
            }
        }

        // state

        var boss = false;
        var lastState = {source: "", cursor: {row: 0, column: 0}};
        
        function updateLastState() {

            var source = editor.getValue();
            var cursor = editor.getCursorPosition();

            var isDifferent = (
                source !== lastState.source            ||
                cursor.row !== lastState.cursor.row    ||
                cursor.column !== lastState.cursor.column
            );
            
            lastState.source = source;
            lastState.cursor = cursor;

            return isDifferent;
        }

        // transmission
        
        function transmit(command) {
            
            gapi.hangout.data.submitDelta({
                "payload": JSON.stringify({
                    date: "" + new Date,
                    userID: userID,
                    command: command,
                    lastState: lastState
                })
            });
        }

        function transmitter() {
            
            if (!boss) return; // end recursion
            if (updateLastState()) transmit("update");            
            maintainTransmission();
        }

        function maintainTransmission() { setTimeout(transmitter, 150) }

        // takeover

        editor.on("click", function() {
            
            if (boss) return;
            
            boss = true;
            editor.focus();
            updateLastState();
            transmit("takeover");
            maintainTransmission();
        })

        // events

        gapi.hangout.data.onStateChanged.add(function(event) {

            var payload = JSON.parse(event.state.payload);

            if (payload.command === "takeover") {
                if (payload.userID !== userID) {
                    boss = false;
                    editor.blur();
                } else return;
            }
            
            if (boss) return;

            editor.setValue(payload.lastState.source, 1);
            editor.moveCursorToPosition(payload.lastState.cursor);
            
            if (payload.command === "execute") execute();
        });
    }

    gadgets.util.registerOnLoadHandler(function() {
        gapi.hangout.onApiReady.add(init);
    });

}();