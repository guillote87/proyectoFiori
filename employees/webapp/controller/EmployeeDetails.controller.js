sap.ui.define([
    'sap/ui/core/mvc/Controller',
    'employees/model/formatter',
    'sap/m/MessageBox'
], function (Controller, formatter, MessageBox) {


    function onInit() {
        this._bus = sap.ui.getCore().getEventBus()
    }

    function onCreateIncidence() {
        var tableIncidence = this.getView().byId("tableIncidence")
        var newIncidence = sap.ui.xmlfragment("employees.fragment.NewIncidence", this)
        var incidenceModel = this.getView().getModel("incidenceModel")
        var odata = incidenceModel.getData()
        var index = odata.length
        //Validaciones de campos  _ValidateDate y anulo boton Save
        odata.push({ index: index + 1, _ValidateDate: false, EnabledSave: false })


        incidenceModel.refresh()
        newIncidence.bindElement("incidenceModel>/" + index)
        tableIncidence.addContent(newIncidence)
    }
    function onDeleteIncidence(oEvent) {
        let oResourceBundle = this.getView().getModel("i18n").getResourceBundle()

        var oContext = oEvent.getSource().getBindingContext("incidenceModel").getObject()

        //Manejamos la confirmacion del mensaje de confirmacion del delete
        MessageBox.confirm(oResourceBundle.getText("confirmDeleteIncidence"), {
            onClose: function (oAction) {

                if (oAction === "OK") {
                    this._bus.publish("incidence", "onDeleteIncidence", {
                        IncidenceId: oContext.IncidenceId,
                        SapId: oContext.SapId,
                        EmployeeId: oContext.EmployeeId
                    })
                }
        }.bind(this)
    })

    }
    function onSaveIncidence(oEvent) {
        var incidence = oEvent.getSource().getParent().getParent()
        var incidenceRow = incidence.getBindingContext("incidenceModel")
        this._bus.publish("incidence", "onSaveIncidence", {
            incidenceRow: incidenceRow.sPath.replace('/', '')
        })
    }
    function updateIncidenceCreationDate(oEvent) {
        let oResourceBundle = this.getView().getModel("i18n").getResourceBundle()
        let context = oEvent.getSource().getBindingContext("incidenceModel")
        let oContext = context.getObject()

        if (!oEvent.getSource().isValidValue()) {
            oContext._ValidateDate = false
            oContext.CreationDateState = "Error"
            MessageBox.error(oResourceBundle.getText("errorCreationDateValue"), {
                title: "Error",
                onClose: null,
                styleClass: "",
                actions: MessageBox.Action.Close,
                emphasizedAction: null,
                initialFocus: null,
                textDirection: sap.ui.core.TextDirection.Inherit
            })
        } else {
            oContext._ValidateDate = true
            oContext.CreationDateState = "None"
            oContext.CreationDateX = true
        }

        //Validamos que haya fecha valida y valor introducido en Reason para habilitar el Boton Save

        if (oEvent.getSource().isValidValue() && oContext.Reason) {
            oContext.EnabledSave = true
        } else {
            oContext.EnabledSave = false
        }
        context.getModel().refresh()
    }
    function updateIncidenceReason(oEvent) {
        let context = oEvent.getSource().getBindingContext("incidenceModel")
        let oContext = context.getObject()

        //Validaciones
        if (oEvent.getSource().getValue()) {
            oContext.ReasonX = true
            oContext.ReasonState = "None"
        } else {
            oContext.ReasonState = "Error"
        }

        //Validamos que haya fecha valida y valor introducido en Reason para habilitar el Boton Save
        if (oContext._ValidateDate && oEvent.getSource().getValue()) {
            oContext.EnabledSave = true
        } else {
            oContext.EnabledSave = false
        }

        context.getModel().refresh()
    }
    function updateIncidenceType(oEvent) {
        var context = oEvent.getSource().getBindingContext("incidenceModel")
        var oContext = context.getObject()

        //Validamos que haya fecha valida y valor introducido en Reason para habilitar el Boton Save
        if (oContext._ValidateDate && oContext.Reason) {
            oContext.EnabledSave = true
        } else {
            oContext.EnabledSave = false
        }
        oContext.TypeX = true
        context.getModel().refresh()

    }
    function toOrderDetails(oEvent) {
        let orderID = oEvent.getSource().getBindingContext("odataNorthwind").getObject().OrderID

        let oRouter = sap.ui.core.UIComponent.getRouterFor(this)
        oRouter.navTo("RouteOrderDetails",{
            OrderID: orderID
        })
    }

    var EmployeesDetail = Controller.extend("employees.controller.EmployeesDetail", {})

    EmployeesDetail.prototype.onInit = onInit
    EmployeesDetail.prototype.onCreateIncidence = onCreateIncidence
    EmployeesDetail.prototype.onDeleteIncidence = onDeleteIncidence

    EmployeesDetail.prototype.onSaveIncidence = onSaveIncidence
    EmployeesDetail.prototype.updateIncidenceCreationDate = updateIncidenceCreationDate
    EmployeesDetail.prototype.updateIncidenceReason = updateIncidenceReason
    EmployeesDetail.prototype.updateIncidenceType = updateIncidenceType
    EmployeesDetail.prototype.toOrderDetails = toOrderDetails
    EmployeesDetail.prototype.Formatter = formatter

    return EmployeesDetail
});