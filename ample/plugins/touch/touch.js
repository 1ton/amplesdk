/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2011 Anton Yakimov
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var oTouchEvent_touches = {},
    aTouchEvent_touches_history = [],
    nTouchEvent_pinch_last_distance = 0,
    nTouchEvent_PINCH_THRESHOLD = 1,        // Minimum distance to track pinch
    nTouchEvent_TIME_TO_KEEP_TOUCH = 2000,  // Milliseconds to keep touch object after it was ended or canceled
    nTouchEvent_TAP_TIMER = 170,            // Maximum number of milliseconds between start and end events to detect tap
    nTouchEvent_TAPHOLD_TIMER = 750,        // Time to wait for taphold
    nTouchEvent_DOUBLETAP_TIMER = 500,      // Maximum number of milliseconds between two taps to detect doubletap
    nTouchEvent_SWIPE_MIN_DISTANCE = 30,    // Minimum distance to track swipe
    nTouchEvent_DOUBLESWIPE_TIMER = 500;    // Maximum number of milliseconds between two swipes to detect doubleswipe

function fTouch_onTouchStart(oEvent) {
  var bDoubleTapHold = false,
      nCurrentTimestamp = Number(new Date);
  for (i in oTouchEvent_touches) {
    if (oTouchEvent_touches[i].endTimestamp
        && new Date - oTouchEvent_touches[i].endTimestamp > nTouchEvent_TIME_TO_KEEP_TOUCH) {
      delete oTouchEvent_touches[i];
    } else if (nCurrentTimestamp - oTouchEvent_touches[i].endTimestamp <= nTouchEvent_DOUBLETAP_TIMER) {
      bDoubleTapHold = true;
    }
  }

  for (var i=0; i< oEvent.touches.length; i++) {
    if (!oTouchEvent_touches[oEvent.touches[i].identifier]) {
      oTouchEvent_touches[oEvent.touches[i].identifier] = {};
      oTouchEvent_touches[oEvent.touches[i].identifier].identifier = oEvent.touches[i].identifier;
      oTouchEvent_touches[oEvent.touches[i].identifier].startX = oEvent.touches[i].pageX;
      oTouchEvent_touches[oEvent.touches[i].identifier].lastX = oEvent.touches[i].pageX;
      oTouchEvent_touches[oEvent.touches[i].identifier].startY = oEvent.touches[i].pageY;
      oTouchEvent_touches[oEvent.touches[i].identifier].lastY = oEvent.touches[i].pageY;
      oTouchEvent_touches[oEvent.touches[i].identifier].startTimestamp = Number(new Date);
      oTouchEvent_touches[oEvent.touches[i].identifier].swipe = false;
      oTouchEvent_touches[oEvent.touches[i].identifier].tapHoldTimer = setTimeout(function () {
          var oTapHoldEvent = ample.createEvent("UIEvents");
          oTapHoldEvent.initUIEvent("taphold", false, false, window, null);
          oEvent.target.dispatchEvent(oTapHoldEvent);
          if (bDoubleTapHold) {
            var oDoubleTapHoldEvent = ample.createEvent("UIEvents");
            oDoubleTapHoldEvent.initUIEvent("doubletaphold", false, false, window, null);
            oEvent.target.dispatchEvent(oDoubleTapHoldEvent);
          }
        }, nTouchEvent_TAPHOLD_TIMER);
      aTouchEvent_touches_history[aTouchEvent_touches_history.length] = oTouchEvent_touches[oEvent.touches[i].identifier];
    }
  }
  if (oEvent.touches.length == 2) {
    nTouchEvent_pinch_last_distance = Math.sqrt(Math.pow(oEvent.touches[0].pageX - oEvent.touches[1].pageX, 2)  + Math.pow(oEvent.touches[0].pageY - oEvent.touches[1].pageY, 2));
  }
};

function fTouch_onTouchMove(oEvent) {
  for (var i=0; i< oEvent.touches.length; i++) {
    var nTouchId = oEvent.touches[i].identifier;
    clearTimeout(oTouchEvent_touches[nTouchId].tapHoldTimer);

    oTouchEvent_touches[nTouchId].lastX = oEvent.touches[i].pageX;
    oTouchEvent_touches[nTouchId].lastY = oEvent.touches[i].pageY;

  }
  if (oEvent.touches.length == 2) {
    var nDistance = Math.sqrt(Math.pow(oEvent.touches[0].pageX - oEvent.touches[1].pageX, 2)  + Math.pow(oEvent.touches[0].pageY - oEvent.touches[1].pageY, 2)),
        nDelta = nTouchEvent_pinch_last_distance - nDistance;

    if (Math.abs(nDelta) >= nTouchEvent_PINCH_THRESHOLD) {
      var oPinchEvent = ample.createEvent("UIEvents");
      oPinchEvent.initUIEvent("pinch" + (nDelta < 0 ? 'in' : 'out'), false, false, window, nDistance);
      oEvent.target.dispatchEvent(oPinchEvent);
      nTouchEvent_pinch_last_distance = nDistance;
    }
  }
};

function fTouch_onTouchEnd(oEvent) {
  var oTouchesLeft = {},
      s = '',
      nCurrentTimestamp = Number(new Date),
      nTapsCount = 0,
      nSwipeCount = {
        'up' : 0,
        'down' : 0,
        'left' : 0,
        'right' : 0
      },
      nDoubleTapsCount = 0;
  for (var i=0; i<oEvent.touches.length; i++) {
    oTouchesLeft[oEvent.touches[i].identifier] = oEvent.touches[i];
  }
  for (i=0; i<aTouchEvent_touches_history.length; i++) {
    if (aTouchEvent_touches_history[i].endTimestamp
        && nCurrentTimestamp - aTouchEvent_touches_history[i].endTimestamp > nTouchEvent_TIME_TO_KEEP_TOUCH) {
      // Touch is expired
      delete oTouchEvent_touches[aTouchEvent_touches_history[i].id];
      aTouchEvent_touches_history.splice(i, 1);
      i--;

    } else if (aTouchEvent_touches_history[i].endTimestamp
        && aTouchEvent_touches_history[i].deltaX == 0 && aTouchEvent_touches_history[i].deltaY == 0
        && nCurrentTimestamp - aTouchEvent_touches_history[i].endTimestamp <= nTouchEvent_DOUBLETAP_TIMER
        && aTouchEvent_touches_history[i].endTimestamp - aTouchEvent_touches_history[i].startTimestamp <= nTouchEvent_TAP_TIMER) {
      // This is double tap
      nDoubleTapsCount++;
    } else if (aTouchEvent_touches_history[i].endTimestamp
        && nCurrentTimestamp - aTouchEvent_touches_history[i].endTimestamp <= nTouchEvent_DOUBLESWIPE_TIMER
        && aTouchEvent_touches_history[i].swipe !== false) {
      // This is swipe
      nSwipeCount[aTouchEvent_touches_history[i].swipe]++;
    } else if (!aTouchEvent_touches_history[i].endTimestamp && !oTouchesLeft[aTouchEvent_touches_history[i].identifier]) {
      // Touch is ended
      aTouchEvent_touches_history[i].endTimestamp = nCurrentTimestamp;
      aTouchEvent_touches_history[i].deltaX = aTouchEvent_touches_history[i].startX - aTouchEvent_touches_history[i].lastX;
      aTouchEvent_touches_history[i].deltaY = aTouchEvent_touches_history[i].startY - aTouchEvent_touches_history[i].lastY;
      clearTimeout(aTouchEvent_touches_history[i].tapHoldTimer);
      if (   oEvent.touches.length == 0
          && aTouchEvent_touches_history[i].deltaX == 0 && aTouchEvent_touches_history[i].deltaY == 0
          && aTouchEvent_touches_history[i].endTimestamp - aTouchEvent_touches_history[i].startTimestamp <= nTouchEvent_TAP_TIMER) {
        // Counting taps
        nTapsCount++;
      } else if (Math.abs(aTouchEvent_touches_history[i].deltaX) >= nTouchEvent_SWIPE_MIN_DISTANCE || Math.abs(aTouchEvent_touches_history[i].deltaY) >= nTouchEvent_SWIPE_MIN_DISTANCE) {
        // This is swipe
        var sSwipeDirection = '';
        sSwipeDirection = aTouchEvent_touches_history[i].deltaX > 0 ? 'left' : 'right';
        if (Math.abs(aTouchEvent_touches_history[i].deltaY/aTouchEvent_touches_history[i].deltaX) >= 2) {
          sSwipeDirection = aTouchEvent_touches_history[i].deltaY > 0 ? 'up' : 'down';
        }
        var oSwipeEvent = ample.createEvent("UIEvents");
        oSwipeEvent.initUIEvent("swipe", false, false, window, sSwipeDirection);
        oEvent.target.dispatchEvent(oSwipeEvent);

        var oSwipeDirectionEvent = ample.createEvent("UIEvents");
        oSwipeDirectionEvent.initUIEvent("swipe" + sSwipeDirection, false, false, window, null);
        oEvent.target.dispatchEvent(oSwipeDirectionEvent);

        aTouchEvent_touches_history[i].swipe = sSwipeDirection;
        // Doubleswipe
        if (nSwipeCount[sSwipeDirection] == 1) {
          var oDoubleSwipeEvent = ample.createEvent("UIEvents");
          oDoubleSwipeEvent.initUIEvent("doubleswipe", false, false, window, sSwipeDirection);
          oEvent.target.dispatchEvent(oDoubleSwipeEvent);

          var oDoubleSwipeDirectionEvent = ample.createEvent("UIEvents");
          oDoubleSwipeDirectionEvent.initUIEvent("doubleswipe" + sSwipeDirection, false, false, window, null);
          oEvent.target.dispatchEvent(oDoubleSwipeDirectionEvent);
        }
        // Swipeback
        if (   nSwipeCount['left'] == 1 && sSwipeDirection == 'right'
            || nSwipeCount['right'] == 1 && sSwipeDirection == 'left'
            || nSwipeCount['up'] == 1 && sSwipeDirection == 'down'
            || nSwipeCount['down'] == 1 && sSwipeDirection == 'up') {
          var oSwipeBackEvent = ample.createEvent("UIEvents");
          oSwipeBackEvent.initUIEvent("swipeback", false, false, window, null);
          oEvent.target.dispatchEvent(oSwipeBackEvent);
        }
      }
    }
  }

  if (nTapsCount) {
    var oTapEvent = ample.createEvent("UIEvents");
    oTapEvent.initUIEvent("tap", false, false, window, nTapsCount);
    oEvent.target.dispatchEvent(oTapEvent);

    if (nDoubleTapsCount) {
      var oDoubleTapEvent = ample.createEvent("UIEvents");
      oDoubleTapEvent.initUIEvent("doubletap", false, false, window, Math.min(nTapsCount, nDoubleTapsCount));
      oEvent.target.dispatchEvent(oDoubleTapEvent);
    }
  }
};

function fTouch_onTouchCancel(oEvent) {
  oTouchEvent_touches = {};
  aTouchEvent_touches_history = [];
};

ample.addEventListener("touchstart",	fTouch_onTouchStart,	false);
ample.addEventListener("touchmove",		fTouch_onTouchMove,		false);
ample.addEventListener("touchend",		fTouch_onTouchEnd,		false);
ample.addEventListener("touchcancel",	fTouch_onTouchCancel,	false);