sap.ui.define([
    'sap/ui/core/mvc/Controller'
], function (Controller) {

    return Controller.extend("employees.controller.Main", {
        onInit: function () {
            var oView = this.getView()


            var oJSONModelEmp = new sap.ui.model.json.JSONModel();
            oJSONModelEmp.loadData("../localService/mockdata/Employees.json", false)
            oView.setModel(oJSONModelEmp, "jsonEmployees")

            var oJSONModelCountries = new sap.ui.model.json.JSONModel();
            oJSONModelCountries.loadData("../localService/mockdata/Countries.json", false)
            oView.setModel(oJSONModelCountries, "jsonCountries")

            var oJSONModelLayout = new sap.ui.model.json.JSONModel();
            oJSONModelLayout.loadData("../localService/mockdata/Layout.json", false)
            oView.setModel(oJSONModelLayout, "jsonLayout")

            var oJSONModelConfig = new sap.ui.model.json.JSONModel({
                visibleID: true,
                visibleName: true,
                visibleCountry: true,
                visibleCity: false,
                visibleBtnShowCity: true,
                visibleBtnHideCity: false
            });
            oView.setModel(oJSONModelConfig, "jsonConfig")

            this._bus = sap.ui.getCore().getEventBus()
            this._bus.subscribe("flexible", "showEmployee", this.showEmployeeDetails, this)
            this._bus.subscribe()
        },
        showEmployeeDetails: function (category, nameEvent, path) {
            var detailView = this.getView().byId("detailEmployeeView")
            detailView.bindElement("jsonEmployees>" + path)
            this.getView().getModel("jsonLayout").setProperty("/ActiveKey","TwoColumnsMidExpanded")

        }
    })


});