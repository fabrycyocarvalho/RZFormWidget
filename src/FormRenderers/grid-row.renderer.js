/**
 * Created by Anderson on 12/01/2016.
 * Widget Grid Row Renderer
 * grid-row.renderer.js
 */
rz.widgets.FormRenderers["grid-row"] = function (params, sender) {
    var $this = this;
    var initialize = function () {
        $this.params = params;
        $this.sender = sender;
    };

    this.render = function (target, params,createDomElement) {
        $this.target = target;
        var sb = new StringBuilder();
        sb.appendFormat('    <tr id="{0}base_form">', target);
        rz.widgets.formHelpers.renderDataRows(sb, params, $this.renderDataField);

        sb.appendFormat('    </tr>');

        createDomElement({
            target: "#" + target,
            data:sb,
            method: "append",
            doAfterRenderAction:function(){
                rz.widgets.formHelpers.doPosRenderActions($this.sender);
                rz.widgets.formHelpers.bindEventHandlers($this.sender);
            }
        });
        $this.sender.innerWidgetInitializeData.forEach(function(data){
            if(data.doAfterRenderAction!==undefined) data.doAfterRenderAction();
        });
        $this.sender.innerWidgetInitializeData = [];
    };

    this.renderDataField = function (sb, field) {
        var fieldID = (field.id || field.model || "row_" + generateRandomID(8)).replace(/\./g, "_");
        if (field.fieldGroup) {
            field.fields.forEach(function (it) {
                $this.renderDataField(sb, it);
            });
        }
        else {
            field.type = field.type || "text";
            field.id = "*_*".replace("*", $this.target).replace("*",fieldID);

            sb.appendFormat('<td id="{0}" data-fieldtype="{1}" data-model="{2}" {3} class="row-form-field field{4} {5}">',
                field.id,
                field.type,
                rz.widgets.formHelpers.resolveModelName(field, fieldID),
                rz.widgets.formHelpers.getInitialValueData(field),
                rz.widgets.formHelpers.resolveFieldSet(field),
                field.containerCssClass || ""
            );
            var inputID = $this.target + "_" + fieldID + "_" + field.type;
            rz.widgets.formHelpers.renderDataFieldByType(sb, field, inputID, $this);
            sb.append('</td>');
        }

    };

    this.fieldCount = function () {
        return $("#" + $this.target + "base_form > .row-form-field").length;
    };

    this.getFieldIdAt = function (position) {
        var p = position;
        if (p >= 0 && p < $this.sender.fieldCount()) {
            return $("#" + $this.target + "base_form > .row-form-field").eq(p).attr("id");
        }
    };

    this.addField = function (fielddata) {
        var sb = new StringBuilder();
        $this.renderDataField(sb, fielddata);
        $(sb.toString()).appendTo("#" + $this.target + "base_form");
    };

    this.insertField = function (fielddata, position) {
        var sb = new StringBuilder();
        $this.renderDataField(sb, fielddata);
        $("#" + $this.target + "base_form > .row-form-field").eq(position).before(sb.toString());
    };

    this.removeFieldAt = function (position) {
        var p = position;
        if (p >= 0 && p < $this.sender.fieldCount()) {
            $("#" + $this.target + "base_form > .row-form-field").eq(p).remove();
        }
    };

    this.getValueAt = function (position) {
        var p = position;
        if (p >= 0 && p < $this.sender.fieldCount()) {
            var id = $("#" + $this.target + "base_form > .row-form-field").eq(p).attr("id");
            return rz.widgets.formHelpers.getValueOfField("#" + id);
        }
    };

    this.setValueAt = function (position, value) {
        var p = position;
        if (p >= 0 && p < $this.sender.fieldCount()) {
            var id = $("#" + $this.target + "base_form > .row-form-field").eq(p).attr("id");
            rz.widgets.formHelpers.setValueOfField("#" + id, value,$this.sender);
            rz.widgets.formHelpers.emit("data-changed", {fieldid: id, value: value, src: "code"}, $this.sender);
        }
    };

    // this.setValueOf = function (fieldid, value) {
    //     if(fieldid !==undefined){
    //         if (!fieldid.startsWith($this.target + "_")) {
    //             fieldid = $this.target + "_" + fieldid;
    //         }
    //         rz.widgets.formHelpers.setValueOfField("#" + fieldid, value,$this.sender);
    //         rz.widgets.formHelpers.emit("data-changed", {fieldid: fieldid, value: value, src: "code"}, $this.sender);
    //     }
    // };

    this.displayValidationReport = function(){
        rz.widgets.formHelpers.displayValidationReportImpl($this);
    };
    
    initialize();
};