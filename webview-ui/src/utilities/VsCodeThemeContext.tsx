import React from "react";
import { VsCodeTheme } from "../types";

/**
 * The context for the current VsCode theme. Used throughout the webview to
 * determine how to style components.
 */
export const VsCodeThemeContext = React.createContext(VsCodeTheme.Dark);

/**
 * Returns the VsCodeTheme based on the CSS classes of the <body> element
 * Based on https://code.visualstudio.com/api/extension-guides/webview#theming-webview-content
 *
 * @param classes The CSS classes of the <body> element separated by spaces (e.g., "vscode-high-contrast-light vscode-high-contrast")
 * @returns The VsCodeTheme, or undefined if no theme is found
 */
export function getVsCodeThemeFromCssClasses(
  classes: string,
): VsCodeTheme | undefined {
  if (classes.includes("vscode-light")) {
    return VsCodeTheme.Light;
  } else if (classes.includes("vscode-dark")) {
    return VsCodeTheme.Dark;
  } else if (classes.includes("vscode-high-contrast-light")) {
    // To get high-contrast-light, the <body> wil also have the "vscode-high-contrast" class
    return VsCodeTheme.HighContrastLight;
  } else if (classes.includes("vscode-high-contrast")) {
    // To get high-contrast-dark, the <body> will just use the "vscode-high-contrast" class
    return VsCodeTheme.HighContrastDark;
  } else {
    return undefined;
  }
}
