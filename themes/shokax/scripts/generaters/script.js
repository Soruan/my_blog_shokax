var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var import_package = __toESM(require("../../package.json"));
var import_promises = __toESM(require("node:fs/promises"));
var import_esbuild = require("esbuild");
var import_utils = require("../utils");
var import_hexo_util = require("hexo-util");
hexo.extend.generator.register("script", async function(locals) {
  const config = hexo.config;
  const theme = hexo.theme.config;
  const siteConfig = {
    version: import_package.default.version,
    hostname: config.url,
    root: config.root,
    statics: theme.statics,
    favicon: {
      normal: theme.assets + "/favicon.ico",
      hidden: theme.assets + "/failure.ico"
    },
    darkmode: theme.darkmode,
    auto_dark: theme.auto_dark,
    auto_scroll: theme.auto_scroll,
    css: {
      katex: (0, import_utils.getVendorLink)(hexo, theme.vendors.css.katex),
      mermaid: {
        url: theme.css + "/mermaid.css",
        local: true,
        sri: ""
      }
    },
    loader: theme.loader,
    search: null,
    outime: {
      enable: theme.outime.enable,
      days: theme.outime.days
    },
    playerAPI: theme.playerAPI,
    experiments: {
      copyrightLength: theme.experiments.copyrightLength
    },
    audio: void 0,
    fireworks: theme.fireworks && theme.fireworks.enable && theme.fireworks.options ? theme.fireworks.options : void 0,
    waline: {
      serverURL: theme.waline.serverURL,
      lang: theme.waline.lang,
      locale: theme.waline.locale,
      emoji: theme.waline.emoji,
      meta: theme.waline.meta,
      requiredMeta: theme.waline.requiredMeta,
      wordLimit: theme.waline.wordLimit,
      pageSize: theme.waline.pageSize,
      pageview: theme.waline.pageview,
      recaptchaV3Key: theme.waline.recaptchaV3Key,
      turnstileKey: theme.waline.turnstileKey
    },
    twikoo: {
      envId: theme.twikoo.envId,
      region: theme.twikoo.region
    }
  };
  if (config?.algolia) {
    siteConfig.search = {
      appID: config.algolia.appId,
      apiKey: config.algolia.apiKey,
      indexName: config.algolia.indexName,
      hits: theme.search.hits
    };
  }
  if (theme?.audio) {
    siteConfig.audio = theme.audio;
  }
  let enterPoint, patchDir;
  try {
    await import_promises.default.readFile("themes/shokaX/source/js/_app/pjax/siteInit.ts", "utf-8");
    enterPoint = "themes/shokaX/source/js/_app/pjax/siteInit.ts";
    patchDir = "themes/shokaX/source/js/_app/components/cloudflare.ts";
  } catch (e) {
    enterPoint = "node_modules/hexo-theme-shokax/source/js/_app/pjax/siteInit.ts";
    patchDir = "node_modules/hexo-theme-shokax/source/js/_app/components/cloudflare.ts";
  }
  const resultApp = await (0, import_esbuild.build)({
    write: false,
    entryPoints: [enterPoint],
    bundle: true,
    outdir: "shokaxTemp",
    tsconfigRaw: {
      compilerOptions: {
        target: "ES2022",
        esModuleInterop: true,
        module: "ESNext",
        moduleResolution: "Node",
        skipLibCheck: true
      }
    },
    platform: "browser",
    format: "esm",
    target: ["es2022"],
    minify: !theme.modules.debug,
    legalComments: "linked",
    mainFields: ["module", "browser", "main"],
    splitting: true,
    define: {
      __shokax_player__: theme.modules.player ? "true" : "false",
      __shokax_VL__: theme.modules.visibilityListener ? "true" : "false",
      __shokax_fireworks__: theme.fireworks && theme.fireworks.enable && theme.fireworks.options && theme.modules.fireworks ? "true" : "false",
      __shokax_search__: config?.algolia ? "true" : "false",
      __shokax_outime__: theme.outime.enable ? "true" : "false",
      __shokax_tabs__: theme.modules.tabs ? "true" : "false",
      __shokax_quiz__: theme.modules.quiz ? "true" : "false",
      __shokax_waline__: theme.waline.enable ? "true" : "false",
      __shokax_twikoo__: theme.twikoo.enable ? "true" : "false",
      __shokax_antiFakeWebsite__: theme.experiments.antiFakeWebsite ? "true" : "false",
      shokax_CONFIG: JSON.stringify(siteConfig),
      shokax_siteURL: "'" + config.url + "'"
    }
  });
  const res = [];
  resultApp.outputFiles.forEach((file) => {
    let fileName = "";
    if (file.path.split("\\").length > 1) {
      fileName = file.path.split("\\").pop();
    } else {
      fileName = file.path.split("/").pop();
    }
    if (file.path.endsWith(".js")) {
      res.push({
        path: theme.js + "/" + fileName,
        data: file.text
      });
    } else if (file.path.endsWith(".css")) {
      res.push({
        path: theme.css + "/" + fileName,
        data: file.text
      });
    } else {
      res.push({
        path: theme.statics + "/" + fileName,
        data: file.text
      });
    }
  });
  hexo.extend.helper.register("preloadjs", function() {
    let resultHtml = "";
    res.forEach((file) => {
      if (file.path.endsWith(".js")) {
        resultHtml += (0, import_hexo_util.htmlTag)("link", { rel: "modulepreload", href: import_hexo_util.url_for.call(this, file.path) }, "");
      }
    });
    return resultHtml;
  });
  hexo.extend.helper.register("load_async_css", function() {
    let resultHtml = "";
    res.forEach((file) => {
      if (file.path.endsWith(".css")) {
        resultHtml += (0, import_hexo_util.htmlTag)("link", { rel: "stylesheet", href: import_hexo_util.url_for.call(this, file.path), media: "none", onload: "this.media='all'" }, "");
      }
    });
    return resultHtml;
  });
  if (theme.modules.cloudflarePatch) {
    const resultCF = await (0, import_esbuild.build)({
      write: false,
      entryPoints: [patchDir],
      bundle: true,
      platform: "browser",
      format: "iife",
      tsconfigRaw: {
        compilerOptions: {
          target: "ES2022",
          esModuleInterop: true,
          module: "ESNext",
          moduleResolution: "Node",
          skipLibCheck: true
        }
      },
      target: ["es2022"],
      minify: !theme.modules.debug,
      outfile: "cf-patch.js"
    });
    res.push({
      path: theme.js + "/cf-patch.js",
      data: resultCF.outputFiles[0].text
    });
  }
  return res;
});
