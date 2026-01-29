// vite.config.js
import { defineConfig } from "file:///C:/Users/Shindiri/Desktop/Blits/my-blits-app/node_modules/vite/dist/node/index.js";
import blitsVitePlugins from "file:///C:/Users/Shindiri/Desktop/Blits/my-blits-app/node_modules/@lightningjs/blits/vite/index.js";
var vite_config_default = defineConfig(({ command, mode, ssrBuild }) => {
  return {
    base: "/",
    // Set to your base path if you are deploying to a subdirectory (example: /myApp/)
    plugins: [...blitsVitePlugins],
    resolve: {
      mainFields: ["browser", "module", "jsnext:main", "jsnext"]
    },
    server: {
      headers: {
        "Cross-Origin-Opener-Policy": "same-origin",
        "Cross-Origin-Embedder-Policy": "require-corp"
      },
      fs: {
        allow: [".."]
      }
    },
    worker: {
      format: "es"
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxTaGluZGlyaVxcXFxEZXNrdG9wXFxcXEJsaXRzXFxcXG15LWJsaXRzLWFwcFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcU2hpbmRpcmlcXFxcRGVza3RvcFxcXFxCbGl0c1xcXFxteS1ibGl0cy1hcHBcXFxcdml0ZS5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL1NoaW5kaXJpL0Rlc2t0b3AvQmxpdHMvbXktYmxpdHMtYXBwL3ZpdGUuY29uZmlnLmpzXCI7Ly8vIDxyZWZlcmVuY2UgdHlwZXM9XCJ2aXRlL2NsaWVudFwiIC8+XG5cbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnXG5pbXBvcnQgYmxpdHNWaXRlUGx1Z2lucyBmcm9tICdAbGlnaHRuaW5nanMvYmxpdHMvdml0ZSdcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKCh7IGNvbW1hbmQsIG1vZGUsIHNzckJ1aWxkIH0pID0+IHtcbiAgcmV0dXJuIHtcbiAgICBiYXNlOiAnLycsIC8vIFNldCB0byB5b3VyIGJhc2UgcGF0aCBpZiB5b3UgYXJlIGRlcGxveWluZyB0byBhIHN1YmRpcmVjdG9yeSAoZXhhbXBsZTogL215QXBwLylcbiAgICBwbHVnaW5zOiBbLi4uYmxpdHNWaXRlUGx1Z2luc10sXG4gICAgcmVzb2x2ZToge1xuICAgICAgbWFpbkZpZWxkczogWydicm93c2VyJywgJ21vZHVsZScsICdqc25leHQ6bWFpbicsICdqc25leHQnXSxcbiAgICB9LFxuICAgIHNlcnZlcjoge1xuICAgICAgaGVhZGVyczoge1xuICAgICAgICAnQ3Jvc3MtT3JpZ2luLU9wZW5lci1Qb2xpY3knOiAnc2FtZS1vcmlnaW4nLFxuICAgICAgICAnQ3Jvc3MtT3JpZ2luLUVtYmVkZGVyLVBvbGljeSc6ICdyZXF1aXJlLWNvcnAnLFxuICAgICAgfSxcbiAgICAgIGZzOiB7XG4gICAgICAgIGFsbG93OiBbJy4uJ10sXG4gICAgICB9LFxuICAgIH0sXG4gICAgd29ya2VyOiB7XG4gICAgICBmb3JtYXQ6ICdlcycsXG4gICAgfSxcbiAgfVxufSlcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFFQSxTQUFTLG9CQUFvQjtBQUM3QixPQUFPLHNCQUFzQjtBQUU3QixJQUFPLHNCQUFRLGFBQWEsQ0FBQyxFQUFFLFNBQVMsTUFBTSxTQUFTLE1BQU07QUFDM0QsU0FBTztBQUFBLElBQ0wsTUFBTTtBQUFBO0FBQUEsSUFDTixTQUFTLENBQUMsR0FBRyxnQkFBZ0I7QUFBQSxJQUM3QixTQUFTO0FBQUEsTUFDUCxZQUFZLENBQUMsV0FBVyxVQUFVLGVBQWUsUUFBUTtBQUFBLElBQzNEO0FBQUEsSUFDQSxRQUFRO0FBQUEsTUFDTixTQUFTO0FBQUEsUUFDUCw4QkFBOEI7QUFBQSxRQUM5QixnQ0FBZ0M7QUFBQSxNQUNsQztBQUFBLE1BQ0EsSUFBSTtBQUFBLFFBQ0YsT0FBTyxDQUFDLElBQUk7QUFBQSxNQUNkO0FBQUEsSUFDRjtBQUFBLElBQ0EsUUFBUTtBQUFBLE1BQ04sUUFBUTtBQUFBLElBQ1Y7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
