export default {
  "branches": [
    "main",
    { "name": "dev", "prerelease": "beta" }
  ],
  "plugins": [
    [ "@semantic-release/commit-analyzer", { preset: 'conventionalcommits' } ],
    [ "@semantic-release/release-notes-generator", { preset: 'conventionalcommits' } ],
    [ "@semantic-release/npm", { npmPublish: true } ],
    [ "@semantic-release/github", { assets: [ "dist/**" ] } ],
  ]
}
