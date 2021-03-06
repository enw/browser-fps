
/*
 * fpslib component for CEF-NodeJS communication in AppJS

 NOTES
 * depends on AppJSCEF2node for communication between AppJS' Chrome Embedded Framework and NodeJS
 * depends on dat.gui for UI

*/
document.addEventListener('DOMContentLoaded', function () {
        'use strict';

        var CONFIG = function() {
            this.serverURL = 'http://www.thevidweb.org/random_point.php';
            this.msBetweenMessages = 1000;
            this.sendMessages = false;
            this.fps = 0;
            this.msgsReceived = 0;
            this.message = "no message rceived...";
            this.messagetype = "no message rceived...";
        };

        var config = new CONFIG();
        var gui = new dat.GUI();
        var control = gui.addFolder("control (native app only)");
        control.add(config, 'msBetweenMessages', 0, 1000);
        control.add(config, 'serverURL');
        control.add(config, 'sendMessages');
        var metrics = gui.addFolder("metrics");
        metrics.add(config, 'fps').listen();
        metrics.add(config, 'msgsReceived').listen();
        metrics.add(config, 'message').listen();
        metrics.add(config, 'messagetype').listen();
        metrics.open();

        //        var uid=Math.floor(Math.random()*16777215).toString(16);
        function getID(tag) {
            return tag+'__'+UID;
          }

        // vars
        var UID='FPSLIB',
            MID=getID('metrics'),
            FSID=getID('fpsSpan'),
            TID=getID('thermometer'),
            OID=getID('output'),
            MSGID=getID('messages'),
            ACSID=getID('animationCounterSpan'),
            i=0,
            output=document.getElementById(OID),
            msgsReceived = 0;

        // log helper
        function log(s) {
            console.log(s);
            output.innerHTML+=s+'<p>';
          }

        // messages from server to client
        window.document.addEventListener('node2CEF', function(evt) {
                config.msgsReceived = msgsReceived++;
                //                config.message = evt.data.msg;                
                config.messagetype = evt.data.type;
                config.message = evt.data.body;
        });

        // Setup requestAnimationFrame
        var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
            window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

        // fields
        var acs=document.getElementById(ACSID),
            fpss=document.getElementById(FSID),
            msgs=document.getElementById(MSGID),
            thermometer=document.getElementById(TID);

        // data
        var ticks = 0,
            lastTime = new Date().getTime(),
            fps='';
        // just update state
        function tick () {
            updateState();
            requestAnimationFrame(tick);
          }
        function updateState() {
            ticks++;
            
            var ts = new Date().getTime();
            config.fps = fps = Math.round(1000/(ts - lastTime));
            lastTime = ts;
          }


        // send updates of config every N ms
        var CONFIG_UPDATE_MS = 1000;
        function updateConfig() {
            send_CEF2node ( { type:'config', body:config } );
          }
        requestAnimationFrame(tick);
        setInterval(updateConfig, CONFIG_UPDATE_MS);
      });

