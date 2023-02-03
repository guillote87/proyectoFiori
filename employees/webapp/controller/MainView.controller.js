sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        var Main =  Controller.extend("employees.controller.MainView", {})
          
         Main.prototype.onValidate = function () {
                var inputEmployee = this.byId("inputEmployee")
                var valueEmployee = inputEmployee.getValue()

                    if (valueEmployee.length == 6) {
                   // inputEmployee.setDescription("OK")
                    this.byId("slCountry").setVisible(true)
                    this.byId("labelCountry").setVisible(true)


                } else {
                    // inputEmployee.setDescription("Not OK")
                    this.byId("slCountry").setVisible(false)
                    this.byId("labelCountry").setVisible(false)
                }
            }
            return Main
        });

