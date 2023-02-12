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
            this._bus = sap.ui.getCore().getEventBus()
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

            var oContext = itemPress.getBindingContext("odataNorthwind")
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
            var oContext = itemPress.getBindingContext("odataNorthwind")

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
            cellOrderID.bindProperty("text", "odataNorthwind>OrderID");
            columnListItem.addCell(cellOrderID);

            var cellFreight = new sap.m.Label();
            cellFreight.bindProperty("text", "odataNorthwind>Freight");
            columnListItem.addCell(cellFreight);

            var cellShipAddress = new sap.m.Label();
            cellShipAddress.bindProperty("text", "odataNorthwind>ShipAddress");
            columnListItem.addCell(cellShipAddress);


            var oBindingInfo = {
                model: "odataNorthwind",
                path: "Orders",
                template: columnListItem
            }
            newTableJSON.bindAggregation("items", oBindingInfo)
            newTableJSON.bindElement("odataNorthwind>" + oContext.getPath())

            ordersTable.addItem(newTableJSON)

        }



        function onShowOrders(oEvent) {
            //Obtenemos el controlador
            var IconPressed = oEvent.getSource()
            var oContext = IconPressed.getBindingContext("odataNorthwind")

            if (!this._oDialogOrders) {
                this._oDialogOrders = sap.ui.xmlfragment("employees.fragment.DialogOrders", this)
                this.getView().addDependent(this._oDialogOrders)
            }
            // hacer el binding y acceder a los datos del elemento seleccionado

            this._oDialogOrders.bindElement("odataNorthwind>" + oContext.getPath())
            this._oDialogOrders.open()

        }
        function onCloseOrders() {
            this._oDialogOrders.close()
        }

        function onShowEmployee(oEvent) {
            var path = oEvent.getSource().getBindingContext("odataNorthwind").getPath()
            this._bus.publish("flexible", "showEmployee", path)

        }
        function toOrderDetails(oEvent) {
            let orderID = oEvent.getSource().getBindingContext("odataNorthwind").getObject().OrderID

            let oRouter = sap.ui.core.UIComponent.getRouterFor(this)
            oRouter.navTo("RouteOrderDetails",{
                OrderID: orderID
            })

        }
        

        var Main = Controller.extend("employees.controller.MasterEmployee", {})

        Main.prototype.onInit = onInit
        Main.prototype.onFilter = onFilter
        Main.prototype.onClearFilter = onClearFilter
        Main.prototype.onShowPostalCode = onShowPostalCode
        Main.prototype.onShowCity = onShowCity
        Main.prototype.onHideCity = onHideCity
        Main.prototype.onShowOrders = onShowOrders
        Main.prototype.onCloseOrders = onCloseOrders
        Main.prototype.onShowEmployee = onShowEmployee
        Main.prototype.toOrderDetails = toOrderDetails
        return Main
    });

