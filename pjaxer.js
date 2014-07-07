(function(global){
 
  function Pjaxer(){
    var _callbacks = {};
    var _caches = {};
    var _target;
 
    initialize.apply(this, arguments);
 
    return{
      on : on
    };
 
    function initialize(linkSelector, targetSelector){
      if(!Pjaxer.isSupported){
        this.isAvailable = false;
        return;
      }
 
      var elements = document.querySelectorAll(linkSelector);
      _target = document.querySelector(targetSelector);
 
      for(var i = 0, len = elements.length; i < len; i++){
        var element = elements[i];
        element.addEventListener('click', _onClick, false);
 
        if(element.getAttribute('data-pjaxer-preload')){
          _preloadPage(element);
        }
      }
 
      var state = {
        url : window.location.href,
        fragment : _target.innerHTML,
        title : document.title
      };
 
      window.history.replaceState(state, document.title);
      window.addEventListener('popstate', _onPopState, false);
      this.isAvailable = true;
    }
 
 
    function _preloadPage(element){
      var targetId = element.getAttribute('data-pjaxer-target-id');
      if(!targetId){
        throw new Error('data-pjaxer-target-id should also be specified when data-pjaxer-preload is specified');
      }
 
      if(document.getElementById(_getTargetId(targetId))){
        return;
      }
    }
 
 
    function _getTargetId(targetId){
      return "pjaxer_" + targetId;
    }
 
 
    /**
     * A callback of the clicks of the links
     */
    function _onClick(e){
      e.preventDefault();
      e.stopPropagation();
 
      var target = e.currentTarget;
      var url = target.href;
      
      _loadURL(url);
    }
 
 
    /**
     * A callback of the popstate event
     * Runs when the back button is clicked
     */
    function _onPopState(e){
      var state = e.state;
      if(state){
        _changePage(state.url, state.fragment, true);
      }
    }
 
 
    /**
     * Load html text from the URL
     */
    function _loadURL(url){
      var ajax = Ajax();
 
      if(_caches[url]){
        _changePage(url, _caches[url]); 
      }else{
        ajax.load(url, _loadedURL, _errorURL);
      }
    }
 
    function _loadedURL(xhr, url){
      _changePage(url, xhr.responseText);
    }
 
    function _errorURL(xhr, url){
      location.href = url;
    }
 
 
    function _changePage(url, htmlText, isPopState, isCached){
      if(isCached){
        _caches[url] = htmlText;
      }
 
      _target.innerHTML = htmlText;
 
      //if it's not the back button
      if(!isPopState){
        var state = {
          url : url,
          fragment : htmlText
        };
        window.history.pushState(state, "", url);
      }
 
      fire('complete');
    }
 
    /**
     * Add callback to an event of Pjaxer
     */
    function on(type, callback){
      var callbacks = _callbacks[type];
 
      if(callbacks == null){
        callbacks = [];
        _callbacks[type] = callbacks;
      }
 
      for(var i = 0, len = callbacks.length; i < len; i++){
        var cb = callbacks[i];
        if(cb == callback){
          return;
        }
      }
 
      callbacks.push(callback);
    }
 
 
    /**
     * Fires an event
     */
    function fire(type){
      var callbacks = _callbacks[type];
      for(var i = 0, len = callbacks.length; i < len; i++){
        var callback = callbacks[i];
        callback();
      }
    }
  }
 
 
  /**
   * Class for handling Ajax connection
   */
  function Ajax(){
    var _xhr;
    var _url;
    var _loadCallback;
    var _errorCallback;
 
    initialize.apply(this, arguments);
 
    return{
      load    : load,
      unload  : unload
    }
 
    function initialize(){
      _xhr = new XMLHttpRequest();
    }
 
    function load(url, loadCallback, errorCallback){
      _url = url;
      _loadCallback = loadCallback;
      _errorCallback = errorCallback;
 
      _xhr.open('GET', _url, true);
      _xhr.setRequestHeader('X-PJAX', 'true');
      _xhr.addEventListener('readystatechange', _onLoad, false);
      _xhr.send();
    }
 
    function unload(){
      _xhr.abort();
      _xhr.removeEventListener('readystatechange', _onLoad, false);
    }
 
    function _onLoad(e){
      var status = _xhr.status;
			var isSuccess = status >= 200 && status < 300 || status === 304;
      if(_xhr.readyState == 4){
        if(isSuccess){
          _xhr.removeEventListener('readystatechange', _onLoad, false);
          if(_loadCallback){
            _loadCallback(_xhr, _url);
          }
        }else{
          _xhr.removeEventListener('readystatechange', _onLoad, false);
          if(_errorCallback){
            _errorCallback(_xhr, _url);
          }
        }
      }
    }
  }

  Pjaxer.isSupported = window.history && window.history.pushState && window.history.replaceState &&
  !navigator.userAgent.match(/((iPod|iPhone|iPad).+\bOS\s+[1-4]|WebApps\/.+CFNetwork)/);
 
  global.Pjaxer = Pjaxer;
 
})(window);
