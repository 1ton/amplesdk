/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

//
cQuery.prototype.animate	= function(oProperties, vDuration, sEasing, fCallback) {
//->Guard
	fGuard(arguments, [
		["properties",	cObject],
		["duration",	cObject, true],
		["easing",		cObject, true],
		["callback",	cFunction, true]
	]);
//<-Guard

	var sPseudo	= arguments[4];
	fQuery_each(this, function() {
		fNodeAnimation_play(this, oProperties, vDuration, sEasing, fCallback, sPseudo);
	});

	return this;
};

cQuery.prototype.stop	= function() {
	// Invoke implementation
	fQuery_each(this, function() {
		fNodeAnimation_stop(this);
	});

	return this;
};

cQuery.prototype.delay	= function(vDuration) {
//->Guard
	fGuard(arguments, [
		["duration",	cObject]
	]);
//<-Guard

	fQuery_each(this, function() {
		fNodeAnimation_delay(this, vDuration);
	});

	return this;
};


// Pre-defined animations
cQuery.prototype.fadeIn	= function(vDuration, fCallback) {
//->Guard
	fGuard(arguments, [
		["duration",	cObject, true],
		["callback",	cFunction, true]
	]);
//<-Guard

	var oProperties	= {};
	oProperties.opacity	= 1;
	fQuery_each(this, function() {
		fBrowser_setStyle(this.$getContainer(), "display", '');
		fNodeAnimation_play(this, oProperties, vDuration, "ease", fCallback);
	});

	return this;
};

cQuery.prototype.fadeOut	= function(vDuration, fCallback) {
//->Guard
	fGuard(arguments, [
		["duration",	cObject, true],
		["callback",	cFunction, true]
	]);
//<-Guard

	var oProperties	= {};
	oProperties.opacity	= 0;
	fQuery_each(this, function() {
		fNodeAnimation_play(this, oProperties, vDuration, "ease", function() {
			this.$getContainer().style.display	= "none";
			if (fCallback)
				fCallback.call(this);
		});
	});

	return this;
};

cQuery.prototype.fadeTo	= function(vDuration, nOpacity, fCallback) {
//->Guard
	fGuard(arguments, [
		["duration",	cObject],
		["opacity",		cNumber],
		["callback",	cFunction, true]
	]);
//<-Guard

	var oProperties	= {};
	oProperties.opacity	= nOpacity;
	fQuery_each(this, function() {
		fNodeAnimation_play(this, oProperties, vDuration, "ease", fCallback);
	});

	return this;
};

cQuery.prototype.show	= function(vDuration, fCallback) {
//->Guard
	fGuard(arguments, [
			["duration",	cObject, true],
			["callback",	cFunction, true]
		]);
//<-Guard

	fQuery_each(this, function() {
		var oElementDOM	= this.$getContainer(),
			sStyle	= this.attributes.style,
			oStyle	= oElementDOM.style;
		if (oStyle.display == "none") {
			if (sStyle)
				this.attributes.style	= sStyle.replace(/display\s*:\s*[\w-]+\s*;?/, '');
			//
			oStyle.display	= '';
			//
			if (vDuration) {
				var oProperties	= {},
					oComputedStyle	= fBrowser_getComputedStyle(oElementDOM);
				oProperties.width	= fBrowser_adjustStyleValue(oElementDOM, "width", fBrowser_getStyle(oElementDOM, "width", oComputedStyle));
				oProperties.height	= fBrowser_adjustStyleValue(oElementDOM, "height", fBrowser_getStyle(oElementDOM, "height", oComputedStyle));
				oProperties.opacity	= '1';
				//
				oStyle.width	= 0;
				oStyle.height	= 0;
				oStyle.overflow	= "hidden";
				fBrowser_setStyle(oElementDOM, "opacity", '0');
				fNodeAnimation_play(this, oProperties, vDuration, "ease", function() {
					// Restore values
					oStyle.width	= '';
					oStyle.height	= '';
					oStyle.overflow	= '';
					fBrowser_setStyle(oElementDOM, "opacity", '');
					// Call callback
					if (fCallback)
						fCallback.call(this);
				});
			}
		}
	});

	return this;
};

cQuery.prototype.hide	= function(vDuration, fCallback) {
//->Guard
	fGuard(arguments, [
			["duration",	cObject, true],
			["callback",	cFunction, true]
		]);
//<-Guard

	fQuery_each(this, function() {
		var oElementDOM	= this.$getContainer(),
			oStyle	= oElementDOM.style;
		if (oStyle.display != "none") {
			if (vDuration) {
				var oProperties	= {};
				oProperties.width	= '0px';
				oProperties.height	= '0px';
				oProperties.opacity	= '0';
				//
				oStyle.overflow	= "hidden";
				fBrowser_setStyle(oElementDOM, "opacity", '1');
				fNodeAnimation_play(this, oProperties, vDuration, "ease", function() {
					var sStyle	= this.attributes.style || '';
					if (sStyle)
						sStyle	= sStyle.replace(/display\s*:\s*[\w-]+\s*;?/, '');
					this.attributes.style	= "display" + ':' + "none" + ';' + sStyle;
					//
					oStyle.display	= "none";
					// Restore values
					oStyle.width	= '';
					oStyle.height	= '';
					oStyle.overflow	= '';
					fBrowser_setStyle(oElementDOM, "opacity", '');
					// Call callback
					if (fCallback)
						fCallback.call(this);
				});
			}
			else
				oStyle.display	= "none";
		}
	});

	return this;
};

cQuery.prototype.slideDown	= function(vDuration, fCallback) {
//->Guard
	fGuard(arguments, [
		["duration",	cObject, true],
		["callback",	cFunction, true]
	]);
//<-Guard

	fQuery_each(this, function() {
		var oElementDOM	= this.$getContainer(),
			oStyle	= oElementDOM.style;
		if (oStyle.display == "none") {
			oStyle.display	= '';
			var oProperties	= {},
				oComputedStyle	= fBrowser_getComputedStyle(oElementDOM);
			oProperties.height	= fBrowser_adjustStyleValue(oElementDOM, "height", fBrowser_getStyle(oElementDOM, "height", oComputedStyle));
			oProperties.opacity	= '1';
			//
			oStyle.height	= 0;
			oStyle.overflow	= "hidden";
			fBrowser_setStyle(oElementDOM, "opacity", '0');
			fNodeAnimation_play(this, oProperties, vDuration || "normal", "ease", function() {
				// Restore values
				oStyle.height	= '';
				oStyle.overflow	= '';
				fBrowser_setStyle(oElementDOM, "opacity", '');
				// Call callback
				if (fCallback)
					fCallback.call(this);
			});
		}
	});

	return this;
};

cQuery.prototype.slideUp		= function(vDuration, fCallback) {
//->Guard
	fGuard(arguments, [
		["duration",	cObject, true],
		["callback",	cFunction, true]
	]);
//<-Guard

	fQuery_each(this, function() {
		var oElementDOM	= this.$getContainer(),
			oStyle	= oElementDOM.style;
		if (oStyle.display != "none") {
			var oProperties	= {};
			oProperties.height	= '0px';
			oProperties.opacity	= '0';
			//
			oStyle.overflow	= "hidden";
			fBrowser_setStyle(oElementDOM, "opacity", '1');
			fNodeAnimation_play(this, oProperties, vDuration || "normal", "ease", function() {
				oStyle.display	= "none";
				// Restore values
				oStyle.height	= '';
				oStyle.overflow	= '';
				fBrowser_setStyle(oElementDOM, "opacity", '');
				// Call callback
				if (fCallback)
					fCallback.call(this);
			});
		}
	});

	return this;
};

// Extend ample object
oAmple.easing	= oNodeAnimation_easing;
