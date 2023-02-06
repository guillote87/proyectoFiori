/*global QUnit*/

sap.ui.define([
	"lists/controller/ListTypes.controller"
], function (Controller) {
	"use strict";

	QUnit.module("ListTypes Controller");

	QUnit.test("I should test the ListTypes controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
