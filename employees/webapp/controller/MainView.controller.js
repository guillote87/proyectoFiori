sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageToast"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     * @param {typeof sap.ui.model.Filter} Filter
     * @param {typeof sap.ui.model.FilterOperator} FilterOperator
     * @param {typeof sap.m.MessageToast} MessageToast
     */
    function (Controller, Filter, FilterOperator, MessageToast) {
        "use strict";

        function onInit() {

            var oView = this.getView()


            var oJSONModelEmp = new sap.ui.model.json.JSONModel();
            oJSONModelEmp.loadData("../localService/mockdata/Employees.json", false)
            oView.setModel(oJSONModelEmp, "jsonEmployees")

            var oJSONModelCountries = new sap.ui.model.json.JSONModel();
            oJSONModelCountries.loadData("../localService/mockdata/Countries.json", false)
            oView.setModel(oJSONModelCountries, "jsonCountries")

            var oJSONModelConfig = new sap.ui.model.json.JSONModel({
                visibleID: true,
                visibleName: true,
                visibleCountry: true,
                visibleCity: false,
                visibleBtnShowCity: true,
                visibleBtnHideCity: false
            });
            oView.setModel(oJSONModelConfig, "jsonConfig")
        }

        function onFilter() {
            var oJSONCountries = this.getView().getModel("jsonCountries").getData()

            var aFilters = []

            if (oJSONCountries.EmployeeId !== "") {
                aFilters.push(new Filter("EmployeeID", FilterOperator.EQ, oJSONCountries.EmployeeId))
            }
            if (oJSONCountries.CountryKey !== "") {
                aFilters.push(new Filter("Country", FilterOperator.EQ, oJSONCountries.CountryKey))
            }


            var oList = this.byId("tableEmployee")
            var oBinding = oList.getBinding("items")

            oBinding.filter(aFilters)
        }

        function onClearFilter() {
            var oModel = this.getView().getModel("jsonCountries")
            oModel.setProperty("/EmployeeId", "")
            oModel.setProperty("/CountryKey", "")
        }

        function onShowPostalCode(oEvent) {
            var itemPress = oEvent.getSource()

            var oContext = itemPress.getBindingContext("jsonEmployees")
            var objectContext = oContext.getObject()

            MessageToast.show(objectContext.PostalCode)
        }

        function onShowCity() {
            var oJSONModelConfig = this.getView().getModel("jsonConfig")
            oJSONModelConfig.setProperty("/visibleCity", true)
            oJSONModelConfig.setProperty("/visibleBtnShowCity", false)
            oJSONModelConfig.setProperty("/visibleBtnHideCity", true)
        }

        function onHideCity() {
            var oJSONModelConfig = this.getView().getModel("jsonConfig")
            oJSONModelConfig.setProperty("/visibleCity", false)
            oJSONModelConfig.setProperty("/visibleBtnShowCity", true)
            oJSONModelConfig.setProperty("/visibleBtnHideCity", false)
        }

        var Main = Controller.extend("employees.controller.MainView", {})
        Main.prototype.onValidate = function () {
            var inputEmployee = this.byId("inputEmployee");
            var valueEmployee = inputEmployee.getValue();

            if (valueEmployee.length === 6) {
                //inputEmployee.setDescription("OK");
                this.getView().byId("labelCountry").setVisible(true);
                this.getView().byId("slCountry").setVisible(true);
            } else {
                //inputEmployee.setDescription("Not OK");
                this.getView().byId("labelCountry").setVisible(false);
                this.getView().byId("slCountry").setVisible(false);
            }
        };
        Main.prototype.onInit = onInit
        Main.prototype.onFilter = onFilter
        Main.prototype.onClearFilter = onClearFilter
        Main.prototype.onShowPostalCode = onShowPostalCode
        Main.prototype.onShowCity = onShowCity
        Main.prototype.onHideCity = onHideCity
        return Main
    });

