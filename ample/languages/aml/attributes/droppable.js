/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cAMLAttr_droppable	= function(){};
cAMLAttr_droppable.prototype	= new cAMLAttr("droppable");

// Class Events Handlers
cAMLAttr_droppable.handlers		= {
	"DOMNodeInsertedIntoDocument":	function(oEvent) {
		this.ownerElement.$droppable	= this.value == "true";
	},
	"DOMNodeRemovedFromDocument":	function(oEvent) {
		this.ownerElement.$droppable	= false;
	}
};

// Register Attribute
ample.extend(cAMLAttr_droppable);
