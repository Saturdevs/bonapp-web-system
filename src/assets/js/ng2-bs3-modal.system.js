var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
System.register("modal/models/modal-hide-type", [], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var BsModalHideType;
    return {
        setters: [],
        execute: function () {
            (function (BsModalHideType) {
                BsModalHideType[BsModalHideType["Close"] = 0] = "Close";
                BsModalHideType[BsModalHideType["Dismiss"] = 1] = "Dismiss";
                BsModalHideType[BsModalHideType["Backdrop"] = 2] = "Backdrop";
                BsModalHideType[BsModalHideType["Keyboard"] = 3] = "Keyboard";
                BsModalHideType[BsModalHideType["RouteChange"] = 4] = "RouteChange";
                BsModalHideType[BsModalHideType["Destroy"] = 5] = "Destroy";
            })(BsModalHideType || (BsModalHideType = {}));
            exports_1("BsModalHideType", BsModalHideType);
        }
    };
});
System.register("modal/models/modal-hide-event", [], function (exports_2, context_2) {
    "use strict";
    var __moduleName = context_2 && context_2.id;
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("modal/models/modal-options", [], function (exports_3, context_3) {
    "use strict";
    var __moduleName = context_3 && context_3.id;
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("modal/models/modal-size", [], function (exports_4, context_4) {
    "use strict";
    var __moduleName = context_4 && context_4.id;
    var BsModalSize;
    return {
        setters: [],
        execute: function () {
            BsModalSize = (function () {
                function BsModalSize() {
                }
                BsModalSize.isValidSize = function (size) {
                    return size && (size === BsModalSize.Small || size === BsModalSize.Large);
                };
                return BsModalSize;
            }());
            BsModalSize.Small = 'sm';
            BsModalSize.Large = 'lg';
            exports_4("BsModalSize", BsModalSize);
        }
    };
});
System.register("modal/models", ["modal/models/modal-hide-type", "modal/models/modal-size"], function (exports_5, context_5) {
    "use strict";
    var __moduleName = context_5 && context_5.id;
    return {
        setters: [
            function (modal_hide_type_1_1) {
                exports_5({
                    "BsModalHideType": modal_hide_type_1_1["BsModalHideType"]
                });
            },
            function (modal_size_1_1) {
                exports_5({
                    "BsModalSize": modal_size_1_1["BsModalSize"]
                });
            }
        ],
        execute: function () {
        }
    };
});
System.register("modal/modal", ["@angular/core", "rxjs/Observable", "rxjs/Subject", "rxjs/add/observable/fromEvent", "rxjs/add/observable/merge", "rxjs/add/observable/of", "rxjs/add/observable/zip", "rxjs/add/operator/do", "rxjs/add/operator/filter", "rxjs/add/operator/map", "rxjs/add/operator/share", "rxjs/add/operator/take", "rxjs/add/operator/toPromise", "modal/models", "modal/modal-service"], function (exports_6, context_6) {
    "use strict";
    var __moduleName = context_6 && context_6.id;
    var core_1, Observable_1, Subject_1, models_1, modal_service_1, EVENT_SUFFIX, SHOW_EVENT_NAME, SHOWN_EVENT_NAME, HIDE_EVENT_NAME, HIDDEN_EVENT_NAME, LOADED_EVENT_NAME, DATA_KEY, BsModalComponent;
    return {
        setters: [
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (Observable_1_1) {
                Observable_1 = Observable_1_1;
            },
            function (Subject_1_1) {
                Subject_1 = Subject_1_1;
            },
            function (_1) {
            },
            function (_2) {
            },
            function (_3) {
            },
            function (_4) {
            },
            function (_5) {
            },
            function (_6) {
            },
            function (_7) {
            },
            function (_8) {
            },
            function (_9) {
            },
            function (_10) {
            },
            function (models_1_1) {
                models_1 = models_1_1;
            },
            function (modal_service_1_1) {
                modal_service_1 = modal_service_1_1;
            }
        ],
        execute: function () {
            EVENT_SUFFIX = 'ng2-bs3-modal';
            SHOW_EVENT_NAME = "show.bs.modal." + EVENT_SUFFIX;
            SHOWN_EVENT_NAME = "shown.bs.modal." + EVENT_SUFFIX;
            HIDE_EVENT_NAME = "hide.bs.modal." + EVENT_SUFFIX;
            HIDDEN_EVENT_NAME = "hidden.bs.modal." + EVENT_SUFFIX;
            LOADED_EVENT_NAME = "loaded.bs.modal." + EVENT_SUFFIX;
            DATA_KEY = 'bs.modal';
            BsModalComponent = (function () {
                function BsModalComponent(element, service, zone) {
                    var _this = this;
                    this.element = element;
                    this.service = service;
                    this.zone = zone;
                    this.overrideSize = null;
                    this.onInternalClose$ = new Subject_1.Subject();
                    this.subscriptions = [];
                    this.visible = false;
                    this.animation = true;
                    this.backdrop = true;
                    this.keyboard = true;
                    this.onShow = new core_1.EventEmitter();
                    this.onOpen = new core_1.EventEmitter();
                    this.onHide = new core_1.EventEmitter();
                    this.onClose = new core_1.EventEmitter();
                    this.onDismiss = new core_1.EventEmitter();
                    this.onLoaded = new core_1.EventEmitter();
                    this.setVisible = function (isVisible) {
                        return function () {
                            _this.visible = isVisible;
                        };
                    };
                    this.setOptions = function (options) {
                        var backdrop = options.backdrop;
                        if (typeof backdrop === 'string' && backdrop !== 'static')
                            backdrop = true;
                        if (options.backdrop !== undefined)
                            _this.options.backdrop = backdrop;
                        if (options.keyboard !== undefined)
                            _this.options.keyboard = options.keyboard;
                    };
                    this.service.add(this);
                    this.init();
                }
                Object.defineProperty(BsModalComponent.prototype, "options", {
                    get: function () {
                        if (!this.$modal)
                            this.init();
                        return this.$modal.data(DATA_KEY).options;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(BsModalComponent.prototype, "fadeClass", {
                    get: function () { return this.animation; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(BsModalComponent.prototype, "modalClass", {
                    get: function () { return true; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(BsModalComponent.prototype, "roleAttr", {
                    get: function () { return 'dialog'; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(BsModalComponent.prototype, "tabindexAttr", {
                    get: function () { return '-1'; },
                    enumerable: true,
                    configurable: true
                });
                BsModalComponent.prototype.ngOnInit = function () {
                    this.wireUpEventEmitters();
                };
                BsModalComponent.prototype.ngAfterViewInit = function () {
                    this.$dialog = this.$modal.find('.modal-dialog');
                };
                BsModalComponent.prototype.ngOnChanges = function () {
                    this.setOptions({
                        backdrop: this.backdrop,
                        keyboard: this.keyboard
                    });
                };
                BsModalComponent.prototype.ngOnDestroy = function () {
                    this.onInternalClose$.next(models_1.BsModalHideType.Destroy);
                    return this.destroy();
                };
                BsModalComponent.prototype.triggerTransitionEnd = function () {
                    this.$dialog.trigger('transitionend');
                };
                BsModalComponent.prototype.focus = function () {
                    this.$modal.trigger('focus');
                };
                BsModalComponent.prototype.routerCanDeactivate = function () {
                    this.onInternalClose$.next(models_1.BsModalHideType.RouteChange);
                    return this.destroy();
                };
                BsModalComponent.prototype.open = function (size) {
                    this.overrideSize = null;
                    if (models_1.BsModalSize.isValidSize(size))
                        this.overrideSize = size;
                    return this.show().toPromise();
                };
                BsModalComponent.prototype.close = function (value) {
                    var _this = this;
                    this.onInternalClose$.next(models_1.BsModalHideType.Close);
                    return this.hide()
                        .do(function () { return _this.onClose.emit(value); })
                        .toPromise()
                        .then(function () { return value; });
                };
                BsModalComponent.prototype.dismiss = function () {
                    this.onInternalClose$.next(models_1.BsModalHideType.Dismiss);
                    return this.hide().toPromise();
                };
                BsModalComponent.prototype.getCssClasses = function () {
                    var classes = [];
                    if (this.isSmall()) {
                        classes.push('modal-sm');
                    }
                    if (this.isLarge()) {
                        classes.push('modal-lg');
                    }
                    if (this.cssClass) {
                        classes.push(this.cssClass);
                    }
                    return classes.join(' ');
                };
                BsModalComponent.prototype.isSmall = function () {
                    return this.overrideSize !== models_1.BsModalSize.Large
                        && this.size === models_1.BsModalSize.Small
                        || this.overrideSize === models_1.BsModalSize.Small;
                };
                BsModalComponent.prototype.isLarge = function () {
                    return this.overrideSize !== models_1.BsModalSize.Small
                        && this.size === models_1.BsModalSize.Large
                        || this.overrideSize === models_1.BsModalSize.Large;
                };
                BsModalComponent.prototype.show = function () {
                    var _this = this;
                    if (this.visible)
                        return Observable_1.Observable.of(null);
                    return Observable_1.Observable.create(function (o) {
                        _this.onShown$.take(1).subscribe(function (next) {
                            o.next(next);
                            o.complete();
                        });
                        _this.transitionFix();
                        _this.$modal.modal('show');
                    });
                };
                BsModalComponent.prototype.transitionFix = function () {
                    var _this = this;
                    // Fix for shown.bs.modal not firing when .fade is present
                    // https://github.com/twbs/bootstrap/issues/11793
                    if (this.animation) {
                        this.$dialog.one('transitionend', function () {
                            _this.$modal.trigger('focus').trigger(SHOWN_EVENT_NAME);
                        });
                    }
                };
                BsModalComponent.prototype.hide = function () {
                    var _this = this;
                    if (!this.visible)
                        return Observable_1.Observable.of(null);
                    return Observable_1.Observable.create(function (o) {
                        _this.onHidden$.take(1).subscribe(function (next) {
                            o.next(next);
                            o.complete();
                        });
                        _this.$modal.modal('hide');
                    });
                };
                BsModalComponent.prototype.init = function () {
                    var _this = this;
                    this.$modal = jQuery(this.element.nativeElement);
                    this.$modal.appendTo(document.body);
                    this.$modal.modal({
                        show: false
                    });
                    this.onShowEvent$ = Observable_1.Observable.fromEvent(this.$modal, SHOW_EVENT_NAME);
                    this.onShownEvent$ = Observable_1.Observable.fromEvent(this.$modal, SHOWN_EVENT_NAME);
                    this.onHideEvent$ = Observable_1.Observable.fromEvent(this.$modal, HIDE_EVENT_NAME);
                    this.onHiddenEvent$ = Observable_1.Observable.fromEvent(this.$modal, HIDDEN_EVENT_NAME);
                    this.onLoadedEvent$ = Observable_1.Observable.fromEvent(this.$modal, LOADED_EVENT_NAME);
                    var onClose$ = Observable_1.Observable
                        .merge(this.onInternalClose$, this.service.onBackdropClose$, this.service.onKeyboardClose$)
                        .filter(function () { return _this.visible; });
                    this.onHide$ = Observable_1.Observable.zip(this.onHideEvent$, onClose$)
                        .map(function (x) { return ({ event: x[0], type: x[1] }); });
                    this.onHidden$ = Observable_1.Observable.zip(this.onHiddenEvent$, onClose$)
                        .map(function (x) { return x[1]; })
                        .do(this.setVisible(false))
                        .do(function () { return _this.service.focusNext(); })
                        .share();
                    this.onShown$ = this.onShownEvent$
                        .do(this.setVisible(true))
                        .share();
                    this.onDismiss$ = this.onHidden$
                        .filter(function (x) { return x !== models_1.BsModalHideType.Close; });
                    // Start watching for events
                    (_a = this.subscriptions).push.apply(_a, [
                        this.onShown$.subscribe(function () { }),
                        this.onHidden$.subscribe(function () { }),
                        this.service.onModalStack$.subscribe(function () { })
                    ]);
                    var _a;
                };
                BsModalComponent.prototype.wireUpEventEmitters = function () {
                    this.wireUpEventEmitter(this.onShow, this.onShowEvent$);
                    this.wireUpEventEmitter(this.onOpen, this.onShown$);
                    this.wireUpEventEmitter(this.onHide, this.onHide$);
                    this.wireUpEventEmitter(this.onDismiss, this.onDismiss$);
                    this.wireUpEventEmitter(this.onLoaded, this.onLoadedEvent$);
                };
                BsModalComponent.prototype.wireUpEventEmitter = function (emitter, stream$) {
                    var _this = this;
                    if (emitter.observers.length === 0)
                        return;
                    var sub = stream$.subscribe(function (next) {
                        _this.zone.run(function () {
                            emitter.next(next);
                        });
                    });
                    this.subscriptions.push(sub);
                };
                BsModalComponent.prototype.destroy = function () {
                    var _this = this;
                    return this.hide().do(function () {
                        _this.service.remove(_this);
                        _this.subscriptions.forEach(function (s) { return s.unsubscribe(); });
                        _this.subscriptions = [];
                        if (_this.$modal) {
                            _this.$modal.data(DATA_KEY, null);
                            _this.$modal.remove();
                            _this.$modal = null;
                        }
                    }).toPromise();
                };
                return BsModalComponent;
            }());
            __decorate([
                core_1.Input(),
                __metadata("design:type", Object)
            ], BsModalComponent.prototype, "animation", void 0);
            __decorate([
                core_1.Input(),
                __metadata("design:type", Object)
            ], BsModalComponent.prototype, "backdrop", void 0);
            __decorate([
                core_1.Input(),
                __metadata("design:type", Object)
            ], BsModalComponent.prototype, "keyboard", void 0);
            __decorate([
                core_1.Input(),
                __metadata("design:type", String)
            ], BsModalComponent.prototype, "size", void 0);
            __decorate([
                core_1.Input(),
                __metadata("design:type", String)
            ], BsModalComponent.prototype, "cssClass", void 0);
            __decorate([
                core_1.Output(),
                __metadata("design:type", core_1.EventEmitter)
            ], BsModalComponent.prototype, "onShow", void 0);
            __decorate([
                core_1.Output(),
                __metadata("design:type", core_1.EventEmitter)
            ], BsModalComponent.prototype, "onOpen", void 0);
            __decorate([
                core_1.Output(),
                __metadata("design:type", core_1.EventEmitter)
            ], BsModalComponent.prototype, "onHide", void 0);
            __decorate([
                core_1.Output(),
                __metadata("design:type", core_1.EventEmitter)
            ], BsModalComponent.prototype, "onClose", void 0);
            __decorate([
                core_1.Output(),
                __metadata("design:type", core_1.EventEmitter)
            ], BsModalComponent.prototype, "onDismiss", void 0);
            __decorate([
                core_1.Output(),
                __metadata("design:type", core_1.EventEmitter)
            ], BsModalComponent.prototype, "onLoaded", void 0);
            __decorate([
                core_1.HostBinding('class.fade'),
                __metadata("design:type", Object),
                __metadata("design:paramtypes", [])
            ], BsModalComponent.prototype, "fadeClass", null);
            __decorate([
                core_1.HostBinding('class.modal'),
                __metadata("design:type", Object),
                __metadata("design:paramtypes", [])
            ], BsModalComponent.prototype, "modalClass", null);
            __decorate([
                core_1.HostBinding('attr.role'),
                __metadata("design:type", Object),
                __metadata("design:paramtypes", [])
            ], BsModalComponent.prototype, "roleAttr", null);
            __decorate([
                core_1.HostBinding('attr.tabindex'),
                __metadata("design:type", Object),
                __metadata("design:paramtypes", [])
            ], BsModalComponent.prototype, "tabindexAttr", null);
            BsModalComponent = __decorate([
                core_1.Component({
                    selector: 'bs-modal',
                    template: "\n        <div class=\"modal-dialog\" [ngClass]=\"getCssClasses()\">\n            <div class=\"modal-content\">\n                <ng-content></ng-content>\n            </div>\n        </div>\n    "
                }),
                __metadata("design:paramtypes", [core_1.ElementRef, modal_service_1.BsModalService, core_1.NgZone])
            ], BsModalComponent);
            exports_6("BsModalComponent", BsModalComponent);
        }
    };
});
System.register("modal/modal-service", ["@angular/core", "rxjs/Observable", "rxjs/add/observable/fromEvent", "rxjs/add/operator/filter", "modal/models"], function (exports_7, context_7) {
    "use strict";
    var __moduleName = context_7 && context_7.id;
    var core_2, Observable_2, models_2, EVENT_SUFFIX, KEYUP_EVENT_NAME, CLICK_EVENT_NAME, SHOW_EVENT_NAME, BsModalService;
    return {
        setters: [
            function (core_2_1) {
                core_2 = core_2_1;
            },
            function (Observable_2_1) {
                Observable_2 = Observable_2_1;
            },
            function (_11) {
            },
            function (_12) {
            },
            function (models_2_1) {
                models_2 = models_2_1;
            }
        ],
        execute: function () {
            EVENT_SUFFIX = 'ng2-bs3-modal';
            KEYUP_EVENT_NAME = "keyup." + EVENT_SUFFIX;
            CLICK_EVENT_NAME = "click." + EVENT_SUFFIX;
            SHOW_EVENT_NAME = "show.bs.modal." + EVENT_SUFFIX;
            BsModalService = (function () {
                function BsModalService() {
                    var _this = this;
                    this.modals = [];
                    this.$body = jQuery(document.body);
                    this.onBackdropClose$ = Observable_2.Observable.fromEvent(this.$body, CLICK_EVENT_NAME)
                        .filter(function (e) { return jQuery(e.target).is('.modal'); })
                        .map(function () { return models_2.BsModalHideType.Backdrop; })
                        .share();
                    this.onKeyboardClose$ = Observable_2.Observable.fromEvent(this.$body, KEYUP_EVENT_NAME)
                        .filter(function (e) { return e.which === 27; })
                        .map(function () { return models_2.BsModalHideType.Keyboard; })
                        .share();
                    this.onModalStack$ = Observable_2.Observable.fromEvent(this.$body, SHOW_EVENT_NAME)
                        .do(function () {
                        var zIndex = 1040 + (10 * $('.modal:visible').length);
                        $(_this).css('z-index', zIndex);
                        setTimeout(function () {
                            $('.modal-backdrop').not('.modal-stack').css('z-index', zIndex - 1).addClass('modal-stack');
                        }, 0);
                    })
                        .share();
                }
                BsModalService.prototype.add = function (modal) {
                    this.modals.push(modal);
                };
                BsModalService.prototype.remove = function (modal) {
                    var index = this.modals.indexOf(modal);
                    if (index > -1)
                        this.modals.splice(index, 1);
                };
                BsModalService.prototype.focusNext = function () {
                    var visible = this.modals.filter(function (m) { return m.visible; });
                    if (visible.length) {
                        this.$body.addClass('modal-open');
                        visible[visible.length - 1].focus();
                    }
                };
                BsModalService.prototype.dismissAll = function () {
                    return Promise.all(this.modals.map(function (m) {
                        return m.dismiss();
                    }));
                };
                return BsModalService;
            }());
            BsModalService = __decorate([
                core_2.Injectable(),
                __metadata("design:paramtypes", [])
            ], BsModalService);
            exports_7("BsModalService", BsModalService);
        }
    };
});
System.register("modal/modal-header", ["@angular/core", "modal/modal"], function (exports_8, context_8) {
    "use strict";
    var __moduleName = context_8 && context_8.id;
    var core_3, modal_1, BsModalHeaderComponent;
    return {
        setters: [
            function (core_3_1) {
                core_3 = core_3_1;
            },
            function (modal_1_1) {
                modal_1 = modal_1_1;
            }
        ],
        execute: function () {
            BsModalHeaderComponent = (function () {
                function BsModalHeaderComponent(modal) {
                    this.modal = modal;
                    this.showDismiss = false;
                }
                return BsModalHeaderComponent;
            }());
            __decorate([
                core_3.Input(),
                __metadata("design:type", Object)
            ], BsModalHeaderComponent.prototype, "showDismiss", void 0);
            BsModalHeaderComponent = __decorate([
                core_3.Component({
                    selector: 'bs-modal-header',
                    template: "\n        <div class=\"modal-header\">\n            <button *ngIf=\"showDismiss\" type=\"button\" class=\"close\" aria-label=\"Dismiss\" (click)=\"modal.dismiss()\">\n                <span aria-hidden=\"true\">&times;</span>\n            </button>\n            <ng-content></ng-content>\n        </div>\n    "
                }),
                __metadata("design:paramtypes", [modal_1.BsModalComponent])
            ], BsModalHeaderComponent);
            exports_8("BsModalHeaderComponent", BsModalHeaderComponent);
        }
    };
});
System.register("modal/modal-body", ["@angular/core"], function (exports_9, context_9) {
    "use strict";
    var __moduleName = context_9 && context_9.id;
    var core_4, BsModalBodyComponent;
    return {
        setters: [
            function (core_4_1) {
                core_4 = core_4_1;
            }
        ],
        execute: function () {
            BsModalBodyComponent = (function () {
                function BsModalBodyComponent() {
                }
                return BsModalBodyComponent;
            }());
            BsModalBodyComponent = __decorate([
                core_4.Component({
                    selector: 'bs-modal-body',
                    template: "\n        <div class=\"modal-body\">\n            <ng-content></ng-content>\n        </div>\n    "
                })
            ], BsModalBodyComponent);
            exports_9("BsModalBodyComponent", BsModalBodyComponent);
        }
    };
});
System.register("modal/modal-footer", ["@angular/core", "modal/modal"], function (exports_10, context_10) {
    "use strict";
    var __moduleName = context_10 && context_10.id;
    var core_5, modal_2, BsModalFooterComponent;
    return {
        setters: [
            function (core_5_1) {
                core_5 = core_5_1;
            },
            function (modal_2_1) {
                modal_2 = modal_2_1;
            }
        ],
        execute: function () {
            BsModalFooterComponent = (function () {
                function BsModalFooterComponent(modal) {
                    this.modal = modal;
                    this.showDefaultButtons = false;
                    this.dismissButtonLabel = 'Dismiss';
                    this.closeButtonLabel = 'Close';
                }
                return BsModalFooterComponent;
            }());
            __decorate([
                core_5.Input(),
                __metadata("design:type", Object)
            ], BsModalFooterComponent.prototype, "showDefaultButtons", void 0);
            __decorate([
                core_5.Input(),
                __metadata("design:type", Object)
            ], BsModalFooterComponent.prototype, "dismissButtonLabel", void 0);
            __decorate([
                core_5.Input(),
                __metadata("design:type", Object)
            ], BsModalFooterComponent.prototype, "closeButtonLabel", void 0);
            BsModalFooterComponent = __decorate([
                core_5.Component({
                    selector: 'bs-modal-footer',
                    template: "\n        <div class=\"modal-footer\">\n            <ng-content></ng-content>\n            <button *ngIf=\"showDefaultButtons\" type=\"button\" class=\"btn btn-default\" (click)=\"modal.dismiss()\">\n                {{dismissButtonLabel}}\n            </button>\n            <button *ngIf=\"showDefaultButtons\" type=\"button\" class=\"btn btn-primary\" (click)=\"modal.close()\">\n                {{closeButtonLabel}}\n              </button>\n        </div>\n    "
                }),
                __metadata("design:paramtypes", [modal_2.BsModalComponent])
            ], BsModalFooterComponent);
            exports_10("BsModalFooterComponent", BsModalFooterComponent);
        }
    };
});
System.register("autofocus/autofocus", ["@angular/core", "modal/modal"], function (exports_11, context_11) {
    "use strict";
    var __moduleName = context_11 && context_11.id;
    var core_6, modal_3, BsAutofocusDirective;
    return {
        setters: [
            function (core_6_1) {
                core_6 = core_6_1;
            },
            function (modal_3_1) {
                modal_3 = modal_3_1;
            }
        ],
        execute: function () {
            BsAutofocusDirective = (function () {
                function BsAutofocusDirective(el, modal) {
                    var _this = this;
                    this.el = el;
                    this.modal = modal;
                    if (modal) {
                        this.modal.onOpen.subscribe(function () {
                            _this.el.nativeElement.focus();
                        });
                    }
                }
                return BsAutofocusDirective;
            }());
            BsAutofocusDirective = __decorate([
                core_6.Directive({
                    selector: '[autofocus]'
                }),
                __param(1, core_6.Optional()),
                __metadata("design:paramtypes", [core_6.ElementRef, modal_3.BsModalComponent])
            ], BsAutofocusDirective);
            exports_11("BsAutofocusDirective", BsAutofocusDirective);
        }
    };
});
System.register("ng2-bs3-modal", ["@angular/core", "@angular/common", "modal/modal-service", "modal/modal", "modal/modal-header", "modal/modal-body", "modal/modal-footer", "autofocus/autofocus", "modal/models"], function (exports_12, context_12) {
    "use strict";
    var __moduleName = context_12 && context_12.id;
    var core_7, common_1, modal_service_2, modal_4, modal_header_1, modal_body_1, modal_footer_1, autofocus_1, BsModalModule;
    var exportedNames_1 = {
        "BsModalModule": true
    };
    function exportStar_1(m) {
        var exports = {};
        for (var n in m) {
            if (n !== "default" && !exportedNames_1.hasOwnProperty(n)) exports[n] = m[n];
        }
        exports_12(exports);
    }
    return {
        setters: [
            function (core_7_1) {
                core_7 = core_7_1;
            },
            function (common_1_1) {
                common_1 = common_1_1;
            },
            function (modal_service_2_1) {
                modal_service_2 = modal_service_2_1;
                exportStar_1(modal_service_2_1);
            },
            function (modal_4_1) {
                modal_4 = modal_4_1;
                exportStar_1(modal_4_1);
            },
            function (modal_header_1_1) {
                modal_header_1 = modal_header_1_1;
                exportStar_1(modal_header_1_1);
            },
            function (modal_body_1_1) {
                modal_body_1 = modal_body_1_1;
                exportStar_1(modal_body_1_1);
            },
            function (modal_footer_1_1) {
                modal_footer_1 = modal_footer_1_1;
                exportStar_1(modal_footer_1_1);
            },
            function (autofocus_1_1) {
                autofocus_1 = autofocus_1_1;
            },
            function (models_3_1) {
                exportStar_1(models_3_1);
            }
        ],
        execute: function () {
            BsModalModule = (function () {
                function BsModalModule() {
                }
                return BsModalModule;
            }());
            BsModalModule = __decorate([
                core_7.NgModule({
                    imports: [
                        common_1.CommonModule
                    ],
                    declarations: [
                        modal_4.BsModalComponent,
                        modal_header_1.BsModalHeaderComponent,
                        modal_body_1.BsModalBodyComponent,
                        modal_footer_1.BsModalFooterComponent,
                        autofocus_1.BsAutofocusDirective
                    ],
                    providers: [
                        modal_service_2.BsModalService
                    ],
                    exports: [
                        modal_4.BsModalComponent,
                        modal_header_1.BsModalHeaderComponent,
                        modal_body_1.BsModalBodyComponent,
                        modal_footer_1.BsModalFooterComponent,
                        autofocus_1.BsAutofocusDirective
                    ]
                })
            ], BsModalModule);
            exports_12("BsModalModule", BsModalModule);
        }
    };
});
//# sourceMappingURL=ng2-bs3-modal.system.js.map