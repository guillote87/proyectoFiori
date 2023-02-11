sap.ui.define([
    'sap/ui/core/mvc/Controller',
    'employees/model/formatter'
], function (Controller, formatter) {


    function onInit() {
        this._bus = sap.ui.getCore().getEventBus()
    }

    function onCreateIncidence() {
        var tableIncidence = this.getView().byId("tableIncidence")
        var newIncidence = sap.ui.xmlfragment("employees.fragment.NewIncidence", this)
        var incidenceModel = this.getView().getModel("incidenceModel")
        var odata = incidenceModel.getData()
        var index = odata.length
        odata.push({ index: index + 1 })
        incidenceModel.refresh()
        newIncidence.bindElement("incidenceModel>/" + index)
        tableIncidence.addContent(newIncidence)
    }
    function onDeleteIncidence(oEvent) {
        var oContext = oEvent.getSource().getBindingContext("incidenceModel").getObject()

        this._bus.publish("incidence", "onDeleteIncidence", {
            IncidenceId: oContext.IncidenceId,
            SapId: oContext.SapId,
            EmployeeId: oContext.EmployeeId
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
        var context = oEvent.getSource().getBindingContext("incidenceModel")
        var oContext = context.getObject()
        oContext.CreationDateX = true
    }
    function updateIncidenceReason(oEvent) {
        var context = oEvent.getSource().getBindingContext("incidenceModel")
        var oContext = context.getObject()
        oContext.ReasonX = true
    }
    function updateIncidenceType(oEvent) {
        var context = oEvent.getSource().getBindingContext("incidenceModel")
        var oContext = context.getObject()
        oContext.TypeX = true
    }

    var EmployeesDetail = Controller.extend("employees.controller.EmployeesDetail", {})

    EmployeesDetail.prototype.onInit = onInit
    EmployeesDetail.prototype.onCreateIncidence = onCreateIncidence
    EmployeesDetail.prototype.onDeleteIncidence = onDeleteIncidence

    EmployeesDetail.prototype.onSaveIncidence = onSaveIncidence
    EmployeesDetail.prototype.updateIncidenceCreationDate = updateIncidenceCreationDate
    EmployeesDetail.prototype.updateIncidenceReason = updateIncidenceReason
    EmployeesDetail.prototype.updateIncidenceType = updateIncidenceType
    EmployeesDetail.prototype.Formatter = formatter

    return EmployeesDetail
});