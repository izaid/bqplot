/* Copyright 2015 Bloomberg Finance L.P.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

define(["d3", "./Figure", "jupyter-js-widgets", "./Mark", "underscore"],
       function(d3, FigureViewModule, widgets, Mark, _) {
    "use strict";

    var Image = Mark.Mark.extend({

        render: function() {
            var base_render_promise = Image.__super__.render.apply(this);

            this.im = this.el.append("image")
                .attr("xlink:href", this.model.get('src'))
                .attr("x", this.model.get('x'))
                .attr("y", this.model.get('y'))
                .attr("width", this.model.get('width'))
                .attr("height", this.model.get('height'));
//                .attr("preserveAspectRatio", this.model.get('preserve_aspect_ratio'));

//            this.fig_hover = this.fig.append("g");

            this.width = this.parent.plotarea_width;
            this.height = this.parent.plotarea_height;
            this.map_id = widgets.uuid();
            this.display_el_classes = ["event_layer"];
            var that = this;

            this.displayed.then(function() {
//                console.log("displayed.then");

                that.parent.tooltip_div.node().appendChild(that.tooltip_div.node());
                that.create_tooltip();
            });

            return base_render_promise.then(function() {
                that.event_listeners = {};
                that.process_interactions();
                that.create_listeners();
                that.draw();
            });
        },

        set_ranges: function() {
        },

        process_interactions: function() {
            console.log("process_interactions");
            this.event_listeners.mouse_over = this.mouseover_handler;
            this.event_listeners.mouse_move = this.mousemove_handler;
        },

        create_listeners: function() {
            Image.__super__.create_listeners.apply(this);

            this.el.on("mouseover", _.bind(function() { this.event_dispatcher("mouse_over"); }, this));
            this.el.on("mousemove", _.bind(function() { this.event_dispatcher("mouse_move"); }, this));

            this.listenTo(this.model, "change:x", this.update_x, this);
            this.listenTo(this.model, "change:y", this.update_y, this);
            this.listenTo(this.model, "change:width", this.update_width, this);
            this.listenTo(this.model, "change:height", this.update_height, this);
            this.listenTo(this.model, "change:preserve_aspect_ratio", this.update_preserve_aspect_ratio, this);
            this.listenTo(this.model, "change:tooltip", this.create_tooltip, this);
        },

        mouseover_handler: function() {
//            console.log("mouseover");

        },

        mousemove_handler: function() {
            console.log("mousemove");
//            console.dir(e);

            var coordinates = [0, 0];
            coordinates = d3.mouse(this.el.node());
            var x = coordinates[0];
            var y = coordinates[1];

            console.log("x = " + x);
            console.log("y = " + y);

            console.log("tooltip");
//            this.create_tooltip();
            this.show_tooltip();
  //          this.refresh_tooltip(true);

//            this.fig_hover.append("rect")
  //                  .attr("class", "hover_" + id)
    //                .attr("transform", transform)
      //              .attr("x", 0)
        //            .attr("y", 0)
        },

        update_x: function(model, new_x) {
          this.im.attr('x', new_x);
        },

        update_y: function(model, new_y) {
          this.im.attr('y', new_y);
        },

        update_width: function(model, new_width) {
          this.im.attr('width', new_width);
        },

        update_height: function(model, new_height) {
          this.im.attr('height', new_height);
        },

        update_preserve_aspect_ratio: function(model, new_preserve_aspect_ratio) {
          this.im.attr('preserveAspectRatio', new_preserve_aspect_ratio);
        },

        draw: function() {
            this.set_ranges();
        },

//        show_tooltip: function(event, data) {
  //          console.log("showing tooltip");
    //    },

    });

    return {
        Image: Image,
    };
});
