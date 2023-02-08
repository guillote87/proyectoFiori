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

        function onShowOrders2(oEvent) {
            var ordersTable = this.getView().byId("ordersTable")

            ordersTable.destroyItems()

            var itemPress = oEvent.getSource()
            var oContext = itemPress.getBindingContext("jsonEmployees")

            var objectContext = oContext.getObject()
            var orders = objectContext.Orders

            var ordersItems = []

            for (var i in orders) {
                ordersItems.push(new sap.m.ColumnListItem({
                    cells: [
                        new sap.m.Label({ text: orders[i].OrderID }),
                        new sap.m.Label({ text: orders[i].Freigth }),
                        new sap.m.Label({ text: orders[i].ShipAddress })
                    ]
                }))
            }

            var newTable = new sap.m.Table({
                width: "auto",
                columns: [
                    new sap.m.Column({ header: new sap.m.Label({ text: "{i18n>orderID}" }) }),
                    new sap.m.Column({ header: new sap.m.Label({ text: "{i18n>freight}" }) }),
                    new sap.m.Column({ header: new sap.m.Label({ text: "{i18n>shipAddress}" }) })
                ],
                items: ordersItems
            }).addStyleClass("sapUiSmallMargin")

            ordersTable.addItem(newTable)

            //Creamos la tabla
            var newTableJSON = new sap.m.Table()
            newTableJSON.setWidth("auto")
            newTableJSON.addStyleClass("sapUiSmallMargin")

            //Creamos las columnas
            var columnOrderID = new sap.m.Column()
            var labelOrderId = new sap.m.Label()
            labelOrderId.bindProperty("text", "i18n>orderID")
            columnOrderID.setHeader(labelOrderId)
            newTableJSON.addColumn(columnOrderID)

            var columnFreight = new sap.m.Column()
            var labelFreight = new sap.m.Label()
            labelFreight.bindProperty("text", "i18n>freight")
            columnFreight.setHeader(labelFreight)
            newTableJSON.addColumn(columnFreight)

            var columnShipAddress = new sap.m.Column()
            var labelShipAddress = new sap.m.Label()
            labelShipAddress.bindProperty("text", "i18n>shipAddress")
            columnShipAddress.setHeader(labelShipAddress)
            newTableJSON.addColumn(columnShipAddress)

            //Construimos los items

            var columnListItem = new sap.m.ColumnListItem();

            var cellOrderID = new sap.m.Label();
            cellOrderID.bindProperty("text", "jsonEmployees>OrderID");
            columnListItem.addCell(cellOrderID);

            var cellFreight = new sap.m.Label();
            cellFreight.bindProperty("text", "jsonEmployees>Freight");
            columnListItem.addCell(cellFreight);

            var cellShipAddress = new sap.m.Label();
            cellShipAddress.bindProperty("text", "jsonEmployees>ShipAddress");
            columnListItem.addCell(cellShipAddress);


            var oBindingInfo = {
                model: "jsonEmployees",
                path: "Orders",
                template: columnListItem
            }
            newTableJSON.bindAggregation("items", oBindingInfo)
            newTableJSON.bindElement("jsonEmployees>" + oContext.getPath())

            ordersTable.addItem(newTableJSON)

        }



        function onShowOrders(oEvent) {
            //Obtenemos el controlador
            var IconPressed = oEvent.getSource()
            var oContext = IconPressed.getBindingContext("jsonEmployees")

            if (!this._oDialogOrders) {
                this._oDialogOrders = sap.ui.xmlfragment("employees.fragment.DialogOrders", this)
                this.getView().addDependent(this._oDialogOrders)
            }
            // hacer el binding y acceder a los datos del elemento seleccionado

            this._oDialogOrders.bindElement("jsonEmployees>" + oContext.getPath())
            this._oDialogOrders.open()

        }
        function onCloseOrders() {
            this._oDialogOrders.close()
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
        Main.prototype.onShowOrders = onShowOrders
        Main.prototype.onCloseOrders = onCloseOrders
        return Main
    });

