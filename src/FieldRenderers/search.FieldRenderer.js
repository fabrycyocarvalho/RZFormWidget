/**
 * Created by Anderson on 13/01/2016.
 * Input text renderer
 */
rz.widgets.formHelpers.createFieldRenderer("search", {

    normalizeID: function (id) {
        return id.startsWith('#') ? id : ("#" + id);
    },

    render: function (sb, field, containerID) {

        var resolveAttributes = function () {
            var attr = field.attributes;
            if (attr === undefined || attr.length <= 0) {
                return "";
            }
            else {
                var ret = " ";
                attr.forEach(function (at) {
                    ret += at.name + '="' + at.value + '" ';
                });
                return ret;
            }
        };

        sb.appendFormat('<div class="ui {1} search" id="{0}" name="{0}">', containerID, field.containerCssClass || "");
        sb.appendFormat('   <div class="ui icon input">');
        sb.appendFormat('       <input class="prompt" type="text" {0}>', resolveAttributes());
        sb.appendFormat('       <i class="search icon"></i>');
        sb.appendFormat('   </div>');
        sb.appendFormat('   <div class="results"></div>');
        sb.appendFormat('</div>');

        return containerID;
    },
    getValue: function (id) {
        //linha provisória para remover esse sufixo quem vem no ID do registro
        id = id.substring(0, id.indexOf("_search"));

        var dataResult = $(this.normalizeID(id)).data("result");
        if(dataResult == undefined){
            return "";
        }

        return JSON.parse(atob(dataResult));
    },
    setValue: function (id, newValue, sender) {

        //linha provisória para remover esse sufixo quem vem no ID do registro
        id = id.substring(0, id.indexOf("_search"));

        var data = (newValue !== undefined && newValue !== null) ? btoa(JSON.stringify(newValue)) : newValue;

        $(this.normalizeID(id)).attr('data-result', data);

        var title;

        if (typeof newValue === 'object') {
            var settings = rz.widgets.formHelpers.getFieldParams(id.replace("#", ""), sender.renderer.params.fields).settings;
            title = newValue[settings.fields.title] || "";
        } else {
            title = newValue || "";
        }
        $(id).search('set value', title);

    },
    bindEvents: function (id, emit, sender) {
    },
    doPosRenderActions: function (id, sender) {
        var $this = this;
        var settings = rz.widgets.formHelpers.getFieldParams(id.replace("#", ""), sender.renderer.params.fields).settings;

        if (settings == undefined) {
            settings = {};
        } else {
            settings.onSelect = function (item) {
                var data = (item !== undefined && item !== null) ? btoa(JSON.stringify(item)) : item;
                $($this.normalizeID(id)).attr('data-result', data);
            };
        }

        $('#' + id).search(settings);
    }
});