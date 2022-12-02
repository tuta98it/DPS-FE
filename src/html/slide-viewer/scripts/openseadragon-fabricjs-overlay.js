// OpenSeadragon canvas Overlay plugin 0.0.1 based on svg overlay plugin

(function () {
  if (!window.OpenSeadragon) {
    console.error("[openseadragon-canvas-overlay] requires OpenSeadragon");
    return;
  }

  /**
   * @param {Object} options
   *      Allows configurable properties to be entirely specified by passing
   *      an options object to the constructor.
   * @param {Number} options.scale
   *      Fabric 'virtual' canvas size, for creating objects
   **/
  OpenSeadragon.Viewer.prototype.fabricjsOverlay = function (options) {
    this._fabricjsOverlayInfo = new Overlay(this);
    this._fabricjsOverlayInfo._scale = options.scale;
    this._fabricjsOverlayInfo._containerPaddingTop =
      options.containerPaddingTop;
    this._fabricjsOverlayInfo._containerPaddingLeft =
      options.containerPaddingLeft;
    return this._fabricjsOverlayInfo;
  };
  // static counter for multiple overlays differentiation
  var counter = (function () {
    var i = 1;

    return function () {
      return i++;
    };
  })();
  // ----------
  var Overlay = function (viewer) {
    var self = this;

    this._viewer = viewer;

    this._containerWidth = 0;
    this._containerHeight = 0;

    this._canvasdiv = document.createElement("div");
    this._canvasdiv.style.position = "absolute";
    this._canvasdiv.style.left = 0;
    this._canvasdiv.style.top = 0;
    this._canvasdiv.style.width = "100%";
    this._canvasdiv.style.height = "100%";
    this._viewer.canvas.appendChild(this._canvasdiv);

    this._canvas = document.createElement("canvas");

    this._id = "osd-overlaycanvas-" + counter();
    this._canvas.setAttribute("id", this._id);
    this._canvasdiv.appendChild(this._canvas);
    this.resize();
    this._fabricCanvas = new fabric.Canvas(this._canvas);
    // disable fabric selection because default click is tracked by OSD
    this._fabricCanvas.selection = false;
    // prevent OSD click elements on fabric objects
    this._fabricCanvas.on("mouse:down", function (options) {
      if (options.target) {
        options.e.preventDefaultAction = true;
        options.e.preventDefault();
        options.e.stopPropagation();
      }
    });

    this._viewer.addHandler("update-viewport", function () {
      self.resize();
      self.resizecanvas();
    });

    this._viewer.addHandler("open", function () {
      self.resize();
      self.resizecanvas();
    });
  };

  // ----------
  Overlay.prototype = {
    // ----------
    canvas: function () {
      return this._canvas;
    },
    fabricCanvas: function () {
      return this._fabricCanvas;
    },
    // ----------
    clear: function () {
      this._fabricCanvas.clearAll();
    },
    // ----------
    resize: function () {
      if (this._containerWidth !== this._viewer.container.clientWidth) {
        this._containerWidth = this._viewer.container.clientWidth;
        this._canvasdiv.setAttribute("width", this._containerWidth);
        this._canvas.setAttribute("width", this._containerWidth);
      }

      if (this._containerHeight !== this._viewer.container.clientHeight) {
        this._containerHeight = this._viewer.container.clientHeight;
        this._canvasdiv.setAttribute("height", this._containerHeight);
        this._canvas.setAttribute("height", this._containerHeight);
      }
    },
    resizecanvas: function () {
      // console.log("resize");
      var origin = new OpenSeadragon.Point(0, 0);
      var viewportZoom = this._viewer.viewport.getZoom(true);
      this._fabricCanvas.setWidth(this._containerWidth);
      this._fabricCanvas.setHeight(this._containerHeight);
      var zoom =
        (this._viewer.viewport._containerInnerSize.x * viewportZoom) /
        this._scale;
      let oldZoom = this._fabricCanvas.getZoom();
      this._fabricCanvas.setZoom(zoom);
      var viewportWindowPoint = this._viewer.viewport.viewportToWindowCoordinates(
        origin
      );
      // Đoạn này đã bị sửa so với source gốc
      // Tính thêm cả containerPadding trong quá trình resize
      var x = Math.round(viewportWindowPoint.x + this._containerPaddingLeft);
      var y = Math.round(viewportWindowPoint.y + this._containerPaddingTop);
      //x = 0;
      //y = 0;
      var canvasOffset = this._canvasdiv.getBoundingClientRect();

      // console.log(zoom + " " + oldZoom);
      let ratio = zoom / oldZoom;
      let objects = this._fabricCanvas._objects;
      for (let i = 0; i < objects.length; i++) {
        if (objects[i].type === "free-region") {
          //console.log(objects[i]);
          let partial = objects[i]._objects;
          if (partial != null) {
            for (let j = 0; j < partial.length; j++) {
              partial[j].strokeWidth = partial[j].strokeWidth / ratio;
            }
          }

          // Đối tượng annotation label
        } else if (objects[i].type === "text") {
          if (objects[i].forRuler) {
            // console.log("forRuler");
            let obj = objects[i];
            obj.fontSize = objects[i].fontSize / ratio;       
            objects[i].setCoords(objects[i].calcCoords(true));
          } else {
            console.log(objects[i].forRuler);
            objects[i].fontSize = objects[i].fontSize / ratio;
            let obj = objects[i];
            let aCoord = obj.aCoords;

            let w = aCoord.br.x - aCoord.bl.x;
            let h = aCoord.br.y - aCoord.tr.y;

            let g = {
              x: (aCoord.br.x + aCoord.bl.x) / 2,
              y: (aCoord.br.y + aCoord.tr.y) / 2,
            };

            let hor = g.x,
              ver = g.y;
            if (g.x > obj.source.left + obj.source.width) {
              hor = obj.source.left + obj.source.width;
            } else if (g.x < obj.source.left) {
              hor = obj.source.left;
            }
            g.x = hor + (g.x - hor) / ratio;

            if (g.y > obj.source.top + obj.source.height) {
              ver = obj.source.top + obj.source.height;
            } else if (g.y < obj.source.top) {
              ver = obj.source.top;
            }
            g.y = ver + (g.y - ver) / ratio;

            // let dx = Math.abs(g.x - obj.gSource.x) - obj.source.width/2;
            // let dy = Math.abs(g.y - obj.gSource.y) - obj.source.height/2;

            // g.x = g.x + dx / ratio;
            // g.y = g.y + dy / ratio;

            w = w / ratio;
            h = h / ratio;

            obj.top = g.y - h / 2;
            obj.left = g.x - w / 2;

            obj.setCoords(obj.calcCoords(true));
            //let objWidth = aCoord.br - aCoord.
            //objHeight = objects[i].
          }
        } else {
          objects[i].strokeWidth = objects[i].strokeWidth / ratio;
        }
      }
      this._fabricCanvas.freeDrawingBrush.width =
        this._fabricCanvas.freeDrawingBrush.width / ratio;
      this._fabricCanvas.renderAll();

      //console.log(canvasOffset);
      var pageScroll = OpenSeadragon.getPageScroll();
      //console.log(pageScroll);
      let u = new fabric.Point(
        canvasOffset.left - x + pageScroll.x,
        canvasOffset.top - y + pageScroll.y
      );
      //console.log(u);
      this._fabricCanvas.absolutePan(u);
    },
  };

  // Bổ sung thêm các hàm cần thiết cho việc xuất canvas cho fabric.js

  if (!window.fabric) {
    console.error("FabricJS not found!");
    return;
  }

  fabric.Canvas.prototype.viewportTransform = fabric.iMatrix.concat();

  fabric.Canvas.prototype.invertTransform = function (t) {
    var a = 1 / (t[0] * t[3] - t[1] * t[2]),
      r = [a * t[3], -a * t[1], -a * t[2], a * t[0]],
      o = fabric.util.transformPoint({ x: t[4], y: t[5] }, r, true);
    r[4] = -o.x;
    r[5] = -o.y;
    return r;
  };

  fabric.Canvas.prototype.transformPoint = function (p, t, ignoreOffset) {
    if (ignoreOffset) {
      return new fabric.Point(t[0] * p.x + t[2] * p.y, t[1] * p.x + t[3] * p.y);
    }
    return new fabric.Point(
      t[0] * p.x + t[2] * p.y + t[4],
      t[1] * p.x + t[3] * p.y + t[5]
    );
  };

  /**
   * Renders background, objects, overlay and controls.
   * @param {CanvasRenderingContext2D} ctx
   * @param {Array} objects to render
   * @return {fabric.Canvas} instance
   * @chainable
   */
  fabric.Canvas.prototype.renderCanvas = function (ctx, objects) {
    var v = this.viewportTransform,
      path = this.clipPath;
    this.cancelRequestedRender();
    this.calcViewportBoundaries();
    this.clearContext(ctx);
    this.fire("before:render", { ctx: ctx });
    if (this.clipTo) {
      fabric.util.clipContext(this, ctx);
    }
    this._renderBackground(ctx);

    ctx.save();
    //apply viewport transform once for all rendering process
    ctx.transform(v[0], v[1], v[2], v[3], v[4], v[5]);
    this._renderObjects(ctx, objects);
    ctx.restore();
    if (!this.controlsAboveOverlay && this.interactive) {
      this.drawControls(ctx);
    }
    if (this.clipTo) {
      ctx.restore();
    }
    if (path) {
      path.canvas = this;
      // needed to setup a couple of variables
      path.shouldCache();
      path._transformDone = true;
      path.renderCache({ forClipping: true });
      this.drawClipPathOnCanvas(ctx);
    }
    this._renderOverlay(ctx);
    if (this.controlsAboveOverlay && this.interactive) {
      this.drawControls(ctx);
    }
    this.fire("after:render", { ctx: ctx });
  };

  fabric.Canvas.prototype.cancelRequestedRender = function () {
    if (this.isRendering) {
      fabric.util.cancelAnimFrame(this.isRendering);
      this.isRendering = 0;
    }
  };

  /**
   * Clears specified context of canvas element
   * @param {CanvasRenderingContext2D} ctx Context to clear
   * @return {fabric.Canvas} thisArg
   * @chainable
   */
  fabric.Canvas.prototype.clearContext = function (ctx) {
    ctx.clearRect(0, 0, this.width, this.height);
    return this;
  };

  /**
   * @private
   * @param {CanvasRenderingContext2D} ctx Context to render on
   * @param {Array} objects to render
   */
  fabric.Canvas.prototype._renderObjects = function (ctx, objects) {
    var i, len;
    for (i = 0, len = objects.length; i < len; ++i) {
      objects[i] && objects[i].render(ctx);
    }
  };

  fabric.Canvas.prototype.calcViewportBoundaries = function () {
    var points = {},
      width = this.width,
      height = this.height,
      iVpt = this.invertTransform(this.viewportTransform);
    points.tl = this.transformPoint({ x: 0, y: 0 }, iVpt);
    points.br = this.transformPoint({ x: width, y: height }, iVpt);
    points.tr = new fabric.Point(points.br.x, points.tl.y);
    points.bl = new fabric.Point(points.tl.x, points.br.y);
    this.vptCoords = points;
    return points;
  };

  fabric.Canvas.prototype._renderOverlay = function (ctx) {
    this._renderBackgroundOrOverlay(ctx, "overlay");
  };

  /**
   * Hàm xuất fabricjs ra canvas
   * dùng: fabric.fabricCanvas.toCanvasElement()...
   * @param  {[type]} multiplier mức zoom
   * @param  {[type]} cropping   [description]
   * @return {[canvas]}            [description]
   */
  fabric.Canvas.prototype.toCanvasElement = function (multiplier, cropping) {
    multiplier = multiplier || 1;
    cropping = cropping || {};
    var scaledWidth = (cropping.width || this.width) * multiplier,
      scaledHeight = (cropping.height || this.height) * multiplier,
      zoom = this.getZoom(),
      originalWidth = this.width,
      originalHeight = this.height,
      newZoom = zoom * multiplier,
      vp = this.viewportTransform,
      translateX = (vp[4] - (cropping.left || 0)) * multiplier,
      translateY = (vp[5] - (cropping.top || 0)) * multiplier,
      originalInteractive = this.interactive,
      newVp = [newZoom, 0, 0, newZoom, translateX, translateY],
      originalRetina = this.enableRetinaScaling,
      canvasEl = fabric.util.createCanvasElement(),
      originalContextTop = this.contextTop;
    canvasEl.width = scaledWidth;
    canvasEl.height = scaledHeight;
    this.contextTop = null;
    this.enableRetinaScaling = false;
    this.interactive = false;
    this.viewportTransform = newVp;
    this.width = scaledWidth;
    this.height = scaledHeight;
    this.calcViewportBoundaries();
    this.renderCanvas(canvasEl.getContext("2d"), this._objects);
    this.viewportTransform = vp;
    this.width = originalWidth;
    this.height = originalHeight;
    this.calcViewportBoundaries();
    this.interactive = originalInteractive;
    this.enableRetinaScaling = originalRetina;
    this.contextTop = originalContextTop;
    return canvasEl;
  };

  fabric.Canvas.prototype.toCanvasElementNoTransform = function (multiplier, cropping) {
    multiplier = multiplier || 1;
    cropping = cropping || {};
    var scaledWidth = (cropping.width || this.width) * multiplier,
      scaledHeight = (cropping.height || this.height) * multiplier,
      zoom = this.getZoom(),
      originalWidth = this.width,
      originalHeight = this.height,
      newZoom = zoom * multiplier,
      vp = this.viewportTransform,
      translateX = (vp[4] - (cropping.left || 0)) * multiplier,
      translateY = (vp[5] - (cropping.top || 0)) * multiplier,
      originalInteractive = this.interactive,
      newVp = [newZoom, 0, 0, newZoom, translateX, translateY],
      originalRetina = this.enableRetinaScaling,
      canvasEl = fabric.util.createCanvasElement(),
      originalContextTop = this.contextTop;
    canvasEl.width = scaledWidth;
    canvasEl.height = scaledHeight;
    this.contextTop = null;
    this.enableRetinaScaling = false;
    this.interactive = false;
    // this.viewportTransform = newVp;
    this.width = scaledWidth;
    this.height = scaledHeight;
    this.calcViewportBoundaries();
    this.renderCanvas(canvasEl.getContext("2d"), this._objects);
    // this.viewportTransform = vp;
    this.width = originalWidth;
    this.height = originalHeight;
    this.calcViewportBoundaries();
    this.interactive = originalInteractive;
    this.enableRetinaScaling = originalRetina;
    this.contextTop = originalContextTop;
    return canvasEl;
  };

  /**
   * @private
   * @param {CanvasRenderingContext2D} ctx Context to render on
   * @param {string} property 'background' or 'overlay'
   */
  fabric.Canvas.prototype._renderBackgroundOrOverlay = function (
    ctx,
    property
  ) {
    var fill = this[property + "Color"],
      object = this[property + "Image"],
      v = this.viewportTransform,
      needsVpt = this[property + "Vpt"];
    if (!fill && !object) {
      return;
    }
    if (fill) {
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(this.width, 0);
      ctx.lineTo(this.width, this.height);
      ctx.lineTo(0, this.height);
      ctx.closePath();
      ctx.fillStyle = fill.toLive ? fill.toLive(ctx, this) : fill;
      if (needsVpt) {
        ctx.transform(
          v[0],
          v[1],
          v[2],
          v[3],
          v[4] + (fill.offsetX || 0),
          v[5] + (fill.offsetY || 0)
        );
      }
      var m = fill.gradientTransform || fill.patternTransform;
      m && ctx.transform(m[0], m[1], m[2], m[3], m[4], m[5]);
      ctx.fill();
      ctx.restore();
    }
    if (object) {
      ctx.save();
      if (needsVpt) {
        ctx.transform(v[0], v[1], v[2], v[3], v[4], v[5]);
      }
      object.render(ctx);
      ctx.restore();
    }
  };
})();
