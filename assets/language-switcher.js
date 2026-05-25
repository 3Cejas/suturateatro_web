(function () {
  var SOURCE_LANGUAGE = "es";
  var SUPPORTED_LANGUAGES = ["es", "en", "fr"];
  var LABELS = {
    es: "🇪🇸",
    en: "🇬🇧",
    fr: "🇫🇷"
  };
  var LANGUAGE_NAMES = {
    es: "español",
    en: "inglés",
    fr: "francés"
  };

  function cookieDomainCandidates() {
    var host = window.location.hostname;
    var domains = [""];

    if (host && host.indexOf(".") !== -1) {
      domains.push(host);
      domains.push("." + host);
    }

    return domains;
  }

  function setTranslateCookie(language) {
    var value = "/".concat(SOURCE_LANGUAGE, "/").concat(language);
    var expires = "Fri, 31 Dec 9999 23:59:59 GMT";

    cookieDomainCandidates().forEach(function (domain) {
      var cookie = "googtrans=".concat(value, "; expires=").concat(expires, "; path=/");
      if (domain) {
        cookie += "; domain=".concat(domain);
      }
      document.cookie = cookie;
    });
  }

  function clearTranslateCookie() {
    cookieDomainCandidates().forEach(function (domain) {
      var cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
      if (domain) {
        cookie += "; domain=".concat(domain);
      }
      document.cookie = cookie;
    });
  }

  function getCurrentLanguage() {
    var match = document.cookie.match(/(?:^|;\s*)googtrans=\/[^/]+\/([^;]+)/);
    var language = match ? decodeURIComponent(match[1]) : SOURCE_LANGUAGE;
    return SUPPORTED_LANGUAGES.indexOf(language) === -1 ? SOURCE_LANGUAGE : language;
  }

  function switchLanguage(language) {
    if (SUPPORTED_LANGUAGES.indexOf(language) === -1) {
      return;
    }

    if (language === SOURCE_LANGUAGE) {
      clearTranslateCookie();
    } else {
      setTranslateCookie(language);
    }

    window.location.reload();
  }

  function pinSwitcherToViewport(switcher) {
    switcher.style.setProperty("position", "fixed", "important");
    switcher.style.setProperty("top", "auto", "important");
    switcher.style.setProperty("right", "max(12px, env(safe-area-inset-right))", "important");
    switcher.style.setProperty("bottom", "max(12px, env(safe-area-inset-bottom))", "important");
    switcher.style.setProperty("left", "auto", "important");
    switcher.style.setProperty("width", "auto", "important");
    switcher.style.setProperty("max-width", "calc(100vw - 24px)", "important");
    switcher.style.setProperty("z-index", "2147483647", "important");
    switcher.style.setProperty("transform", "none", "important");
  }

  function renderSwitcher() {
    var existingSwitcher = document.querySelector(".sutura-language-switcher");
    if (existingSwitcher) {
      pinSwitcherToViewport(existingSwitcher);
      return;
    }

    var current = getCurrentLanguage();
    var switcher = document.createElement("div");
    switcher.className = "sutura-language-switcher notranslate";
    switcher.setAttribute("translate", "no");
    switcher.setAttribute("aria-label", "Selector de idioma");
    pinSwitcherToViewport(switcher);

    var label = document.createElement("span");
    label.className = "sutura-language-switcher__label";
    label.textContent = "Idioma";
    switcher.appendChild(label);

    SUPPORTED_LANGUAGES.forEach(function (language) {
      var button = document.createElement("button");
      button.type = "button";
      button.className = "sutura-language-switcher__button";
      button.dataset.lang = language;
      button.textContent = LABELS[language];
      button.setAttribute("aria-label", "Cambiar idioma a " + LANGUAGE_NAMES[language]);
      button.setAttribute("title", LANGUAGE_NAMES[language]);
      button.setAttribute("aria-pressed", language === current ? "true" : "false");
      button.addEventListener("click", function () {
        switchLanguage(language);
      });
      switcher.appendChild(button);
    });

    document.body.appendChild(switcher);
    pinSwitcherToViewport(switcher);
  }

  function loadGoogleTranslate() {
    if (document.getElementById("google_translate_element")) {
      return;
    }

    var target = document.createElement("div");
    target.id = "google_translate_element";
    target.className = "notranslate";
    target.setAttribute("translate", "no");
    document.body.appendChild(target);

    window.googleTranslateElementInit = function () {
      new window.google.translate.TranslateElement({
        pageLanguage: SOURCE_LANGUAGE,
        includedLanguages: SUPPORTED_LANGUAGES.join(","),
        autoDisplay: false
      }, "google_translate_element");
    };

    var script = document.createElement("script");
    script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.body.appendChild(script);
  }

  function initMobileNavigation() {
    var header = document.querySelector(".eu-header");
    if (!header) {
      return;
    }

    var nav = header.querySelector(".eu-nav");
    var logo = header.querySelector(".eu-logo");
    if (!nav || !logo) {
      return;
    }

    if (!nav.id) {
      nav.id = "sutura-main-nav";
    }

    var toggle = header.querySelector(".sutura-nav-toggle");
    if (!toggle) {
      toggle = document.createElement("button");
      toggle.className = "sutura-nav-toggle";
      toggle.innerHTML = '<span class="sutura-nav-toggle__lines" aria-hidden="true"></span>';
      logo.insertAdjacentElement("afterend", toggle);
    }

    toggle.type = "button";
    toggle.setAttribute("aria-label", "Abrir menú");
    toggle.setAttribute("aria-controls", nav.id);
    toggle.setAttribute("aria-expanded", "false");
    if (!toggle.querySelector(".sutura-nav-toggle__lines")) {
      toggle.innerHTML = '<span class="sutura-nav-toggle__lines" aria-hidden="true"></span>';
    }

    var submenuItems = Array.prototype.slice.call(header.querySelectorAll(".eu-nav-item--has-menu"));

    function getDirectLink(item) {
      return Array.prototype.slice.call(item.children).find(function (child) {
        return child.tagName && child.tagName.toLowerCase() === "a";
      });
    }

    function closeSubmenus(exceptItem) {
      submenuItems.forEach(function (item) {
        if (item === exceptItem) {
          return;
        }

        item.classList.remove("is-submenu-open");
        var link = getDirectLink(item);
        if (link) {
          link.setAttribute("aria-expanded", "false");
        }
      });
    }

    submenuItems.forEach(function (item, index) {
      var link = getDirectLink(item);
      var subnav = item.querySelector(".eu-subnav");
      if (!link || !subnav) {
        return;
      }

      if (!subnav.id) {
        subnav.id = "sutura-subnav-" + (index + 1);
      }
      link.setAttribute("aria-haspopup", "true");
      link.setAttribute("aria-controls", subnav.id);
      link.setAttribute("aria-expanded", "false");
    });

    function setOpen(isOpen) {
      header.classList.toggle("is-nav-open", isOpen);
      document.body.classList.toggle("is-sutura-nav-open", isOpen);
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      toggle.setAttribute("aria-label", isOpen ? "Cerrar menú" : "Abrir menú");
      if (!isOpen) {
        closeSubmenus();
      }
    }

    toggle.addEventListener("click", function () {
      setOpen(!header.classList.contains("is-nav-open"));
    });

    nav.addEventListener("click", function (event) {
      var link = event.target.closest("a");
      if (!link) {
        return;
      }

      var submenuItem = link.parentElement && link.parentElement.classList.contains("eu-nav-item--has-menu")
        ? link.parentElement
        : null;

      if (submenuItem && window.innerWidth <= 820) {
        event.preventDefault();
        var willOpen = !submenuItem.classList.contains("is-submenu-open");
        closeSubmenus(submenuItem);
        submenuItem.classList.toggle("is-submenu-open", willOpen);
        link.setAttribute("aria-expanded", willOpen ? "true" : "false");
        return;
      }

      setOpen(false);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 820) {
        setOpen(false);
      }
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initMobileNavigation();
    renderSwitcher();
    loadGoogleTranslate();
  });
}());
