/*
 * fpslib component  
 */
document.addEventListener('DOMContentLoaded', function () {
        'use strict';

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
            ACSID=getID('animationCounterSpan')
            ;
        
        /*jshint multistr: true */
        document.body.innerHTML+='\
                <div id="'+MID+'">\
                  <p>fps: <span id="'+FSID+'"></span> <div id="'+TID+'"></div></p>\
                  <p id="'+OID+'"></p>\
                  <p>frames: <span id="'+ACSID+'">0</span></p>\
                </div>\
        ';

        // listeners, helpers
        var i=0,
            output=document.getElementById(OID);
        function log(s) {
            console.log(s);
            output.innerHTML+=s+'<p>';
          }

        var msgsReceived = 0;

        // fired on start-up
        window.addEventListener('app-ready', function() {
                log('app-ready '+i++);
              });

        window.document.addEventListener('heartbeat', function() {
                output.innerHTML+='messages:'+msgsReceived++;
              });

        // Setup requestAnimationFrame
        var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
            window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

        // fields
        /*
        var acs=$('#animationCounterSpan'),
            fpss=$('#fpsSpan'),
            thermometer=$('#thermometer');
        */
        var acs=document.getElementById(ACSID),
            fpss=document.getElementById(FSID),
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
            fps = Math.round(1000/(ts - lastTime));
            lastTime = ts;
          }
        function updateUI() {
            acs.innerHTML=ticks;
            fpss.innerHTML=fps;
            thermometer.style.width=fps+'px';
          }
        requestAnimationFrame(tick);
        
        setInterval(updateUI, 250);
      });

