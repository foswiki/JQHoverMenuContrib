/*
 * HoverMenu
 *
 * Copyright (c) 2023-2025 Michael Daum https://michaeldaumconsulting.com
 *
 * Licensed under the GPL licenses http://www.gnu.org/licenses/gpl.html
 *
 */

"use strict";
(function($) {

  var defaults = {
    menu: "ul:first",
    timeout: 500,
    sensitivity: 3
  };

  function HoverMenu(elem, opts) {
    var self = this;

    self.elem = $(elem);
    self.opts = $.extend({}, defaults, self.elem.data(), opts);
    self.init();
  }

  HoverMenu.prototype.init = function () {
    var self = this;

    self.menu = self.elem.find(self.opts.menu);
    self.menu.addClass("foswikiHoverTarget");
    self.isLoading = false;
    self.isMenuDelayed = false;

    self.elem.hoverIntent({
      over: function() {
        self.delayMenu();
        self.show();
      }, 
      out: function() {
        self.hide();
      },
      timeout: self.opts.timeout,
      sensitivity: self.opts.sensitivity
    }).on("hide", function() {
      self.hide();
    }).on("click", function() {
      if (!self.isMenuDelayed) {
        if (!self.isLoading) {
          self.toggle();
        }
      } else {
        //console.log("menu is delayed");
      }
    }).find("a[href]").on("click", function() {
      self.delayMenu();
      self.menu.hide();
    });
  };

  HoverMenu.prototype.delayMenu = function() {
    var self = this;

    if (self.isMenuDelayed) {
      //console.log("menu is already delayed");
      return;
    }

    //console.log("delaying menu");
    self.isMenuDelayed = true;
    window.setTimeout(function() {
      //console.log("clearing menu delay");
      self.isMenuDelayed = false;
    }, 500);
  };

  HoverMenu.prototype.show = function() {
    var self = this;

    $(".foswikiHoverMenu").trigger("hide");
    self.menu.fadeIn({
      duration:"fast",
      start: function() {
        self.isLoading = true;
      },
      done: function() {
        self.isLoading = false;
      }
    });
  };

  HoverMenu.prototype.hide = function() {
    var self = this;

    self.menu.hide();
  };

  HoverMenu.prototype.toggle = function() {
    var self = this;

    if (self.menu.is(":visible")) {
      self.hide();
    } else {
      self.show();
    }
  };

  // plugin wrapper around the constructor
  $.fn.hoverMenu = function (opts) {
    return this.each(function () {
      if (!$.data(this, "HoverMenu")) {
        $.data(this, "HoverMenu", new HoverMenu(this, opts));
      }
    });
  };

  // Enable declarative widget instanziation
  $(".foswikiHoverMenu").livequery(function() {
    $(this).hoverMenu();
  });

})(jQuery);

