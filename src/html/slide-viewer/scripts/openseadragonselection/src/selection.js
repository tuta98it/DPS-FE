
/**
 * Update 16/09/2019
 * Tắt outer tracker khi kéo thả bên ngoài 
 * 
 */

(function($) {
    'use strict';

    if (!$.version || $.version.major < 2) {
        throw new Error('This version of OpenSeadragonSelection requires OpenSeadragon version 2.0.0+');
    }

    $.Viewer.prototype.selection = function(options) {
        if (!this.selectionInstance || options) {
            options = options || {};
            options.viewer = this;
            this.selectionInstance = new $.Selection(options);
        }
        return this.selectionInstance;
    };


    /**
    * @class Selection
    * @classdesc Provides functionality for selecting part of an image
    * @memberof OpenSeadragon
    * @param {Object} options
    */
    $.Selection = function ( options ) {

        $.extend( true, this, {
            // internal state properties
            viewer:                  null,
            isSelecting:             false,
            buttonActiveImg:         false,
            rectDone:                true,

            // options
            element:                 null,
            toggleButton:            null,
            showSelectionControl:    true,
            showConfirmDenyButtons:  true,
            styleConfirmDenyButtons: true,
            returnPixelCoordinates:  true,
            keyboardShortcut:        'c',
            rect:                    null,
            allowRotation:           true,
            startRotated:            false, // useful for rotated crops
            startRotatedHeight:      0.1,
            restrictToImage:         false,
            onSelection:             null,
            onOpen:                  null,
            inputEvent:              null,
            prefixUrl:               null,
            navImages:               {
                selection: {
                    REST:   'selection_rest.png',
                    GROUP:  'selection_grouphover.png',
                    HOVER:  'selection_hover.png',
                    DOWN:   'selection_pressed.png'
                },
                selectionConfirm: {
                    REST:   'selection_confirm_rest.png',
                    GROUP:  'selection_confirm_grouphover.png',
                    HOVER:  'selection_confirm_hover.png',
                    DOWN:   'selection_confirm_pressed.png'
                },
                selectionCancel: {
                    REST:   'selection_cancel_rest.png',
                    GROUP:  'selection_cancel_grouphover.png',
                    HOVER:  'selection_cancel_hover.png',
                    DOWN:   'selection_cancel_pressed.png'
                },
            },
            handleStyle: {
                top:        '50%',
                left:       '50%',
                width:      '6px',
                height:     '6px',
                margin:     '-4px 0 0 -4px',
                background: '#000',
                border:     '1px solid #ccc'
            },
            cornersStyle: {
                width:      '6px',
                height:     '6px',
                background: '#000',
                border:     '1px solid #ccc'
            },
            onCancel: null,
            showButton: true,
            transition: 0,

            /*Self definition by hungdm */
            useConstraint: false,
            constraintWidth: 3,
            constraintHeight: 2

        }, options );

        $.extend( true, this.navImages, this.viewer.navImages );

        if (!this.element) {
            this.element = $.makeNeutralElement('div');
            this.element.style.background = 'rgba(0, 0, 0, 0.1)';
            this.element.className        = 'selection-box';
        }
        this.borders = this.borders || [];
        var handle;
        var corners = [];
        for (var i = 0; i < 4; i++) {
            if (!this.borders[i]) {
                this.borders[i]                  = $.makeNeutralElement('div');
                this.borders[i].className        = 'border-' + i;
                this.borders[i].style.position   = 'absolute';
                this.borders[i].style.width      = '1px';
                this.borders[i].style.height     = '1px';
                this.borders[i].style.background = '#fff';
            }

            handle                  = $.makeNeutralElement('div');
            handle.className        = 'border-' + i + '-handle';
            handle.style.position   = 'absolute';
            handle.style.top        = this.handleStyle.top;
            handle.style.left       = this.handleStyle.left;
            handle.style.width      = this.handleStyle.width;
            handle.style.height     = this.handleStyle.height;
            handle.style.margin     = this.handleStyle.margin;
            handle.style.background = this.handleStyle.background;
            handle.style.border     = this.handleStyle.border;
            new $.MouseTracker({
                element:     this.borders[i],
                dragHandler: onBorderDrag.bind(this, i),
                dragEndHandler: onBorderDragEnd.bind(this, i),
            });

            corners[i]                  = $.makeNeutralElement('canvas');
            corners[i].className        = 'corner-' + i + '-handle';
            corners[i].style.position   = 'absolute';
            corners[i].style.width      = this.cornersStyle.width;
            corners[i].style.height     = this.cornersStyle.height;
            corners[i].style.background = this.cornersStyle.background;
            corners[i].style.border     = this.cornersStyle.border;
            new $.MouseTracker({
                element:     corners[i],
                dragHandler: onBorderDrag.bind(this, i + 0.5),
                dragEndHandler: onBorderDragEnd.bind(this, i),
            });

            this.borders[i].appendChild(handle);
            this.element.appendChild(this.borders[i]);
            // defer corners, so they are appended last
            setTimeout(this.element.appendChild.bind(this.element, corners[i]), 0);
        }
        this.borders[0].style.top = 0;
        this.borders[0].style.width = '100%';
        this.borders[1].style.right = 0;
        this.borders[1].style.height = '100%';
        this.borders[2].style.bottom = 0;
        this.borders[2].style.width = '100%';
        this.borders[3].style.left = 0;
        this.borders[3].style.height = '100%';
        corners[0].style.top = '-3px';
        corners[0].style.left = '-3px';
        corners[1].style.top = '-3px';
        corners[1].style.right = '-3px';
        corners[2].style.bottom = '-3px';
        corners[2].style.right = '-3px';
        corners[3].style.bottom = '-3px';
        corners[3].style.left = '-3px';

        var inputBox = $.makeNeutralElement('div');
        inputBox.style.width = '200px';
        inputBox.style.height = 'auto';
        inputBox.style.background = 'red';
        inputBox.style.marginLeft = 'calc(100% + 10px)';
        inputBox.style.marginTop = '0px';
        inputBox.id = 'keyImageProperties';

        // Tiêu đề ô nhập key image
        var viewer = this.viewer;
        var d1 = document.createElement('div');
        var t = document.createTextNode('Tiêu đề');
        d1.appendChild(t);
        //e.addClass(e, 'label');
        //e.id = 'keyImageTitle';
        inputBox.appendChild(d1);



        var e = document.createElement('input');
        
        e.id = 'keyImageTitle';
        e.setAttribute('type', 'text');
        inputBox.appendChild(e);

        e.addEventListener('click', function() {
            //console.log('focued');
            viewer.selectionInstance.outerTracker.setTracking(false);
            viewer.selectionInstance.innerTracker.setTracking(false);
            viewer.innerTracker.keyHandler = false;
            viewer.innerTracker.setTracking(false);
            viewer.selectionInstance.keyboardShortcut = null;
            e.focus();
        }, true);
        e.addEventListener('blur', function() {
            //console.log('unfocused');
            viewer.selectionInstance.outerTracker.setTracking(true);
            viewer.selectionInstance.innerTracker.setTracking(true);
            viewer.innerTracker.keyHandler = true;
            viewer.innerTracker.setTracking(true);
            viewer.selectionInstance.keyboardShortcut = $.keyboardShortcut;
        }, true);
        e.addEventListener('keydown', this.inputEvent.keydown);

        // Tiêu đề ô ghi chú key images
        var d2 = document.createElement('div');
        t = document.createTextNode('Ghi chú');
        d2.appendChild(t);
        //e.id = 'keyImageNote';
        //e.addClass(e, 'label');
        inputBox.appendChild(d2);

        var f = document.createElement('textarea');
        f.id = 'keyImageNote';
        inputBox.appendChild(f);
        f.rows = '5';

        f.addEventListener('click', function() {
            //console.log('focued');
            viewer.selectionInstance.outerTracker.setTracking(false);
            viewer.selectionInstance.innerTracker.setTracking(false);
            viewer.innerTracker.keyHandler = false;
            viewer.innerTracker.setTracking(false);
            viewer.selectionInstance.keyboardShortcut = null;    
            f.focus();        
        }, true);
        f.addEventListener('blur', function() {
            //console.log('unfocused');
            viewer.selectionInstance.outerTracker.setTracking(true);
            viewer.selectionInstance.innerTracker.setTracking(true);
            viewer.innerTracker.keyHandler = true;
            viewer.innerTracker.setTracking(true);
            viewer.selectionInstance.keyboardShortcut = $.keyboardShortcut;
        }, true);
        f.addEventListener('keydown', this.inputEvent.keydown);

        var $this = this;
        var btnGroup = document.createElement('div');
        btnGroup.className += 'selection-btn-group';
        d1.append(btnGroup);
        d1.className += 'selection-title';

        // nút config
        var config = this.configBtn();
        btnGroup.appendChild(config);

        // nút hủy
        var close = document.createElement('div');
        close.className += 'btn-cancel';
        close.innerHTML = '<i class="fas fa-times"></i>';
        close.onclick = function() {
            $this.cancel();
        };
        btnGroup.appendChild(close);

        // nút confirm
        var confirm = document.createElement('div');
        confirm.className = 'btn-confirm';
        confirm.innerHTML = 'Lưu';
        confirm.onclick = function() {
            $this.confirm();
        };

        inputBox.appendChild(confirm);

        setTimeout(this.element.appendChild.bind(this.element, inputBox), 0);
        //setTimeout(this.element.appendChild.bind(this.element, titleField), 0);

        if (!this.overlay) {
            this.overlay = new $.SelectionOverlay(this.element, this.rect || new $.SelectionRect());
        }

        this.innerTracker = new $.MouseTracker({
            element:            this.element,
            clickTimeThreshold: this.viewer.clickTimeThreshold,
            clickDistThreshold: this.viewer.clickDistThreshold,
            dragHandler:        $.delegate( this, onInsideDrag ),
            dragEndHandler:     $.delegate( this, onInsideDragEnd ),
            // keyHandler:         $.delegate( this, onKeyPress ),
            clickHandler:       $.delegate( this, onClick ),
            // scrollHandler:      $.delegate( this.viewer, this.viewer.innerTracker.scrollHandler ),
            // pinchHandler:       $.delegate( this.viewer, this.viewer.innerTracker.pinchHandler ),
        });

        
        this.outerTracker = new $.MouseTracker({
            element:            this.viewer.canvas,
            clickTimeThreshold: this.viewer.clickTimeThreshold,
            clickDistThreshold: this.viewer.clickDistThreshold,
            dragHandler:        $.delegate( this, onOutsideDrag ),
            dragEndHandler:     $.delegate( this, onOutsideDragEnd ),
            clickHandler:       $.delegate( this, onClick ),
            startDisabled:      !this.isSelecting,
        });
        

        if (this.keyboardShortcut) {
            $.addEvent(
                this.viewer.container,
                'keypress',
                $.delegate(this, onKeyPress),
                false
            );
        }

        var prefix = this.prefixUrl || this.viewer.prefixUrl || '';
        var useGroup = this.viewer.buttons && this.viewer.buttons.buttons;
        var anyButton = useGroup ? this.viewer.buttons.buttons[0] : null;
        var onFocusHandler = anyButton ? anyButton.onFocus : null;
        var onBlurHandler = anyButton ? anyButton.onBlur : null;
        if (this.showSelectionControl) {
            this.toggleButton = new $.Button({
                element:    this.toggleButton ? $.getElement( this.toggleButton ) : null,
                clickTimeThreshold: this.viewer.clickTimeThreshold,
                clickDistThreshold: this.viewer.clickDistThreshold,
                tooltip:    $.getString('Tooltips.SelectionToggle') || 'Toggle selection',
                srcRest:    prefix + this.navImages.selection.REST,
                srcGroup:   prefix + this.navImages.selection.GROUP,
                srcHover:   prefix + this.navImages.selection.HOVER,
                srcDown:    prefix + this.navImages.selection.DOWN,
                onRelease:  this.toggleState.bind( this ),
                onFocus:    onFocusHandler,
                onBlur:     onBlurHandler
            });
            if (useGroup) {
                this.viewer.buttons.buttons.push(this.toggleButton);
                this.viewer.buttons.element.appendChild(this.toggleButton.element);
            }
            if (this.toggleButton.imgDown) {
                this.buttonActiveImg = this.toggleButton.imgDown.cloneNode(true);
                this.toggleButton.element.appendChild(this.buttonActiveImg);
            }
        }
        if (this.showConfirmDenyButtons) {
            this.confirmButton = new $.Button({
                element:    this.confirmButton ? $.getElement( this.confirmButton ) : null,
                clickTimeThreshold: this.viewer.clickTimeThreshold,
                clickDistThreshold: this.viewer.clickDistThreshold,
                tooltip:    $.getString('Tooltips.SelectionConfirm') || 'Confirm selection',
                srcRest:    prefix + this.navImages.selectionConfirm.REST,
                srcGroup:   prefix + this.navImages.selectionConfirm.GROUP,
                srcHover:   prefix + this.navImages.selectionConfirm.HOVER,
                srcDown:    prefix + this.navImages.selectionConfirm.DOWN,
                onRelease:  this.confirm.bind( this ),
                onFocus:    onFocusHandler,
                onBlur:     onBlurHandler
            });
            var confirm = this.confirmButton.element;
            confirm.classList.add('confirm-button');
            confirm.style.display = this.showButton ? '' : 'none';
            this.element.appendChild(confirm);

            this.cancelButton = new $.Button({
                element:    this.cancelButton ? $.getElement( this.cancelButton ) : null,
                clickTimeThreshold: this.viewer.clickTimeThreshold,
                clickDistThreshold: this.viewer.clickDistThreshold,
                tooltip:    $.getString('Tooltips.SelectionCancel') || 'Cancel selection',
                srcRest:    prefix + this.navImages.selectionCancel.REST,
                srcGroup:   prefix + this.navImages.selectionCancel.GROUP,
                srcHover:   prefix + this.navImages.selectionCancel.HOVER,
                srcDown:    prefix + this.navImages.selectionCancel.DOWN,
                onRelease:  this.cancel.bind( this ),
                onFocus:    onFocusHandler,
                onBlur:     onBlurHandler
            });
            var cancel = this.cancelButton.element;
            cancel.classList.add('cancel-button');
            cancel.style.display = this.showButton ? '' : 'none';
            this.element.appendChild(cancel);

            if (this.styleConfirmDenyButtons) {
                confirm.style.position = 'absolute';
                confirm.style.top = '50%';
                confirm.style.left = '50%';
                confirm.style.transform = 'translate(-100%, -50%)';

                cancel.style.position = 'absolute';
                cancel.style.top = '50%';
                cancel.style.left = '50%';
                cancel.style.transform = 'translate(0, -50%)';
            }
        }

        this.viewer.addHandler('selection', this.onSelection);

        this.viewer.addHandler('open', this.draw.bind(this));
        this.viewer.addHandler('animation', this.draw.bind(this));
        this.viewer.addHandler('resize', this.draw.bind(this));
        this.viewer.addHandler('rotate', this.draw.bind(this));
    };

    $.extend( $.Selection.prototype, $.ControlDock.prototype, /** @lends OpenSeadragon.Selection.prototype */{

        toggleState: function() {
            return this.setState(!this.isSelecting);
        },

        setState: function(enabled) {
            this.isSelecting = enabled;
            // this.viewer.innerTracker.setTracking(!enabled);
            this.outerTracker.setTracking(enabled);
            enabled ? this.draw() : this.undraw();
            if (this.buttonActiveImg) {
                this.buttonActiveImg.style.visibility = enabled ? 'visible' : 'hidden';
            }
            this.viewer.raiseEvent('selection_toggle', {enabled: enabled});

            return this;
        },

        setAllowRotation: function(allowRotation) {
            this.allowRotation = allowRotation;
        },

        enable: function() {
            return this.setState(true);
        },

        disable: function() {
            return this.setState(false);
        },

        draw: function() {
            //alert('vẽ nè');
            if (this.rect) {
                this.overlay.update(this.rect.normalize());
                this.overlay.drawHTML(this.viewer.drawer.container, this.viewer.viewport);
            }
            if (this.element && this.element.children[10]) {
                restrictInputBox(this.element, this.element.children[10], this.viewer.viewport.getContainerSize().x, this.viewer.viewport.getContainerSize().y);
            }
            return this;
        },

        undraw: function() {
            jQuery(this.element).animate({opacity: 0/*, width: 0, height: 0*/}, this.transition);
            setTimeout(function(t) {
                t.overlay.destroy();
                jQuery(t.element).css('opacity', 1);
                t.rect = null;
                t.onCancel();
            }, this.transition + 10, this);
            return this;
        },

        confirm: function() {
            if (this.rect) {
                var result = this.rect.normalize();
                if (this.returnPixelCoordinates) {
                    var real = this.viewer.viewport.viewportToImageRectangle(result);
                    real = $.SelectionRect.fromRect(real).round();
                    real.rotation = result.rotation;
                    result = real;
                }
                this.viewer.raiseEvent('selection', result);
                this.undraw();
            }
            //document.getElementById("keyImageNote") = "";
            //document.getElementById("keyImageTitle") = "";
            return this;
        },

        cancel: function() {
            /*
             * These two lines have been added to fix a issue with mobile where the selection is just a pinpoint after the first drag
             * For some reason disabling then re-enabling the tracking fixes this issue.
             */
            this.outerTracker.setTracking(false);
            this.outerTracker.setTracking(true);
            this.viewer.raiseEvent('selection_cancel', false);
            return this.undraw();
        },
    });

    function onOutsideDrag(e) {
        // Disable move when makeing new selection
        if (!this.isSelecting) return;
        this.viewer.setMouseNavEnabled(false);
        var delta = this.viewer.viewport.deltaPointsFromPixels(e.delta, true);
        var end = this.viewer.viewport.pointFromPixel(e.position, true);
        var start = new $.Point(end.x - delta.x, end.y - delta.y);
        if (!this.rect) {
            if (this.restrictToImage) {
                if (!pointIsInImage(this, start)) {
                    return;
                }
                restrictVector(delta, end);
            }
            if (this.startRotated) {
                this.rotatedStartPoint = start;
                this.rect = getPrerotatedRect(start, end, this.startRotatedHeight);
            } else {
                if (!this.useConstraint) {
                    this.rect = new $.SelectionRect(start.x, start.y, delta.x, delta.y);
                } else {
                    this.rect = new $.SelectionRect(start.x, start.y, delta.x, delta.y);
                }
            }
            this.rectDone = false;
        } else {
            
            var oldRect;
            if (this.restrictToImage) {
                oldRect = this.rect.clone();
            }
            if (this.rectDone) {
                // All rotation as needed.
                if (this.allowRotation) {
                    var angle1 = this.rect.getAngleFromCenter(start);
                    var angle2 = this.rect.getAngleFromCenter(end);
                    this.rect.rotation = (this.rect.rotation + angle1 - angle2) % Math.PI;
                } else {
                    this.outerTracker.setTracking(false);
                }
            } else {
                if (this.startRotated) {
                    this.rect = getPrerotatedRect(this.rotatedStartPoint, end, this.startRotatedHeight);
                } else {
                    if (!this.useConstraint) {
                        this.rect.width += delta.x;
                        this.rect.height += delta.y;    
                    }
                    else {
                        this.rect.width += delta.x;
                        this.rect.height = this.rect.width / this.constraintWidth * this.constraintHeight;
                    }
                }
            }
            var bounds = this.viewer.world.getHomeBounds();
            if (this.restrictToImage && !this.rect.fitsIn(new $.Rect(0, 0, bounds.width, bounds.height))) {
                this.rect = oldRect;
            }
        }
        this.draw();
        
    }

    function onOutsideDragEnd() {
        
        // Resizing a selection will function
        // when drawn any direction
        if (this.rect) {
            if (this.rect.width < 0){
                this.rect.x += this.rect.width;
                this.rect.width = Math.abs(this.rect.width);
            }
            if (this.rect.height < 0){
                this.rect.y += this.rect.height;
                this.rect.height = Math.abs(this.rect.height);
            }
        }
        
        // Eable move after new selection is done
        this.viewer.setMouseNavEnabled(true);
        this.rectDone = true;
        
    }

    function onClick() {
        //this.viewer.canvas.focus();
    }

    function restrictInputBox(rect, box, maxX, maxY) {
        var rectTop = parseInt(rect.style.top);
        var rectLeft = parseInt(rect.style.left);
        var rectWidth = parseInt(rect.style.width);
        var rectHeight = parseInt(rect.style.height);

        //var boxTop = parseInt(box.style.top);
        //var boxLeft = parseInt(box.style.left);
        var boxWidth = parseInt(box.style.width);
        var boxHeight = parseInt(box.style.height);

        //console.log(boxWidth);

        // Selection box tràn lên cạnh trên
        if (rectTop < 0) {
            box.style.marginTop = -rectTop + 'px';
        } else if (rectTop + boxHeight >= maxY) {
            //box.style.bottom = '0px';
            box.style.marginTop = maxY - (rectTop + boxHeight) + 'px';
        }

        if (rectLeft + rectWidth + boxWidth + 10 >= maxX) {
            //box.style.left = '';
            //box.style.right = rectWidth + 10 + 'px';
            box.style.marginLeft = -boxWidth - 10 + 'px';
        } else {
            box.style.marginLeft = 'calc(100% + 10px)';
            //box.style.right = '';
        } 
        //inputBox.style.background = 'blue';

    }

    function onInsideDrag(e) {
        $.addClass(this.element, 'dragging');
        var delta = this.viewer.viewport.deltaPointsFromPixels(e.delta, true);
        this.rect.x += delta.x;
        this.rect.y += delta.y;
        var bounds = this.viewer.world.getHomeBounds();
        if (this.restrictToImage && !this.rect.fitsIn(new $.Rect(0, 0, bounds.width, bounds.height))) {
            this.rect.x -= delta.x;
            this.rect.y -= delta.y;
        }
        
        
        this.draw();
        //console.log(this.element.inputBox);
        //console.log(this);
    }

    function onInsideDragEnd() {
        $.removeClass(this.element, 'dragging');
    }

    function onBorderDrag(border, e) {
        //console.log('a');
        var delta = e.delta;
        var rotation = this.rect.getDegreeRotation();
        var center;
        var oldRect = this.restrictToImage ? this.rect.clone() : null;
        if (rotation !== 0) {
            // adjust vector
            delta = delta.rotate(-1 * rotation, new $.Point(0, 0));
            center = this.rect.getCenter();
        }
        delta = this.viewer.viewport.deltaPointsFromPixels(delta, true);
        switch (border) {
            case 0:
                if (!this.useConstraint) {
                    this.rect.y += delta.y;
                    this.rect.height -= delta.y;
                    break;
                }
                else {
                    this.rect.y += delta.y;
                    this.rect.height -= delta.y;

                    var end = this.rect.x + this.rect.width;
                    this.rect.width = this.rect.height / this.constraintHeight * this.constraintWidth;
                    this.rect.x = end - this.rect.width;
                    break; 
                }
            case 1:
                if (!this.useConstraint) {
                    this.rect.width += delta.x;
                    break;
                }
                else {
                    this.rect.width += delta.x;

                    this.rect.height = this.rect.width / this.constraintWidth * this.constraintHeight;
                    break; 
                }
            case 2:
                if (!this.useConstraint) {
                    this.rect.height += delta.y;
                    break;
                }
                else {
                    this.rect.height += delta.y;
                    this.rect.width = this.rect.height / this.constraintHeight * this.constraintWidth;
                    break; 
                }
            case 3:
                if (!this.useConstraint) {
                    this.rect.x += delta.x;
                    this.rect.width -= delta.x;
                    break;
                }
                else {
                    this.rect.x += delta.x;
                    this.rect.width -= delta.x;

                    var end = this.rect.y + this.rect.height;
                    this.rect.height = this.rect.width / this.constraintWidth * this.constraintHeight;
                    this.rect.y = end - this.rect.height;
                    break; 
                }
            case 0.5:
                if (!this.useConstraint) {
                    this.rect.y += delta.y;
                    this.rect.height -= delta.y;
                    this.rect.x += delta.x;
                    this.rect.width -= delta.x;
                    break;
                } else {
                    this.rect.y += delta.y;
                    this.rect.height -= delta.y;

                    var end = this.rect.x + this.rect.width;
                    this.rect.width = this.rect.height / this.constraintHeight * this.constraintWidth;
                    this.rect.x = end - this.rect.width;
                    break; 
                }
            case 1.5:
                if (!this.useConstraint) {
                    this.rect.y += delta.y;
                    this.rect.height -= delta.y;
                    this.rect.width += delta.x;
                    break;
                } else {
                    this.rect.y += delta.y;
                    this.rect.height -= delta.y;

                    this.rect.width = this.rect.height / this.constraintHeight * this.constraintWidth;
                    //alert(1.5);
                    break;
                }
            case 2.5:
                if (!this.useConstraint) {
                    this.rect.width += delta.x;
                    this.rect.height += delta.y;
                    break;
                } else {
                    // console.log(delta.y);
                    this.rect.height += delta.y;
                    this.rect.width = this.rect.height / this.constraintHeight * this.constraintWidth;
                    //alert(2.5);
                    break;
                }
            case 3.5:
                if (!this.useConstraint) {
                    this.rect.height += delta.y;
                    this.rect.x += delta.x;
                    this.rect.width -= delta.x;
                    break;
                } else {
                    this.rect.height += delta.y;

                    var end = this.rect.x + this.rect.width;
                    this.rect.width = this.rect.height / this.constraintHeight * this.constraintWidth;
                    this.rect.x = end - this.rect.width;
                    break;
                }
        }
        if (rotation !== 0) {
            // calc center deviation
            var newCenter = this.rect.getCenter();
            // rotate new center around old
            var target = newCenter.rotate(rotation, center);
            // adjust new center
            delta = target.minus(newCenter);
            this.rect.x += delta.x;
            this.rect.y += delta.y;
        }
        var bounds = this.viewer.world.getHomeBounds();
        if (this.restrictToImage && !this.rect.fitsIn(new $.Rect(0, 0, bounds.width, bounds.height))) {
            this.rect = oldRect;
        }
        this.draw();
    }
    
    // After you have completed dragging, ensure the top left of the selection
    // box is still the top left corner of the box
    function onBorderDragEnd(){
        if (this.rect.width < 0){
            this.rect.x += this.rect.width;
            this.rect.width = Math.abs(this.rect.width);
        }
        if (this.rect.height < 0){
            this.rect.y += this.rect.height;
            this.rect.height = Math.abs(this.rect.height);
        }
    }

    function onKeyPress(e) {
        var key = e.keyCode ? e.keyCode : e.charCode;
        if (key === 13) {
            this.confirm();
        } else if (String.fromCharCode(key) === this.keyboardShortcut) {
            this.toggleState();
        }
    }

    function getPrerotatedRect(start, end, height) {
        if (start.x > end.x) {
            // always draw left to right
            var x = start;
            start = end;
            end = x;
        }
        var delta = end.minus(start);
        var dist = start.distanceTo(end);
        var angle = -1 * Math.atan2(delta.x, delta.y) + (Math.PI / 2);
        var center = new $.Point(
            delta.x / 2 + start.x,
            delta.y / 2 + start.y
        );
        var rect = new $.SelectionRect(
            center.x - (dist / 2),
            center.y - (height / 2),
            dist,
            height,
            angle
        );
        var heightModDelta = new $.Point(0, height);
        heightModDelta = heightModDelta.rotate(rect.getDegreeRotation(), new $.Point(0, 0));
        rect.x += heightModDelta.x / 2;
        rect.y += heightModDelta.y / 2;
        return rect;
    }

    function pointIsInImage(self, point) {
        var bounds = self.viewer.world.getHomeBounds();
        return point.x >= 0 && point.x <= bounds.width && point.y >= 0 && point.y <= bounds.height;
    }

    function restrictVector(delta, end) {
        var start;
        for (var prop in {x: 0, y: 0}) {
            start = end[prop] - delta[prop];
            if (start < 1 && start > 0) {
                if (end[prop] > 1) {
                    delta[prop] -= end[prop] - 1;
                    end[prop] = 1;
                } else if (end[prop] < 0) {
                    delta[prop] -= end[prop];
                    end[prop] = 0;
                }
            }
        }
    }

})(OpenSeadragon);
