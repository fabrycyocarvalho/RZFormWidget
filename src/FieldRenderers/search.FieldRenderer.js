/**
 * Created by Anderson on 13/01/2016.
 * Input text renderer
 */
rz.widgets.formHelpers.createFieldRenderer("search", {

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

        id = id.substring(0, id.indexOf("_search"));

        if (!id.startsWith('#')) id = "#" + id;

        var result = JSON.parse(atob($(id).data("result")));

        return result;
    },
    setValue: function (id, newValue) {

        id = id.substring(0, id.indexOf("_search"));

        if (!id.startsWith('#')) id = "#" + id;

        var data = (newValue !== undefined && newValue !== null) ? btoa(JSON.stringify(newValue)) : newValue;
        $(id).attr('data-result', data);


        $(id).search('set value', newValue || "");
    },
    bindEvents: function (id, emit, sender) {
    },
    doPosRenderActions: function (id, sender) {

        var fieldParams = rz.widgets.formHelpers.getFieldParams(id.replace("#", ""), sender.renderer.params.fields);

        var settings = fieldParams.settings;

        if (settings == undefined) {
            settings = {};
        } else {
            settings.onSelect = function (item) {
                if (!id.startsWith('#')) id = "#" + id;
                var data = (item !== undefined && item !== null) ? btoa(JSON.stringify(item)) : item;
                $(id).attr('data-result', data);
            };
        }

        $('#' + id).search(settings);
    }
});