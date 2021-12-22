(async () => {
  const MessageResolver = (await import('../src/MessageResolver.js')).default;
  MessageResolver.setManifestResolver(file => import(`./fixtures/manifests/${file}.js`))
})();
