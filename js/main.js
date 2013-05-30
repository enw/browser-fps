
/*
 * fpslib component  

 NOTES
 * depends on dat.gui

 TODO
 further separate view & model
 create shareobject

*/
document.addEventListener('DOMContentLoaded', function () {
        'use strict';

        var CONFIG = function() {
            this.msBetweenMessages = 10;
            this.charsPerMessage = 10;
            this.sendMessages = true;
            //            this.msBetweenScreenUpdates = 250;
            this.fps = 0;
            this.msgsReceived = 0;
        };

        var config = new CONFIG();
        var gui = new dat.GUI();
        gui.add(config, 'msBetweenMessages', 0, 1000);
        gui.add(config, 'charsPerMessage', 0, 256);
        gui.add(config, 'sendMessages');
        // gui.add(config, 'msBetweenScreenUpdates');
        gui.add(config, 'fps').listen();
        gui.add(config, 'msgsReceived').listen();

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
            ACSID=getID('animationCounterSpan')
            ;
        
        /*jshint multistr: true */
        /*
        document.body.innerHTML+='    \
                <div id="'+MID+'">\
                  <p>fps: <span id="'+FSID+'"></span> <div id="'+TID+'"></div></p>\
                  <p id="'+OID+'"></p>\
                  <p>frames: <span id="'+ACSID+'">0</span></p>\
                  <p>messages: <span id="'+MSGID+'">0</span></p>\
                </div>\
        ';
        */

        // listeners, helpers
        var i=0,
            output=document.getElementById(OID);
        function log(s) {
            console.log(s);
            output.innerHTML+=s+'<p>';
          }

        var msgsReceived = 0;

        window.document.addEventListener('heartbeat', function() {
                config.msgsReceived = msgsReceived++;
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
            //            updateUI();
            requestAnimationFrame(tick);
          }
        function updateState() {
            ticks++;
            
            var ts = new Date().getTime();
            config.fps = fps = Math.round(1000/(ts - lastTime));
            lastTime = ts;
          }
        function updateUI() {
            /*
            acs.innerHTML=ticks;
            fpss.innerHTML=fps;
            msgs.innerHTML=msgsReceived;
            thermometer.style.width=fps+'px';
            */
          }
        requestAnimationFrame(tick);
        
        setInterval(updateUI, 250);
      });

