var app = module.exports = require('appjs');

app.serveFilesFrom(__dirname + '/content');

var menubar = app.createMenu([{
  label:'&File',
  submenu:[
    {
      label:'E&xit',
      action: function(){
        window.close();
      }
    }
  ]
},{
  label:'&Window',
  submenu:[
    {
      label:'Fullscreen',
      action:function(item) {
        window.frame.fullscreen();
        console.log(item.label+" called.");
      }
    },
    {
      label:'Minimize',
      action:function(){
        window.frame.minimize();
      }
    },
    {
      label:'Maximize',
      action:function(){
        window.frame.maximize();
      }
    },{
      label:''//separator
    },{
      label:'Restore',
      action:function(){
        window.frame.restore();
      }
    }
  ]
}]);

menubar.on('select',function(item){
  console.log("menu item "+item.label+" clicked");
});

var trayMenu = app.createMenu([{
  label:'Show',
  action:function(){
    window.frame.show();
  },
},{
  label:'Minimize',
  action:function(){
    window.frame.hide();
  }
},{
  label:'Exit',
  action:function(){
    window.close();
  }
}]);

var statusIcon = app.createStatusIcon({
  icon:'./data/content/icons/32.png',
  tooltip:'AppJS Hello World',
  menu:trayMenu
});

var window = app.createWindow({
  width  : 640,
  height : 460,
  icons  : __dirname + '/content/icons'
});

window.on('create', function(){
  console.log("Window Created");
  window.frame.show();
  window.frame.center();
  window.frame.setMenuBar(menubar);
});

window.on('ready', function(){
  console.log("Window Ready");
  window.process = process;
  window.module = module;

  function F12(e){ return e.keyIdentifier === 'F12' }
  function Command_Option_J(e){ return e.keyCode === 74 && e.metaKey && e.altKey }

  window.addEventListener('keydown', function(e){
    if (F12(e) || Command_Option_J(e)) {
      window.frame.openDevTools();
    }
  });

  // this is automatically dispatched
  //this.dispatchEvent(new this.Event('app-ready'));
  
  // this works
  var evt = new window.Event('heartbeat');
  evt.data = {msg:'hello, world!'};
  window.document.dispatchEvent(evt);

  // big string, create substrings of size using str.substr(0,#)
  var str="The Congress, whenever two thirds of both houses shall deem it necessary, shall propose amendments to this Constitution, or, on the application of the legislatures of two thirds of the several states, shall call a convention for proposing amendments, which, in either case, shall be valid to all intents and purposes, as part of this Constitution, when ratified by the legislatures of three fourths of the several states, or by conventions in three fourths thereof, as the one or the other mode of ratification may be proposed by the Congress; provided that no amendment which may be made prior to the year one thousand eight hundred and eight shall in any manner affect the first and fourth clauses in the ninth section of the first article; and that no state, without its consent, shall be deprived of its equal suffrage in the Senate.";

  // SENDING OF HEARTBEAT
  var i=0, code;
  window.isAppJS=true;
  window.fromCEF=[];
  var heartbeat=(function(window) { return function () {
      var evt = new window.Event('clockevent');
//      evt.data = {msg:'hi, world!'+i++};
      evt.data = {msg:i++ + ":" + str.substr(0,CONFIG.charsPerMessage)};
      window.document.dispatchEvent(evt);
      clearInterval(iid);
      iid = setInterval(heartbeat, CONFIG.msBetweenMessages);
  }})(window);

  // handling of messages from CEF
  var CHROMIUM_POLL_MS=1000,
    CONFIG = {
        msBetweenMessages: 250,
        charsPerMessage: 16
    };
  var iid = setInterval(heartbeat, CONFIG.msBetweenMessages);
    
  setInterval(
      function() {
          var message = window.fromCEF.pop();
          if (message) {
              switch (message.type) {
                  case "config":
                      CONFIG = message.body;
              }
          }
      },
      CHROMIUM_POLL_MS
  )

  // intercept events from elements in Chromium
  var $ = this.$,
      body = $('body');
      body.on('click', '#clicker', function (e) {
        code="ABCD";
      });
});

window.on('close', function(){
  console.log("Window Closed");
});
