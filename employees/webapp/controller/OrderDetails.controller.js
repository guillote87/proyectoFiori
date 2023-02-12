sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History"
  ],
  function (Controller, History) {
    "use strict";

    //Vinculamos la vista con la ruta del modelo northwind
    function _onObjectMatched(oEvent) {
      this.getView().bindElement({
        path: "/Orders(" + oEvent.getParameter("arguments").OrderID + ")",
        model: "odataNorthwind"
      })
    }
    return Controller.extend("employees.controller.OrderDetails", {

      onInit: function () {
        var oRouter = sap.ui.core.UIComponent.getRouterFor(this)
        oRouter.getRoute("RouteOrderDetails").attachPatternMatched(_onObjectMatched, this)
      },
      onBack: function (oEvent) {
        let oHistory = History.getInstance()
        let sPreviousHash = oHistory.getPreviousHash()
        if (sPreviousHash !== undefined) {
          window.history.go(-1)
        } else {
          var oRouter = sap.ui.core.UIComponent.getRouterFor(this)
          oRouter.navTo("RouteMainView", true)
        }
      }
    });
  }
);
