document.addEventListener('DOMContentLoaded', function ($) {
        document.body.innerHTML+='\
                <div id="metrics">\
                  <p>fps: <span id="fpsSpan"></span> <div id="thermometer"></div></p>\
                  <p id="output"></p>\
                  <p>frames: <span id="animationCounterSpan">0</span></p>\
                </div>\
        ';

        // listeners, helpers
        var i=0,
            output=document.getElementById('output');
        function log(s) {
            console.log(s);
            output.innerHTML+=s+"<p>";
        };

        var msgsReceived = 0;

        // fired on start-up
        window.addEventListener("app-ready", function(e) {
                log('app-ready '+i++);
        });

        window.document.addEventListener("heartbeat", function(e) {
                output.innerHTML+='messages:'+msgsReceived++;
                //                $("#output").html("messages:"+msgsReceived++);
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
        var acs=document.getElementById('animationCounterSpan'),
            fpss=document.getElementById('fpsSpan'),
            thermometer=document.getElementById('thermometer');

        // data
        var ticks = 0,
            lastTime = new Date().getTime(),
            fps="";
        // just update
        function tick (n) {
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
})

