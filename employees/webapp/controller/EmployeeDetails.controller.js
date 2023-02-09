sap.ui.define([
    'sap/ui/core/mvc/Controller',
    'employees/model/formatter'
], function (Controller, formatter) {


    function onInit() {

    }

    function onCreateIncidence() {
        var tableIncidence = this.getView().byId("tableIncidence")
        var newIncidence = sap.ui.xmlfragment("employees.fragment.NewIncidence", this)
        var incidenceModel = this.getView().getModel("jsonIncidence")
        var odata = incidenceModel.getData()
        var index = odata.length
        odata.push({ index: index + 1 })
        incidenceModel.refresh()
        newIncidence.bindElement("jsonIncidence>/" + index)
        tableIncidence.addContent(newIncidence)
    }
    function onDeleteIncidence(oEvent) {
        var tableIncidence = this.getView().byId("tableIncidence")
        var rowIncidence = oEvent.getSource().getParent().getParent()
        var incidenceModel = this.getView().getModel("jsonIncidence")
        var odata = incidenceModel.getData()
        var oContext = rowIncidence.getBindingContext("jsonIncidence")
        odata.splice(oContext.index - 1, 1)
        for (var i in odata) {
            odata[i].index = parseInt(i) + 1
        }

        incidenceModel.refresh()

        tableIncidence.removeContent(rowIncidence)

        for (var j in tableIncidence.getContent()){
            tableIncidence.getContent()[j].bindElement("jsonIncidence>/"+j)
        }

    }

    var EmployeesDetail = Controller.extend("employees.controller.EmployeesDetail", {})

    EmployeesDetail.prototype.onInit = onInit
    EmployeesDetail.prototype.onCreateIncidence = onCreateIncidence
    EmployeesDetail.prototype.onDeleteIncidence = onDeleteIncidence
    EmployeesDetail.prototype.Formatter = formatter

    return EmployeesDetail
});