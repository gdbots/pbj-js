import MessageResolver from '../src/MessageResolver';
MessageResolver.setManifestResolver(file => import(`./fixtures/manifests/${file}`))
