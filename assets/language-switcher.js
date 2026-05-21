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

  function renderSwitcher() {
    if (document.querySelector(".sutura-language-switcher")) {
      return;
    }

    var current = getCurrentLanguage();
    var switcher = document.createElement("div");
    switcher.className = "sutura-language-switcher notranslate";
    switcher.setAttribute("translate", "no");
    switcher.setAttribute("aria-label", "Selector de idioma");

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

  document.addEventListener("DOMContentLoaded", function () {
    renderSwitcher();
    loadGoogleTranslate();
  });
}());
