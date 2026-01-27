'use client';

import { useEffect } from 'react';

export default function ClientRuntimeLogger() {
  useEffect(() => {
    const logPrefix = '[LiveWidgets][client]';
    const snapshotDom = (label: string) => {
      const html = document.documentElement;
      const body = document.body;
      const htmlChildren = html ? Array.from(html.children).map((node) => node.tagName) : [];
      const bodyChildren = body ? Array.from(body.children).map((node) => node.tagName) : [];
      const extraDocumentChildren = Array.from(document.childNodes).map((node) => ({
        nodeType: node.nodeType,
        nodeName: node.nodeName
      }));
      const htmlCount = document.getElementsByTagName('html').length;
      const bodyCount = document.getElementsByTagName('body').length;
      const headCount = document.getElementsByTagName('head').length;
      const doctype = document.doctype ? `<!DOCTYPE ${document.doctype.name}>` : 'none';
      const htmlPreview = html?.outerHTML?.slice(0, 300) ?? '';
      const bodyPreview = body?.outerHTML?.slice(0, 300) ?? '';

      console.info(logPrefix, 'dom snapshot', label, {
        readyState: document.readyState,
        doctype,
        htmlCount,
        headCount,
        bodyCount,
        documentElement: html?.tagName,
        bodyTag: body?.tagName,
        htmlChildren,
        bodyChildren,
        documentChildren: extraDocumentChildren,
        scripts: Array.from(document.scripts).map((script) => script.src || '[inline]'),
        htmlPreview,
        bodyPreview
      });
    };

    console.info(logPrefix, 'hydration start', {
      href: window.location.href,
      userAgent: navigator.userAgent
    });
    snapshotDom('initial');

    const handleError = (event: ErrorEvent) => {
      console.error(logPrefix, 'window error', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error
      });
    };

    const handleRejection = (event: PromiseRejectionEvent) => {
      console.error(logPrefix, 'unhandled rejection', event.reason);
    };

    const handleDomContentLoaded = () => snapshotDom('dom-content-loaded');
    const handleWindowLoad = () => snapshotDom('window-load');

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleRejection);
    document.addEventListener('DOMContentLoaded', handleDomContentLoaded);
    window.addEventListener('load', handleWindowLoad);

    const observer = new MutationObserver((mutations) => {
      const mutationSummary = mutations.map((mutation) => ({
        type: mutation.type,
        target: mutation.target.nodeName,
        added: Array.from(mutation.addedNodes).map((node) => node.nodeName),
        removed: Array.from(mutation.removedNodes).map((node) => node.nodeName)
      }));
      console.info(logPrefix, 'dom mutation', mutationSummary);
    });

    if (document.documentElement) {
      observer.observe(document.documentElement, {
        childList: true,
        subtree: true
      });
    }

    console.info(logPrefix, 'listeners attached');
    requestAnimationFrame(() => snapshotDom('raf-1'));
    requestAnimationFrame(() => snapshotDom('raf-2'));

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleRejection);
      document.removeEventListener('DOMContentLoaded', handleDomContentLoaded);
      window.removeEventListener('load', handleWindowLoad);
      observer.disconnect();
      console.info(logPrefix, 'listeners detached');
    };
  }, []);

  return null;
}
