/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULElement_spinbuttons	= function(){};
cXULElement_spinbuttons.prototype	= new cXULElement;

// Private property
cXULElement_spinbuttons.captured	= false;
cXULElement_spinbuttons.interval	= null;
cXULElement_spinbuttons.timeout		= null;

// Class event handlers
cXULElement_spinbuttons.handlers	= {
	"mousedown":	function(oEvent) {
		if (oEvent.$pseudoTarget == this.$getContainer("button-up")) {
			this.increment();
			var that	= this;
			cXULElement_spinbuttons.timeout	= setTimeout(function() {
				cXULElement_spinbuttons.interval	= setInterval(function() {
					that.increment();
				}, 100);
			}, 500);
			this.$setPseudoClass("active", true, "button-up");
			this._captured	= true;
			this.setCapture(true);
		}
		else
		if (oEvent.$pseudoTarget == this.$getContainer("button-down")) {
			this.decrement();
			var that	= this;
			cXULElement_spinbuttons.timeout	= setTimeout(function() {
				cXULElement_spinbuttons.interval	= setInterval(function() {
					that.decrement();
				}, 100);
			}, 500);
			this.$setPseudoClass("active", true, "button-down");
			this._captured	= true;
			this.setCapture(true);
		}
	},
	"mouseup":	function(oEvent) {
		if (this._captured) {
			this._captured	= false;
			clearTimeout(cXULElement_spinbuttons.timeout);
			clearInterval(cXULElement_spinbuttons.interval);
			this.$setPseudoClass("active", false, "button-up");
			this.$setPseudoClass("active", false, "button-down");
			this.releaseCapture();
		}
	},
	"DOMAttrModifed":	function(oEvent) {
		if (oEvent.target == this) {
			switch (oEvent.attrName) {
				case "disabled":
					this.$setPseudoClass("disabled", oEvent.newValue == "true");
					break;
			}
		}
	}
};

//
cXULElement_spinbuttons.prototype.increment	= function() {
	var oEvent	= this.ownerDocument.createEvent("CustomEvent");
	oEvent.initCustomEvent("spin", false, false, +1);
	this.dispatchEvent(oEvent);
	console.log(1);
};

cXULElement_spinbuttons.prototype.decrement	= function() {
	var oEvent	= this.ownerDocument.createEvent("CustomEvent");
	oEvent.initCustomEvent("spin", false, false, -1);
	this.dispatchEvent(oEvent);
};

// Element Render: open
cXULElement_spinbuttons.prototype.$getTagOpen	= function() {
	return '<div class="xul-spinbuttons' + (this.attributes["disabled"] == "true" ? ' xul-spinbuttons_disabled' : '')+ '">\
				<div class="xul-spinbuttons--button-up" onmouseover="if (!ample.$instance(this).attributes[\'disabled\']) ample.$instance(this).$setPseudoClass(\'hover\', true, \'button-up\')" onmouseout="if (!ample.$instance(this).attributes[\'disabled\']) ample.$instance(this).$setPseudoClass(\'hover\', false, \'button-up\')" onmousedown="return false"><br/></div>\
				<div class="xul-spinbuttons--button-down" onmouseover="if (!ample.$instance(this).attributes[\'disabled\']) ample.$instance(this).$setPseudoClass(\'hover\', true, \'button-down\')" onmouseout="if (!ample.$instance(this).attributes[\'disabled\']) ample.$instance(this).$setPseudoClass(\'hover\', false, \'button-down\')" onmousedown="return false"><br/></div>\
			</div>';
};

// Register Element with language
oXULNamespace.setElement("spinbuttons", cXULElement_spinbuttons);