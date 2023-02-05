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

            var oJSONModel = new sap.ui.model.json.JSONModel();
            var oView = this.getView()

            // var i18nBundle = this.getView().getModel("i18n").getResourceBundle();
            // var oJSON = {
            //     employeeId: "12345",
            //     countryKey: "UK",
            //     listCountry: [
            //         {
            //             key: "US",
            //             text: i18nBundle.getText("countryUS")
            //         },
            //         {
            //             key: "UK",
            //             text: i18nBundle.getText("countryUK")
            //         },
            //         {
            //             key: "SP",
            //             text: i18nBundle.getText("countrySP")
            //         }
            //     ]
            // }
            // oJSONModel.setData(oJSON)
            oJSONModel.loadData("../localService/mockdata/Employees.json", false)

            // oJSONModel.attachRequestCompleted(function(oEventModel){
            //     console.log(JSON.stringify(oJSONModel.getData()))
            // })

            oView.setModel(oJSONModel)
        }

        function onFilter() {
            var oJSON = this.getView().getModel().getData()

            var aFilters = []

            if (oJSON.EmployeeId !== "") {
                aFilters.push(new Filter("EmployeeID", FilterOperator.EQ , oJSON.EmployeeId))
            }
            if (oJSON.CountryKey !== "") {
                aFilters.push(new Filter("Country", FilterOperator.EQ , oJSON.CountryKey))
            }


            var oList = this.byId("tableEmployee")
            var oBinding = oList.getBinding("items")

            oBinding.filter(aFilters)
        }

        function onClearFilter(){
        var oModel = this.getView().getModel()
        oModel.setProperty("/EmployeeId","")
        oModel.setProperty("/CountryKey","")
        }

        function showPostalCode (oEvent){
            var itemPress= oEvent.getSource()

            var oContext = itemPress.getBindingContext()
            var objectContext = oContext.getObject()

            MessageToast.show(objectContext.PostalCode)
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
        Main.prototype.onClearFilter= onClearFilter
        Main.prototype.showPostalCode = showPostalCode
        return Main
    });

