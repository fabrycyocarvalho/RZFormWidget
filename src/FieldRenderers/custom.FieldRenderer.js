/**
 * Created by fabricio.reis on 09/08/2016.
 */
rz.widgets.formHelpers.createFieldRenderer("customField", {
    render: function (sb, field, containerID, sender) {

        var renderer = field.renderer;

        if (renderer == undefined) {
            renderer = function (id, s) {
            }
        }

        sb.appendFormat(renderer(containerID, sender));
    },
    bindEvents: function (id, emit, sender) {
    },
    doPosRenderActions: function (id, $this) {
    }

});