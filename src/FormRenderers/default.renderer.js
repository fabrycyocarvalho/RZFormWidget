/**
 * Created by Anderson on 12/01/2016.
 * Widget default renderer
 */
rz.widgets.FormRenderers["default"] = function (params, sender) {
    var $this = this;
    var initialize = function () {
        var defaultParams = {
            horizontal : false,
            formLabelSizeClass:"col-sm-2",
            formValueSizeClass:"col-sm-10",
            validation:{
                enabled:true,
                rules:[]
            }
        };

        $this.params = $.extend(true, {}, defaultParams, params);
        $this.sender = sender;
    };

    /**
     * renderizes the widget
     * @param {string} target
     * @param {object} params
     */
    this.render = function (target, params) {
        $this.params = params;
        $this.target = target;
        var baseID = target+"base_form";
        var sb = new StringBuilder();
        sb.append('<div class="form-widget">');
        sb.appendFormat('  <form id="{0}" class="{1} ui form">', baseID, (params.horizontal) ? "form-horizontal" : "");
        var hasTabs = isElegibleFormTabPanel();
        if (hasTabs) {
            renderTabPanels(sb);
        }

        rz.widgets.formHelpers.renderDataRows(sb, params, renderDataField);
        sb.append('  </form>');
        sb.appendFormat('<div id="{0}_validation_report" class="validation-report-container"></div>',target);
        sb.append('</div>');
        $("#" + target).append(sb.toString());
        $this.sender.baseID = baseID;
        rz.widgets.formHelpers.doPosRenderActions($this.sender);
        rz.widgets.formHelpers.bindEventHandlers($this.sender);
    };

    var isElegibleFormTabPanel = function () {
        var elegible = true;
        $this.params.fields.forEach(function (it) {
            if (!it.fieldGroup) {
                elegible = false;
                return null;
            }
        });
        return elegible;
    };

    var activeTabIndex = function () {
        var index = 0;
        $this.params.fields.forEach(function (it, id) {
            if (it.active) index = id;
        });
        return index;
    };

    var renderTabPanels = function (sb) {
        var actidx = activeTabIndex();
        sb.appendFormat('<div class="ui top attached tabular menu rz-tabpanel">');
        $this.params.fields.forEach(function (it, id) {
            var targetID = generateRandomID(12);
            sb.appendFormat('<a class="item {2}" data-tab="{1}">{0}</a>'
                , it.groupLabel
                , targetID
                , (id == actidx) ? "active" : "");
            it.groupID = targetID;
            it.active = (id == actidx);
        });
        sb.appendFormat('</div>');
    };

    var renderCollapseContainer = function (sb, fieldID, field) {
        sb.appendFormat('<div class="ui styled fluid accordion">');
        sb.appendFormat('    <div class="active title">');
        sb.appendFormat('    <i class="dropdown icon"></i>');
        sb.appendFormat('    {0}',field.groupLabel || "");
        sb.appendFormat('</div>');
        sb.appendFormat('<div class="active content">');

        field.fields.forEach(function (it) {
            renderDataField(sb, it);
        });

        sb.appendFormat('</div>');
        sb.appendFormat('</div>');
    };

    var renderTabContainer = function (sb, field) {
        sb.appendFormat('<div class="ui bottom attached tab segment {1}" data-tab="{0}">',
            field.groupID,
            (field.active) ? "active" : ""
        );
        field.fields.forEach(function (it) {
            renderDataField(sb, it);
        });
        sb.appendFormat('</div>');
    };

    var renderFieldGroupContainer = function(sb, fieldID, field){
        var c = ["zero", "one","two","three","four","five","six","seven", "eight","nine","ten","eleven","twelve","thirteen","fourteen","fifteen","sixteen"];
        var fieldCount =  field.fields.count;
        if(fieldCount===undefined || fieldCount > 16) fieldCount=2;
        var fieldCountName = field.columCount ||c[fieldCount];
        sb.appendFormat('<div class="{0} fields">',fieldCountName);
        field.fields.forEach(function (it) {
            renderDataField(sb, it);
        });
        sb.appendFormat('</div>');
    };

    var renderDataField = function (sb, field) {
        var fieldID = (field.id || field.model || "field_" + generateRandomID(8)).replace(/\./g, "_");
        if (field.fieldGroup) {
            var groupType = field.groupType || "tabpanel";
            if (groupType == "tabpanel") {
                renderTabContainer(sb, field);
            }
            else if (groupType == "collapse") {
                renderCollapseContainer(sb, fieldID, field);
            }
            else if(groupType =="fieldgroup"){
                renderFieldGroupContainer(sb,fieldID, field);
            }
        }
        else {
            var h = $this.params.horizontal;
            field.type = field.type || "text";
            field.id = "*_*".replace("*", $this.target).replace("*",fieldID);
            sb.appendFormat('<div id="{0}" data-fieldtype="{1}" data-model="{2}" data-initial-value="{3}" class="form-row {4}{5}">',
                field.id,
                field.type,
                rz.widgets.formHelpers.resolveModelName(field, fieldID),
                rz.widgets.formHelpers.getInitialValueData(field),
                (h)? "inline fields":"field",
                (field.wide !==undefined)? " " + field.wide + " wide":""
            );
            var inputID = $this.target + "_" + fieldID + "_" + field.type;
            if(h) sb.appendFormat('<div class="sixteen wide field">');


            sb.appendFormat('<label for="{1}" class="{2}">{0}</label>',
                field.label,
                inputID,
                "control-label"
            );
            rz.widgets.formHelpers.renderDataFieldByType(sb, field, inputID, $this);
            if(h) {
                sb.appendFormat('</div>');
            }
            sb.append('</div>');
        }
    };

    this.fieldCount = function () {
        return $("#" + $this.target + "base_form .form-row").length;
    };

    this.getFieldIdAt = function (position) {
        var p = position;
        if (p >= 0 && p < this.fieldCount()) {
            return $("#" + $this.target + "base_form .form-row").eq(p).attr("id");
        }
        else {
            return undefined;
        }
    };

    this.addField = function (fielddata) {
        var sb = new StringBuilder();
        renderDataField(sb, fielddata);
        $("#" + $this.target + "base_form .form-row").last().parent().append(sb.toString());
    };

    this.insertField = function (fielddata, position) {
        var sb = new StringBuilder();
        renderDataField(sb, fielddata);
        $("#" + $this.target + "base_form .form-row").eq(position).before(sb.toString());
    };

    this.removeFieldAt = function (position) {
        var p = position;
        if (p >= 0 && p < this.fieldCount()) {
            $("#" + $this.target + "base_form .form-row").eq(p).remove();
        }
    };

    this.removeFieldById = function (fieldid) {
        if (!fieldid.startsWith($this.target + "_")) {
            fieldid = $this.target + "_" + fieldid;
        }
        $("#" + fieldid).remove();
    };

    this.getValueAt = function (position) {
        var p = position;
        if (p >= 0 && p < this.fieldCount()) {
            var id = $("#" + $this.target + "base_form .form-row").eq(p).attr("id");
            return rz.widgets.formHelpers.getValueOfField("#" + id);
        }
    };

    this.getValueOf = function (fieldid) {
        if (!fieldid.startsWith($this.target + "_")) {
            fieldid = $this.target + "_" + fieldid;
        }
        return rz.widgets.formHelpers.getValueOfField("#" + fieldid);
    };

    this.getValueOfModel = function (model) {
        var id = $("#" + $this.baseID +  " .field[data-model='"+model+"']").attr("id");
        return $this.renderer.getValueOf(id);
    };

    this.setValueOfModel = function (model,value) {
        var id = $("#" + $this.baseID +  " .field[data-model='"+model+"']").attr("id");
        return $this.renderer.setValueOf(id,value);
    };

    this.setValueAt = function (position, value) {
        var p = position;
        if (p >= 0 && p < this.fieldCount()) {
            var id = $("#" + $this.target + "base_form .form-row").eq(p).attr("id");
            var formerValue = rz.widgets.formHelpers.getValueOfField("#" + id);
            if (formerValue != value) {
                rz.widgets.formHelpers.setValueOfField("#" + id, value);
                rz.widgets.formHelpers.emit("data-changed", {fieldid: id, value: value, src: "code"}, $this.sender);
            }
        }
    };

    this.setValueOf = function (fieldid, value) {
        if (!fieldid.startsWith($this.target + "_")) {
            fieldid = $this.target + "_" + fieldid;
        }
        var formerValue = rz.widgets.formHelpers.getValueOfField("#" + fieldid);
        if (formerValue != value) {
            rz.widgets.formHelpers.setValueOfField("#" + fieldid, value);
            rz.widgets.formHelpers.emit("data-changed", {fieldid: fieldid, value: value, src: "code"}, $this.sender);
        }
    };

    this.getFormData = function () {
        var root = {};
        var rcount = $this.fieldCount();

        function addData(obj, value) {
            var parts = obj.split(".");
            var last = root;
            parts.forEach(function (it, ix) {
                if ((ix == parts.length - 1)) {
                    last[it] = value;
                }
                else {
                    if (last[it] === undefined) {
                        last[it] = {};
                    }
                }
                last = last[it];
            });
        }
        for (var i = 0; i < rcount; i++) {
            var id = $this.getFieldIdAt(i);
            var model = $("#" + id).data("model");
            addData(model, $this.getValueOf(id));
        }
        return root;
    };

    this.clearFormData = function () {
        var rcount = $this.fieldCount();
        for (var i = 0; i < rcount; i++) {
            var id = $this.getFieldIdAt(i);
            var initialValue = $("#" + id).data("initial-value");
            if (initialValue !== undefined && initialValue.toString().match(/^object-data:\[.*]$/) != null) {
                initialValue = initialValue.replace(/^object-data:\[/, "").replace(/]$/, "");
                initialValue = JSON.parse(atob(initialValue));
            }
            $this.setValueAt(i, initialValue);
        }
    };

    /**
     * validates de form data
     * @param {function } validationResultHandler - method invoked after validation
     */
    this.validateForm = function(validationResultHandler){
        rz.widgets.formHelpers.validateFormImpl($this,params,validationResultHandler);
    };

    this.displayValidationReport = function(){
        rz.widgets.formHelpers.displayValidationReportImpl($this);
    };

    initialize();
};